import { Box, CircularProgress, Typography } from '@mui/material';

import type { HistoryAuditTrailLoaderProps } from '../types';
import { historyAuditLoaderLabelStyles, historyAuditLoaderStyles } from './styles';

export const HistoryAuditTrailLoader = ({ label = 'Loading…' }: HistoryAuditTrailLoaderProps) => {
  return (
    <Box data-testid="history-audit-trail-loader" sx={historyAuditLoaderStyles}>
      <CircularProgress size={20} />
      <Typography variant="caption" color="text.secondary" sx={historyAuditLoaderLabelStyles}>
        {label}
      </Typography>
    </Box>
  );
};
