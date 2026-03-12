import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  ColDef,
  GetContextMenuItems,
  GetContextMenuItemsParams,
  GetRowIdParams,
  GridApi,
  GridReadyEvent,
  RowClickedEvent,
} from 'ag-grid-community';

import { HistoryAuditActivityColumns, HistoryAuditTimestampColumn } from './components/columns';

import { formatHistoryAuditRelativeTime, formatHistoryAuditTimestamp } from './utils';

import { HISTORY_AUDIT_COLUMN_IDS } from './constants/historyAuditColumnIds';
import { HISTORY_AUDIT_ALL_MODULES_VALUE, HISTORY_AUDIT_LABELS } from './constants';
import type {
  HistoryAuditTrailEvent,
  HistoryAuditTrailModuleOption,
  HistoryAuditTrailTableRow,
  UseHistoryAuditTrailParams,
} from './types';
import type { BadgeColorPreset } from '../../types';

const toQuickFilterText = (...values: Array<string | null | undefined>) =>
  values.filter((value): value is string => Boolean(value)).join(' ');

const parseHistoryAuditQuickFilter = (quickFilterText: string) => {
  const text = quickFilterText.trim();
  if (!text) return [];

  // Support quoted phrases while keeping space-delimited search for unquoted input.
  return (text.match(/"[^"]+"|[^\s]+/g) ?? [])
    .map((part) => {
      const token = part.trim();
      if (token.startsWith('"') && token.endsWith('"')) {
        return token.slice(1, -1).trim();
      }
      return token;
    })
    .filter(Boolean);
};

const getActivityQuickFilterText = (data: HistoryAuditTrailTableRow) =>
  toQuickFilterText(
    data.actor,
    data.event.createdBy,
    data.badge,
    data.moduleBadge,
    data.action,
    data.details,
    data.changeFrom,
    data.changeTo,
    // Keep quick filter aligned with user-visible content in the Activity cell.
    // Avoid indexing hidden/internal fields that can produce false-positive matches.
    ...(data.event.fieldChanges ?? []).flatMap((change) => [
      change.fieldName,
      change.oldValue,
      change.newValue,
    ]),
    ...(data.event.additionalDetails ?? []).flatMap((item) => [item.key, item.value]),
  );

const getTimestampQuickFilterText = (data: HistoryAuditTrailTableRow) =>
  // Only searchable timestamp strings that are visible in the Timestamp column.
  toQuickFilterText(data.timeAgo, data.timestamp);

const getRowQuickFilterText = (data: HistoryAuditTrailTableRow) =>
  toQuickFilterText(getActivityQuickFilterText(data), getTimestampQuickFilterText(data));

const getActivityExportText = (data: HistoryAuditTrailTableRow) => {
  const changeText =
    data.changeFrom && data.changeTo ? `${data.changeFrom} -> ${data.changeTo}` : undefined;

  const fieldChangesText = (data.event.fieldChanges ?? [])
    .map((c) =>
      toQuickFilterText(
        c.fieldName ? `Field: ${c.fieldName}` : undefined,
        c.oldValue != null || c.newValue != null
          ? `${c.oldValue ?? ''} -> ${c.newValue ?? ''}`
          : '',
      ),
    )
    .filter(Boolean)
    .join(' | ');

  const additionalDetailsText = (data.event.additionalDetails ?? [])
    .map((i) => `${i.key}: ${i.value}`)
    .filter(Boolean)
    .join(' | ');

  return toQuickFilterText(
    data.actor,
    data.event.createdBy,
    data.badge,
    data.moduleBadge,
    data.action,
    data.details,
    changeText,
    fieldChangesText,
    additionalDetailsText,
  );
};

const getTimestampExportText = (data: HistoryAuditTrailTableRow) =>
  toQuickFilterText(data.timestamp, data.timeAgo);

const getEventChangeValues = (event: HistoryAuditTrailEvent) => {
  if (event.oldValue != null || event.newValue != null) {
    return {
      changeFrom: event.oldValue ?? null,
      changeTo: event.newValue ?? null,
    };
  }

  const firstFieldChange = event.fieldChanges?.[0];
  return {
    changeFrom: firstFieldChange?.oldValue ?? null,
    changeTo: firstFieldChange?.newValue ?? null,
  };
};

const getFieldChangesSummary = (event: HistoryAuditTrailEvent) => {
  const fieldChangesCount = event.fieldChanges?.length ?? 0;
  if (fieldChangesCount === 1) {
    const fieldName = event.fieldChanges?.[0]?.fieldName?.trim();
    return fieldName ? `Field: ${fieldName}` : null;
  }

  if (fieldChangesCount <= 1) return null;
  return `${fieldChangesCount} fields changed`;
};

const MODULE_BADGE_COLOR_PRESETS: BadgeColorPreset[] = ['info', 'warning', 'success', 'neutral'];

const sourceToModuleName = (source: string): string => {
  const parts = source.split('/').filter(Boolean);
  const modulePart = parts.length >= 2 ? parts[parts.length - 2] : source;

  if (modulePart.toLowerCase() === 'package') return 'Capital Event';

  return modulePart
    .split('-')
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(' ');
};

const buildModuleOption = (source: string): HistoryAuditTrailModuleOption => ({
  name: sourceToModuleName(source),
  value: source,
});

export const useHistoryAuditTrail = ({
  events,
  actionStyles,
  defaultActionStyle,
  onItemClick,
  countLabel,
  onClear,
  enableExport = false,
  exportFileName = 'history-audit-trail',
  moduleSources,
  primaryModuleSource,
  moduleFilterCallback,
  onModuleSourceChange,
  allModulesLabel = 'All Modules',
}: UseHistoryAuditTrailParams) => {
  const handleModuleSourceChange = useCallback(
    (value: string) => {
      setSelectedModuleSource(value);
      onModuleSourceChange?.(value);
    },
    [onModuleSourceChange],
  );

  const [quickFilterText, setQuickFilterText] = useState('');
  const [selectedModuleSource, setSelectedModuleSource] = useState(HISTORY_AUDIT_ALL_MODULES_VALUE);
  const gridApiRef = useRef<GridApi<HistoryAuditTrailTableRow> | null>(null);
  const isInteractive = Boolean(onItemClick);

  const moduleOptions = useMemo<HistoryAuditTrailModuleOption[]>(() => {
    const eventSources = new Set(
      events.map((event) => event.source).filter((source): source is string => Boolean(source)),
    );

    const configuredSources =
      moduleSources?.filter((source) => eventSources.has(source)).map((source) => source) ?? [];

    const sources =
      configuredSources.length > 0 ? configuredSources : Array.from(eventSources).sort();

    return sources.map(buildModuleOption);
  }, [events, moduleSources]);

  const isMultiModule = moduleOptions.length > 1;

  const resolvedPrimaryModuleSource = useMemo(() => {
    if (primaryModuleSource) return primaryModuleSource;
    if (moduleSources && moduleSources.length > 0) return moduleSources[0];
    return moduleOptions[0]?.value;
  }, [primaryModuleSource, moduleSources, moduleOptions]);

  const secondaryModuleColorBySource = useMemo(() => {
    const secondarySources = moduleOptions
      .map((option) => option.value)
      .filter((value) => value !== resolvedPrimaryModuleSource)
      .sort();

    return secondarySources.reduce<Map<string, BadgeColorPreset>>((colorMap, source, index) => {
      const moduleColor = MODULE_BADGE_COLOR_PRESETS[index % MODULE_BADGE_COLOR_PRESETS.length];
      colorMap.set(source, moduleColor);
      return colorMap;
    }, new Map<string, BadgeColorPreset>());
  }, [moduleOptions, resolvedPrimaryModuleSource]);

  const filteredEvents = useMemo(() => {
    const visibleEvents =
      !isMultiModule || selectedModuleSource === HISTORY_AUDIT_ALL_MODULES_VALUE
        ? events
        : events.filter((event) => {
            if (moduleFilterCallback) {
              return moduleFilterCallback(event, selectedModuleSource);
            }

            return event.source === selectedModuleSource;
          });

    return [...visibleEvents].sort((a, b) => {
      const left = new Date(a.timestamp).getTime();
      const right = new Date(b.timestamp).getTime();

      if (Number.isNaN(left) && Number.isNaN(right)) return 0;
      if (Number.isNaN(left)) return 1;
      if (Number.isNaN(right)) return -1;
      return right - left;
    });
  }, [events, moduleFilterCallback, selectedModuleSource, isMultiModule]);

  const moduleLabelBySource = useMemo(
    () =>
      moduleOptions.reduce<Map<string, string>>((moduleMap, moduleOption) => {
        moduleMap.set(moduleOption.value, moduleOption.name);
        return moduleMap;
      }, new Map<string, string>()),
    [moduleOptions],
  );

  const moduleDropdown = useMemo(
    () =>
      isMultiModule && moduleOptions.length > 0
        ? {
            value: selectedModuleSource,
            options: moduleOptions,
            onValueChange: handleModuleSourceChange,
            allModulesLabel,
          }
        : undefined,
    [allModulesLabel, handleModuleSourceChange, isMultiModule, moduleOptions, selectedModuleSource],
  );

  const resolveModuleBadge = useCallback(
    (event: HistoryAuditTrailEvent) => {
      if (!isMultiModule || !event.source || event.source === resolvedPrimaryModuleSource) {
        return null;
      }

      const moduleName = moduleLabelBySource.get(event.source) ?? sourceToModuleName(event.source);
      return {
        label: moduleName,
        color: secondaryModuleColorBySource.get(event.source) ?? null,
      };
    },
    [isMultiModule, moduleLabelBySource, resolvedPrimaryModuleSource, secondaryModuleColorBySource],
  );

  const rowData = useMemo<HistoryAuditTrailTableRow[]>(() => {
    const now = new Date();
    return filteredEvents.map((e) => {
      const isSystemUser = e.username?.toUpperCase?.() === HISTORY_AUDIT_LABELS.SYSTEM_USERNAME;
      const moduleBadge = resolveModuleBadge(e);
      const { changeFrom, changeTo } = getEventChangeValues(e);
      const fieldChangesSummary = getFieldChangesSummary(e);

      return {
        id: e.id,
        event: e,
        actor: isSystemUser ? HISTORY_AUDIT_LABELS.SYSTEM_LABEL : e.username,
        badge: isSystemUser ? HISTORY_AUDIT_LABELS.SYSTEM_BADGE : null,
        moduleBadge: moduleBadge?.label ?? null,
        moduleBadgeColor: moduleBadge?.color ?? null,
        action: e.subject ?? HISTORY_AUDIT_LABELS.DEFAULT_ACTION,
        details: e.details ?? fieldChangesSummary,
        changeFrom,
        changeTo,
        timeAgo:
          formatHistoryAuditRelativeTime(e.timestamp, now) ?? HISTORY_AUDIT_LABELS.UNKNOWN_TIME,
        timestamp: formatHistoryAuditTimestamp(e.timestamp),
      };
    });
  }, [filteredEvents, resolveModuleBadge]);

  const defaultColDef = useMemo<ColDef<HistoryAuditTrailTableRow>>(
    () => ({ resizable: false, sortable: false }),
    [],
  );

  const quickFilterParts = useMemo(
    () => parseHistoryAuditQuickFilter(quickFilterText).map((part) => part.toUpperCase()),
    [quickFilterText],
  );

  const filteredRowCount = useMemo(() => {
    if (quickFilterParts.length === 0) return rowData.length;

    return rowData.reduce((count, row) => {
      const rowFilterText = getRowQuickFilterText(row).toUpperCase();
      const isMatch = quickFilterParts.every((part) => rowFilterText.includes(part));
      return isMatch ? count + 1 : count;
    }, 0);
  }, [rowData, quickFilterParts]);
  const isSearchActive = Boolean(quickFilterText.trim());
  const countLabelSuffix = countLabel ? countLabel.trim().replace(/^\d+\s*/, '') || 'events' : '';
  const totalCountForLabel =
    isMultiModule && selectedModuleSource !== HISTORY_AUDIT_ALL_MODULES_VALUE
      ? events.length
      : rowData.length;
  const displayedCountLabel = countLabel
    ? filteredRowCount < totalCountForLabel
      ? `${filteredRowCount} of ${totalCountForLabel} ${countLabelSuffix}`
      : `${filteredRowCount} ${countLabelSuffix}`
    : undefined;

  const handleClear = useCallback(() => {
    onClear?.();
  }, [onClear]);

  useEffect(() => {
    if (!isMultiModule) return;

    const selectedExists = moduleOptions.some(
      (moduleOption) => moduleOption.value === selectedModuleSource,
    );
    if (!selectedExists && selectedModuleSource !== HISTORY_AUDIT_ALL_MODULES_VALUE) {
      setSelectedModuleSource(HISTORY_AUDIT_ALL_MODULES_VALUE);
    }
  }, [isMultiModule, moduleOptions, selectedModuleSource]);

  const onGridReady = useCallback((event: GridReadyEvent<HistoryAuditTrailTableRow>) => {
    gridApiRef.current = event.api;
  }, []);

  const handleDownloadExcel = useCallback(() => {
    if (!enableExport) return;
    gridApiRef.current?.exportDataAsExcel({ fileName: `${exportFileName}.xlsx` });
  }, [enableExport, exportFileName]);

  const handleDownloadCsv = useCallback(() => {
    if (!enableExport) return;
    gridApiRef.current?.exportDataAsCsv({ fileName: `${exportFileName}.csv` });
  }, [enableExport, exportFileName]);

  const getContextMenuItems = useCallback<GetContextMenuItems<HistoryAuditTrailTableRow>>(
    (params: GetContextMenuItemsParams<HistoryAuditTrailTableRow>) => {
      const columnId = params.column?.getColId();
      const exportEnabledColumns = [
        HISTORY_AUDIT_COLUMN_IDS.ACTIVITY,
        HISTORY_AUDIT_COLUMN_IDS.TIME,
      ];
      const showExport =
        enableExport && columnId != null && exportEnabledColumns.includes(columnId);

      const items: ReturnType<GetContextMenuItems<HistoryAuditTrailTableRow>> = [
        'cut',
        'copy',
        'copyWithHeaders',
        'copyWithGroupHeaders',
        'paste',
      ];

      if (showExport) {
        items.push('separator');
        items.push({
          name: 'Export',
          subMenu: [
            {
              name: 'CSV Export',
              action: () => params.api.exportDataAsCsv({ fileName: `${exportFileName}.csv` }),
            },
            {
              name: 'Excel Export',
              action: () => params.api.exportDataAsExcel({ fileName: `${exportFileName}.xlsx` }),
            },
          ],
        });
      }

      return items;
    },
    [enableExport, exportFileName],
  );

  const columnDefs = useMemo<ColDef<HistoryAuditTrailTableRow>[]>(
    () => [
      {
        colId: HISTORY_AUDIT_COLUMN_IDS.ACTIVITY,
        headerName: 'Activity',
        cellRenderer: HistoryAuditActivityColumns,
        cellRendererParams: {
          actionStyles,
          defaultActionStyle,
        },
        valueGetter: ({ data }) => (data ? getActivityExportText(data) : ''),
        getQuickFilterText: ({ data }) => (data ? getActivityQuickFilterText(data) : ''),
        flex: 1,
        minWidth: 400,
        sortable: false,
        resizable: false,
      },
      {
        colId: HISTORY_AUDIT_COLUMN_IDS.TIME,
        headerName: 'Timestamp',
        cellRenderer: HistoryAuditTimestampColumn,
        valueGetter: ({ data }) => (data ? getTimestampExportText(data) : ''),
        getQuickFilterText: ({ data }) => (data ? getTimestampQuickFilterText(data) : ''),
        initialWidth: 160,
        sortable: false,
        resizable: false,
      },
    ],
    [actionStyles, defaultActionStyle],
  );

  const onRowClicked = useCallback(
    (ev: RowClickedEvent<HistoryAuditTrailTableRow>) => {
      if (!onItemClick) return;
      if (ev.data?.event) onItemClick(ev.data.event);
    },
    [onItemClick],
  );

  const getRowId = useCallback(
    (params: GetRowIdParams<HistoryAuditTrailTableRow>) => params.data.id,
    [],
  );

  return useMemo(
    () => ({
      rowData,
      defaultColDef,
      columnDefs,
      onRowClicked,
      getRowId,
      isInteractive,
      quickFilterText,
      quickFilterParser: parseHistoryAuditQuickFilter,
      setQuickFilterText,
      filteredRowCount,
      isSearchActive,
      displayedCountLabel,
      moduleDropdown,
      handleClear,
      onGridReady,
      handleDownloadExcel,
      handleDownloadCsv,
      getContextMenuItems,
      enableExport,
    }),
    [
      rowData,
      defaultColDef,
      columnDefs,
      onRowClicked,
      getRowId,
      isInteractive,
      quickFilterText,
      setQuickFilterText,
      filteredRowCount,
      isSearchActive,
      displayedCountLabel,
      moduleDropdown,
      handleClear,
      onGridReady,
      handleDownloadExcel,
      handleDownloadCsv,
      getContextMenuItems,
      enableExport,
    ],
  );
};
