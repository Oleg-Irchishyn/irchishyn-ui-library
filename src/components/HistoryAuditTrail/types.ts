import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import type {
  ColDef,
  GetContextMenuItems,
  ICellRendererParams,
  GetRowIdParams,
  GridReadyEvent,
  RowClickedEvent,
} from 'ag-grid-community';

import type { HISTORY_AUDIT_EVENT_TYPES, HISTORY_AUDIT_RENDER_MODES } from './constants';

export type HistoryAuditEventType =
  | (typeof HISTORY_AUDIT_EVENT_TYPES)[keyof typeof HISTORY_AUDIT_EVENT_TYPES]
  | (string & {});

export interface HistoryAuditFieldChange {
  fieldName?: string | null;
  oldValue?: string | null;
  newValue?: string | null;
}

export interface HistoryAuditAdditionalDetail {
  key: string;
  value: string;
}

export interface HistoryAuditTrailEvent {
  id: string;
  source?: string | null;
  username: string;
  auditEventType: HistoryAuditEventType;
  subject?: string | null;
  oldValue?: string | null;
  newValue?: string | null;
  fieldChanges?: HistoryAuditFieldChange[] | null;
  details?: string | null;
  additionalDetails?: HistoryAuditAdditionalDetail[] | null;
  timestamp: string;
}

export interface HistoryAuditTrailTableRow {
  id: string;
  event: HistoryAuditTrailEvent;
  actor: string;
  badge?: string | null;
  moduleBadge?: string | null;
  moduleBadgeColor?: string | null;
  action: string;
  details?: string | null;
  changeFrom?: string | null;
  changeTo?: string | null;
  timeAgo: string;
  timestamp: string;
}

export interface HistoryAuditActionStyle {
  icon?: ReactNode;
  backgroundColor?: string;
  iconColor?: string;
  borderColor?: string;
}

export type HistoryAuditActionStyleMap = Record<string, HistoryAuditActionStyle>;

export interface HistoryAuditActivityRendererParams extends ICellRendererParams<HistoryAuditTrailTableRow> {
  actionStyles?: HistoryAuditActionStyleMap;
  defaultActionStyle?: HistoryAuditActionStyle;
}

export interface HistoryAuditTrailLoaderProps {
  label?: string;
}

export interface HistoryAuditTrailEmptyProps {
  message?: string;
}

export interface HistoryAuditTrailExportProps {
  onExportExcel?: () => void;
  onExportCsv?: () => void;
  enableExport?: boolean;
}

export interface HistoryAuditTrailHeaderProps {
  renderMode?: HistoryAuditTrailRenderMode;
  title: string;
  countLabel?: string;
  onClear?: () => void;
  moduleDropdown?: HistoryAudtitTrailModuleDropdownProps;
  search?: HistoryAuditTrailSearchProps;
  export?: HistoryAuditTrailExportProps;
}

export type HistoryAuditTrailRenderMode =
  (typeof HISTORY_AUDIT_RENDER_MODES)[keyof typeof HISTORY_AUDIT_RENDER_MODES];

export interface HistoryAuditTrailSearchProps {
  searchValue?: string;
  onSearchValueChange?: (value: string) => void;
}

export interface HistoryAuditTrailModuleOption {
  name: string;
  value: string;
}

export interface HistoryAudtitTrailModuleDropdownProps {
  value: string;
  options: HistoryAuditTrailModuleOption[];
  onValueChange: (value: string) => void;
  allModulesLabel?: string;
}

export interface HistoryAuditTrailTableProps {
  rowData: HistoryAuditTrailTableRow[];
  columnDefs: ColDef<HistoryAuditTrailTableRow>[];
  defaultColDef: ColDef<HistoryAuditTrailTableRow>;
  quickFilterText?: string;
  quickFilterParser?: (quickFilter: string) => string[];
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
  actionStyles?: HistoryAuditActionStyleMap;
  defaultActionStyle?: HistoryAuditActionStyle;
  renderMode?: HistoryAuditTrailRenderMode;
  title?: string;
  countLabel?: string;
  enableExport?: boolean;
  exportFileName?: string;
  moduleSources?: string[];
  primaryModuleSource?: string;
  moduleFilterCallback?: (event: HistoryAuditTrailEvent, selectedSource: string) => boolean;
  onModuleSourceChange?: (selectedSource: string) => void;
  allModulesLabel?: string;
  loading?: boolean;
  onItemClick?: (event: HistoryAuditTrailEvent) => void;
  onClear?: () => void;
  height?: number | string;
  sx?: SxProps<Theme>;
}

export interface UseHistoryAuditTrailParams {
  events: HistoryAuditTrailEvent[];
  actionStyles?: HistoryAuditActionStyleMap;
  defaultActionStyle?: HistoryAuditActionStyle;
  onItemClick?: (event: HistoryAuditTrailEvent) => void;
  countLabel?: string;
  onClear?: () => void;
  enableExport?: boolean;
  exportFileName?: string;
  moduleSources?: string[];
  primaryModuleSource?: string;
  moduleFilterCallback?: (event: HistoryAuditTrailEvent, selectedSource: string) => boolean;
  onModuleSourceChange?: (selectedSource: string) => void;
  allModulesLabel?: string;
}
