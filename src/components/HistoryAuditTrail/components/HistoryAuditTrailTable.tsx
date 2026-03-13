import { useMemo } from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AllEnterpriseModule } from 'ag-grid-enterprise';

import type { HistoryAuditTrailTableProps, HistoryAuditTrailTableRow } from '../types';

import { createHistoryAuditAgGridTheme } from '../utils';
import { getHistoryAuditTableStyles } from './styles';

ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule]);

export const HistoryAuditTrailTable = ({
  rowData,
  columnDefs,
  defaultColDef,
  quickFilterText,
  quickFilterParser,
  getContextMenuItems,
  onGridReady,
  loading = false,
  onRowClicked,
  getRowId,
  height = 520,
  sx,
}: HistoryAuditTrailTableProps) => {
  const muiTheme = useTheme();
  const agGridTheme = useMemo(() => createHistoryAuditAgGridTheme(muiTheme), [muiTheme]);

  return (
    <Box sx={getHistoryAuditTableStyles(height, sx)}>
      <AgGridReact<HistoryAuditTrailTableRow>
        data-testid="history-audit-trail-table"
        theme={agGridTheme}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        popupParent={typeof document !== 'undefined' ? document.body : undefined}
        quickFilterText={quickFilterText}
        quickFilterParser={quickFilterParser}
        getContextMenuItems={getContextMenuItems}
        onGridReady={onGridReady}
        getRowId={getRowId}
        onRowClicked={onRowClicked}
        loading={loading}
        headerHeight={0}
        suppressContextMenu={false}
        preventDefaultOnContextMenu={true}
        suppressCellFocus={true}
        suppressRowClickSelection={true}
        animateRows={true}
      />
    </Box>
  );
};
