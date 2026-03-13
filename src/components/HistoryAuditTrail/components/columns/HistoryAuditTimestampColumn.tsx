import { Box, Typography } from '@mui/material';
import type { ICellRendererParams } from 'ag-grid-community';

import type { HistoryAuditTrailTableRow } from '../../types';
import { ClockIcon } from '../HistoryAuditTrailIcons';
import {
  historyAuditTimestampAgoStyles,
  historyAuditTimestampClockStyles,
  historyAuditTimestampRootStyles,
  historyAuditTimestampTopRowStyles,
  historyAuditTimestampValueStyles,
} from './styles';

export const HistoryAuditTimestampColumn = ({
  data,
}: ICellRendererParams<HistoryAuditTrailTableRow>) => {
  if (!data) return null;

  return (
    <Box sx={historyAuditTimestampRootStyles}>
      <Box sx={historyAuditTimestampTopRowStyles}>
        <Box sx={historyAuditTimestampClockStyles}>
          <ClockIcon />
        </Box>
        <Typography variant="caption" sx={historyAuditTimestampAgoStyles}>
          {data.timeAgo}
        </Typography>
      </Box>
      <Typography variant="caption" sx={historyAuditTimestampValueStyles}>
        {data.timestamp}
      </Typography>
    </Box>
  );
};
