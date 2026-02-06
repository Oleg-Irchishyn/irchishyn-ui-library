import { Box, Chip, IconButton, Typography } from '@mui/material';

import { CloseIcon, HistoryIcon } from './HistoryAuditTrailIcons';

import type { HistoryAuditTrailHeaderProps } from '../types';

export const HistoryAuditTrailHeader = ({
  title,
  countLabel,
  onClear,
}: HistoryAuditTrailHeaderProps) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
        <Box sx={(theme) => ({ color: theme.palette.info.main, display: 'flex' })}>
          <HistoryIcon />
        </Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }} noWrap>
          {title}
        </Typography>
        {countLabel ? <Chip size="small" label={countLabel} variant="outlined" /> : null}
      </Box>

      {onClear ? (
        <IconButton size="small" onClick={onClear} aria-label="Clear activity history">
          <CloseIcon />
        </IconButton>
      ) : null}
    </Box>
  );
};
