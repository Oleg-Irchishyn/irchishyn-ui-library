import { useCallback } from 'react';
import { Box, MenuItem, Select } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';

import type { HistoryAudtitTrailModuleDropdownProps } from '../types';
import { HISTORY_AUDIT_ALL_MODULES_VALUE } from '../constants';
import { CheckIcon } from './HistoryAuditTrailIcons';
import {
  historyAuditModuleDropdownMenuItemRowStyles,
  historyAuditModuleDropdownMenuItemTextStyles,
  historyAuditModuleDropdownPaperStyles,
  historyAuditModuleDropdownStyles,
} from './styles';

export const HistoryAudtitTrailModuleDropdown = ({
  value,
  options,
  onValueChange,
  allModulesLabel = 'All Modules',
}: HistoryAudtitTrailModuleDropdownProps) => {
  const handleOnValueChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      onValueChange(String(event.target.value));
    },
    [onValueChange],
  );
  const selectedLabel =
    value === HISTORY_AUDIT_ALL_MODULES_VALUE
      ? allModulesLabel
      : (options.find((option) => option.value === value)?.name ?? allModulesLabel);
  const renderSelectedValue = useCallback(() => selectedLabel, [selectedLabel]);

  return (
    <Select
      data-testid="history-audit-trail-module-dropdown"
      size="small"
      value={value}
      onChange={handleOnValueChange}
      displayEmpty
      renderValue={renderSelectedValue}
      sx={historyAuditModuleDropdownStyles}
      MenuProps={{
        PaperProps: {
          sx: historyAuditModuleDropdownPaperStyles,
        },
      }}
      inputProps={{ 'aria-label': 'Filter activity history by module' }}
    >
      <MenuItem value={HISTORY_AUDIT_ALL_MODULES_VALUE}>
        <Box sx={historyAuditModuleDropdownMenuItemRowStyles}>
          <Box component="span" sx={historyAuditModuleDropdownMenuItemTextStyles}>
            {allModulesLabel}
          </Box>
          {value === HISTORY_AUDIT_ALL_MODULES_VALUE ? <CheckIcon /> : null}
        </Box>
      </MenuItem>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          <Box sx={historyAuditModuleDropdownMenuItemRowStyles}>
            <Box component="span" sx={historyAuditModuleDropdownMenuItemTextStyles}>
              {option.name}
            </Box>
            {value === option.value ? <CheckIcon /> : null}
          </Box>
        </MenuItem>
      ))}
    </Select>
  );
};
