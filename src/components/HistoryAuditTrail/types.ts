import type { SxProps, Theme } from '@mui/material/styles';
import type {
  ColDef,
  GetContextMenuItems,
  GetRowIdParams,
  GridReadyEvent,
  RowClickedEvent,
} from 'ag-grid-community';

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
  search?: HistoryAuditTrailSearchProps;
}

export interface HistoryAuditTrailSearchProps {
  searchValue?: string;
  onSearchValueChange?: (value: string) => void;
  onDownloadExcel?: () => void;
  enableExport?: boolean;
}

export interface HistoryAuditTrailTableProps {
  rowData: HistoryAuditTrailTableRow[];
  columnDefs: ColDef<HistoryAuditTrailTableRow>[];
  defaultColDef: ColDef<HistoryAuditTrailTableRow>;
  quickFilterText?: string;
  getContextMenuItems?: GetContextMenuItems<HistoryAuditTrailTableRow>;
  onGridReady?: (event: GridReadyEvent<HistoryAuditTrailTableRow>) => void;
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
  enableExport?: boolean;
  exportFileName?: string;
  loading?: boolean;
  onItemClick?: (event: HistoryAuditTrailEvent) => void;
  onClear?: () => void;
  height?: number | string;
  sx?: SxProps<Theme>;
}

export interface UseHistoryAuditTrailParams {
  events: HistoryAuditTrailEvent[];
  onItemClick?: (event: HistoryAuditTrailEvent) => void;
  countLabel?: string;
  onClear?: () => void;
  enableExport?: boolean;
  exportFileName?: string;
}
