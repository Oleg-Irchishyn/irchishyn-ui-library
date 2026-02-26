import { useCallback, useMemo } from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, type RowHeightParams } from 'ag-grid-community';
import { AllEnterpriseModule } from 'ag-grid-enterprise';

import type { HistoryAuditTrailTableProps, HistoryAuditTrailTableRow } from '../types';

import { createHistoryAuditAgGridTheme, getHistoryAuditRowHeight } from '../utils';

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

  const getRowHeight = useCallback((params: RowHeightParams<HistoryAuditTrailTableRow>) => {
    return getHistoryAuditRowHeight(params.data?.event);
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        height,
        '& .ag-header': { borderBottom: 'none !important' },
        '& .ag-header-cell': { paddingLeft: '0 !important', paddingRight: '0 !important' },
        '& .ag-cell': {
          paddingLeft: '16px !important',
          paddingRight: '16px !important',
          border: 'none !important',
        },
        '& .ag-row': { borderBottom: 'none !important' },
        '& .ag-row-hover': { backgroundColor: 'transparent !important' },
        '& .ag-row-hover .ag-cell': { backgroundColor: 'transparent !important' },
        '& .ag-row-hover::before': { backgroundColor: 'transparent !important' },
        '& .ag-root-wrapper': { border: 'none !important' },
        ...(sx as object),
      }}
    >
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
        getRowHeight={getRowHeight}
        suppressContextMenu={false}
        preventDefaultOnContextMenu={true}
        suppressCellFocus={true}
        suppressRowClickSelection={true}
        animateRows={true}
      />
    </Box>
  );
};
