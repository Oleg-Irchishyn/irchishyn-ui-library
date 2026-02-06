import { Box, CircularProgress, Typography } from '@mui/material';

import type { HistoryAuditTrailLoaderProps } from '../types';

export const HistoryAuditTrailLoader = ({ label = 'Loading…' }: HistoryAuditTrailLoaderProps) => {
  return (
    <Box sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <CircularProgress size={20} />
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
        {label}
      </Typography>
    </Box>
  );
};
