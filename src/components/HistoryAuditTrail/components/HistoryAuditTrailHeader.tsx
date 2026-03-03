import { Box, Chip, IconButton, Typography } from '@mui/material';

import { CloseIcon, HistoryIcon } from './HistoryAuditTrailIcons';
import { HistoryAuditTrailSearch } from './HistoryAuditTrailSearch';
import { HistoryAuditExport } from './HistoryAuditExport';
import { HistoryAudtitTrailModuleDropdown } from './HistoryAudtitTrailModuleDropdown';
import {
  historyAuditHeaderCountChipStyles,
  historyAuditHeaderIconStyles,
  historyAuditHeaderLeftStyles,
  historyAuditHeaderRightStyles,
  historyAuditHeaderStyles,
  historyAuditHeaderTitleStyles,
} from './styles';

import type { HistoryAuditTrailHeaderProps } from '../types';
import { HISTORY_AUDIT_RENDER_MODES } from '../constants';

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
    <Box data-testid="history-audit-trail-header" sx={historyAuditHeaderStyles}>
      {isPanelMode ? (
        <Box sx={historyAuditHeaderLeftStyles}>
          <Box sx={historyAuditHeaderIconStyles}>
            <HistoryIcon />
          </Box>
          <Typography variant="subtitle2" sx={historyAuditHeaderTitleStyles} noWrap>
            {title}
          </Typography>
          {countLabel ? (
            <Chip
              size="small"
              label={countLabel}
              variant="outlined"
              sx={historyAuditHeaderCountChipStyles}
            />
          ) : null}
        </Box>
      ) : (
        <Box />
      )}

      <Box sx={historyAuditHeaderRightStyles}>
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
