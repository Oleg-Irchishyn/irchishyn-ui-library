import { Box, Chip, IconButton, Typography } from '@mui/material';

import { CloseIcon, HistoryIcon } from './HistoryAuditTrailIcons';
import { HistoryAuditTrailSearch } from './HistoryAuditTrailSearch';
import { HistoryAuditExport } from './HistoryAuditExport';
import { HistoryAudtitTrailModuleDropdown } from './HistoryAudtitTrailModuleDropdown';

import type { HistoryAuditTrailHeaderProps } from '../types';
import { HISTORY_AUDIT_LAYOUT, HISTORY_AUDIT_RENDER_MODES } from '../constants';

export const HistoryAuditTrailHeader = ({
  renderMode = HISTORY_AUDIT_RENDER_MODES.PANEL,
  title,
  countLabel,
  onClear,
  moduleDropdown,
  search,
  export: exportProps,
}: HistoryAuditTrailHeaderProps) => {
  const isPanelMode = renderMode === HISTORY_AUDIT_RENDER_MODES.PANEL;

  return (
    <Box
      data-testid="history-audit-trail-header"
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}
    >
      {isPanelMode ? (
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
      ) : (
        <Box />
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        {moduleDropdown ? (
          <HistoryAudtitTrailModuleDropdown
            value={moduleDropdown.value}
            options={moduleDropdown.options}
            onValueChange={moduleDropdown.onValueChange}
            allModulesLabel={moduleDropdown.allModulesLabel}
          />
        ) : null}
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
        {isPanelMode && onClear ? (
          <IconButton size="small" onClick={onClear} aria-label="Close activity history">
            <CloseIcon />
          </IconButton>
        ) : null}
      </Box>
    </Box>
  );
};
