import { Typography } from '@mui/material';

import type { HistoryAuditTrailEmptyProps } from '../types';

export const HistoryAuditTrailEmpty = ({
  message = 'No activity yet.',
}: HistoryAuditTrailEmptyProps) => {
  return (
    <Typography variant="body2" color="text.secondary">
      {message}
    </Typography>
  );
};
