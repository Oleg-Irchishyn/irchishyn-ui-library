import { useCallback, useMemo, useRef, useState } from 'react';
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
import { HISTORY_AUDIT_EVENT_TYPES, HISTORY_AUDIT_LABELS } from './constants';
import type { HistoryAuditTrailTableRow, UseHistoryAuditTrailParams } from './types';

const toQuickFilterText = (...values: Array<string | null | undefined>) =>
  values.filter((value): value is string => Boolean(value)).join(' ');

const getActivityQuickFilterText = (data: HistoryAuditTrailTableRow) =>
  toQuickFilterText(
    data.actor,
    data.badge,
    data.action,
    data.details,
    data.changeFrom,
    data.changeTo,
    data.event.username,
    data.event.subject,
    data.event.details,
    data.event.oldValue,
    data.event.newValue,
    data.event.auditEventType,
    data.event.source,
  );

const getTimestampQuickFilterText = (data: HistoryAuditTrailTableRow) =>
  toQuickFilterText(data.timeAgo, data.timestamp, data.event.timestamp);

const getRowQuickFilterText = (data: HistoryAuditTrailTableRow) =>
  toQuickFilterText(getActivityQuickFilterText(data), getTimestampQuickFilterText(data));

const getActivityExportText = (data: HistoryAuditTrailTableRow) => {
  const changeText =
    data.changeFrom && data.changeTo ? `${data.changeFrom} -> ${data.changeTo}` : undefined;

  return toQuickFilterText(data.actor, data.badge, data.action, data.details, changeText);
};

const getTimestampExportText = (data: HistoryAuditTrailTableRow) =>
  toQuickFilterText(data.timestamp, data.timeAgo);

export const useHistoryAuditTrail = ({
  events,
  onItemClick,
  countLabel,
  onClear,
  enableExport = false,
  exportFileName = 'history-audit-trail',
}: UseHistoryAuditTrailParams) => {
  const [quickFilterText, setQuickFilterText] = useState('');
  const gridApiRef = useRef<GridApi<HistoryAuditTrailTableRow> | null>(null);
  const isInteractive = Boolean(onItemClick);

  const rowData = useMemo<HistoryAuditTrailTableRow[]>(() => {
    const now = new Date();
    return events.map((e) => {
      const isSystemUser = e.username?.toUpperCase?.() === HISTORY_AUDIT_LABELS.SYSTEM_USERNAME;
      const isSystemEvent = isSystemUser || e.auditEventType === HISTORY_AUDIT_EVENT_TYPES.OTHER;

      return {
        id: e.id,
        event: e,
        actor: isSystemUser ? HISTORY_AUDIT_LABELS.SYSTEM_LABEL : e.username,
        badge: isSystemEvent ? HISTORY_AUDIT_LABELS.SYSTEM_BADGE : null,
        action: e.subject ?? HISTORY_AUDIT_LABELS.DEFAULT_ACTION,
        details: e.details ?? null,
        changeFrom: e.oldValue ?? null,
        changeTo: e.newValue ?? null,
        timeAgo:
          formatHistoryAuditRelativeTime(e.timestamp, now) ?? HISTORY_AUDIT_LABELS.UNKNOWN_TIME,
        timestamp: formatHistoryAuditTimestamp(e.timestamp),
      };
    });
  }, [events]);

  const defaultColDef = useMemo<ColDef<HistoryAuditTrailTableRow>>(
    () => ({ resizable: false, sortable: false }),
    [],
  );

  const quickFilterParts = useMemo(
    () => quickFilterText.trim().toUpperCase().split(/\s+/).filter(Boolean),
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
  const displayedCountLabel = countLabel ? `${filteredRowCount} ${countLabelSuffix}` : undefined;

  const handleClear = useCallback(() => {
    setQuickFilterText('');
    onClear?.();
  }, [onClear, setQuickFilterText]);

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
    [],
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
      setQuickFilterText,
      filteredRowCount,
      isSearchActive,
      displayedCountLabel,
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
      handleClear,
      onGridReady,
      handleDownloadExcel,
      handleDownloadCsv,
      getContextMenuItems,
      enableExport,
    ],
  );
};
