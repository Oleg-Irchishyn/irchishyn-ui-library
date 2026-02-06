import type { SxProps, Theme } from '@mui/material/styles';
import type { ColDef, GetRowIdParams, RowClickedEvent } from 'ag-grid-community';

import type { HISTORY_AUDIT_EVENT_TYPES } from './constants';

export type HistoryAuditEventType =
  | (typeof HISTORY_AUDIT_EVENT_TYPES)[keyof typeof HISTORY_AUDIT_EVENT_TYPES]
  | (string & {});

export interface HistoryAuditTrailEvent {
  id: string;
  source?: string | null;
  username: string;
  auditEventType: HistoryAuditEventType;
  subject?: string | null;
  oldValue?: string | null;
  newValue?: string | null;
  details?: string | null;
  timestamp: string;
}

export interface HistoryAuditTrailTableRow {
  id: string;
  event: HistoryAuditTrailEvent;
  actor: string;
  badge?: string | null;
  action: string;
  details?: string | null;
  changeFrom?: string | null;
  changeTo?: string | null;
  timeAgo: string;
  timestamp: string;
}

export interface HistoryAuditTrailLoaderProps {
  label?: string;
}

export interface HistoryAuditTrailEmptyProps {
  message?: string;
}

export interface HistoryAuditTrailHeaderProps {
  title: string;
  countLabel?: string;
  onClear?: () => void;
}

export interface HistoryAuditTrailTableProps {
  rowData: HistoryAuditTrailTableRow[];
  columnDefs: ColDef<HistoryAuditTrailTableRow>[];
  defaultColDef: ColDef<HistoryAuditTrailTableRow>;
  loading?: boolean;
  onRowClicked?: (event: RowClickedEvent<HistoryAuditTrailTableRow>) => void;
  getRowId: (params: GetRowIdParams<HistoryAuditTrailTableRow>) => string;
  height?: number | string;
  sx?: SxProps<Theme>;
}

export interface HistoryAuditTrailProps {
  events: HistoryAuditTrailEvent[];
  title?: string;
  countLabel?: string;
  loading?: boolean;
  onItemClick?: (event: HistoryAuditTrailEvent) => void;
  onClear?: () => void;
  height?: number | string;
  sx?: SxProps<Theme>;
}

export interface UseHistoryAuditTrailParams {
  events: HistoryAuditTrailEvent[];
  onItemClick?: (event: HistoryAuditTrailEvent) => void;
}
