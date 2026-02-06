import { Box, Typography } from '@mui/material';
import type { ICellRendererParams } from 'ag-grid-community';

import type { HistoryAuditTrailTableRow } from '../../types';

export const HistoryAuditTimestampColumn = ({
  data,
}: ICellRendererParams<HistoryAuditTrailTableRow>) => {
  if (!data) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', py: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Box sx={{ width: 6, height: 6, borderRadius: 999, bgcolor: 'text.disabled' }} />
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {data.timeAgo}
        </Typography>
      </Box>
      <Typography variant="caption" sx={{ color: 'text.disabled', mt: 0.25 }}>
        {data.timestamp}
      </Typography>
    </Box>
  );
};
