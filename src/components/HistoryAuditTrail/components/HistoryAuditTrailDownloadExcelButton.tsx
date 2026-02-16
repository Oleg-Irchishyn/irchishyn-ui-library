import { IconButton, Tooltip } from '@mui/material';

import { DownloadIcon } from './HistoryAuditTrailIcons';

export interface HistoryAuditTrailDownloadExcelButtonProps {
  onClick?: () => void;
}

export const HistoryAuditTrailDownloadExcelButton = ({
  onClick,
}: HistoryAuditTrailDownloadExcelButtonProps) => {
  return (
    <Tooltip title="Download Excel">
      <IconButton size="small" aria-label="Download history audit trail as Excel" onClick={onClick}>
        <DownloadIcon />
      </IconButton>
    </Tooltip>
  );
};
