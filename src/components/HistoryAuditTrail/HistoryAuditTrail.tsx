import { Box } from '@mui/material';

import { HistoryAuditTrailLoader } from './components/HistoryAuditTrailLoader';
import { HistoryAuditTrailEmpty } from './components/HistoryAuditTrailEmpty';
import { HistoryAuditTrailHeader } from './components/HistoryAuditTrailHeader';
import { HistoryAuditTrailTable } from './components/HistoryAuditTrailTable';
import { useHistoryAuditTrail } from './useHistoryAuditTrail';

import type { HistoryAuditTrailProps } from './types';

export const HistoryAuditTrail = ({
  events,
  title = 'Activity History',
  countLabel,
  loading = false,
  onItemClick,
  onClear,
  height,
  sx,
}: HistoryAuditTrailProps) => {
  const { rowData, columnDefs, defaultColDef, onRowClicked, getRowId } = useHistoryAuditTrail({
    events,
    onItemClick,
  });

  return (
    <Box sx={{ width: '100%', ...((sx as object) ?? {}) }}>
      <HistoryAuditTrailHeader title={title} countLabel={countLabel} onClear={onClear} />

      <Box sx={{ position: 'relative' }}>
        {loading && events.length === 0 ? (
          <HistoryAuditTrailLoader />
        ) : events.length === 0 ? (
          <HistoryAuditTrailEmpty />
        ) : (
          <HistoryAuditTrailTable
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onRowClicked={onRowClicked}
            getRowId={getRowId}
            height={height}
            loading={loading}
          />
        )}
      </Box>
    </Box>
  );
};
