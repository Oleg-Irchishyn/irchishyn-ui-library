import { Box, Chip, IconButton, Typography } from '@mui/material';

import { CloseIcon, HistoryIcon } from './HistoryAuditTrailIcons';
import { HistoryAuditTrailSearch } from './HistoryAuditTrailSearch';
import { HistoryAuditExport } from './HistoryAuditExport';

import type { HistoryAuditTrailHeaderProps } from '../types';
import { HISTORY_AUDIT_LAYOUT } from '../constants';

export const HistoryAuditTrailHeader = ({
  title,
  countLabel,
  onClear,
  search,
  export: exportProps,
}: HistoryAuditTrailHeaderProps) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
        <Box sx={(theme) => ({ color: theme.palette.info.main, display: 'flex' })}>
          <HistoryIcon />
        </Box>
        <Typography
          variant="subtitle2"
          sx={(theme) => ({ fontWeight: 600, color: theme.palette.text.primary })}
          noWrap
        >
          {title}
        </Typography>
        {countLabel ? (
          <Chip
            size="small"
            label={countLabel}
            variant="outlined"
            sx={(theme) => ({
              borderRadius: HISTORY_AUDIT_LAYOUT.TOOLBAR_BORDER_RADIUS,
              borderColor: theme.palette.divider,
            })}
          />
        ) : null}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <HistoryAuditTrailSearch
          searchValue={search?.searchValue}
          onSearchValueChange={search?.onSearchValueChange}
        />
        {exportProps?.enableExport ? (
          <HistoryAuditExport
            onExportExcel={exportProps.onExportExcel}
            onExportCsv={exportProps.onExportCsv}
          />
        ) : null}
        {onClear ? (
          <IconButton size="small" onClick={onClear} aria-label="Clear activity history">
            <CloseIcon />
          </IconButton>
        ) : null}
      </Box>
    </Box>
  );
};
