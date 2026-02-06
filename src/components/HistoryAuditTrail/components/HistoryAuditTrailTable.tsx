import { useMemo } from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

import type { HistoryAuditTrailTableProps, HistoryAuditTrailTableRow } from '../types';

import { createHistoryAuditAgGridTheme } from '../utils';

ModuleRegistry.registerModules([AllCommunityModule]);

export const HistoryAuditTrailTable = ({
  rowData,
  columnDefs,
  defaultColDef,
  loading = false,
  onRowClicked,
  getRowId,
  height = 520,
  sx,
}: HistoryAuditTrailTableProps) => {
  const muiTheme = useTheme();
  const agGridTheme = useMemo(() => createHistoryAuditAgGridTheme(muiTheme), [muiTheme]);

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
        theme={agGridTheme}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        getRowId={getRowId}
        onRowClicked={onRowClicked}
        loading={loading}
        headerHeight={0}
        rowHeight={112}
        suppressCellFocus={true}
        suppressRowClickSelection={true}
        animateRows={true}
      />
    </Box>
  );
};
