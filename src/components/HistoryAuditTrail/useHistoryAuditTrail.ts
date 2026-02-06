import { useCallback, useMemo } from 'react';
import type { ColDef, GetRowIdParams, RowClickedEvent } from 'ag-grid-community';

import { HistoryAuditActivityColumns, HistoryAuditTimestampColumn } from './components/columns';

import { formatHistoryAuditRelativeTime, formatHistoryAuditTimestamp } from './utils';

import { HISTORY_AUDIT_COLUMN_IDS } from './constants/historyAuditColumnIds';
import { HISTORY_AUDIT_EVENT_TYPES, HISTORY_AUDIT_LABELS } from './constants';
import type { HistoryAuditTrailTableRow, UseHistoryAuditTrailParams } from './types';

export const useHistoryAuditTrail = ({ events, onItemClick }: UseHistoryAuditTrailParams) => {
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

  const columnDefs = useMemo<ColDef<HistoryAuditTrailTableRow>[]>(
    () => [
      {
        colId: HISTORY_AUDIT_COLUMN_IDS.ACTIVITY,
        headerName: '',
        cellRenderer: HistoryAuditActivityColumns,
        flex: 1,
        minWidth: 400,
        sortable: false,
        resizable: false,
      },
      {
        colId: HISTORY_AUDIT_COLUMN_IDS.TIME,
        headerName: '',
        cellRenderer: HistoryAuditTimestampColumn,
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
    }),
    [rowData, defaultColDef, columnDefs, onRowClicked, getRowId, isInteractive],
  );
};
