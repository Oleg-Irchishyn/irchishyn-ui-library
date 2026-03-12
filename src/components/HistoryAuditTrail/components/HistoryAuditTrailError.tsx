import { Typography } from '@mui/material';

import type { HistoryAuditTrailErrorProps } from '../types';
import { historyAuditErrorMessageStyles } from './styles';

export const HistoryAuditTrailError = ({
  message = 'Error: Failed to load activity history.',
}: HistoryAuditTrailErrorProps) => {
  return (
    <Typography
      data-testid="history-audit-trail-error-message"
      variant="body2"
      sx={historyAuditErrorMessageStyles}
    >
      {message}
    </Typography>
  );
};
