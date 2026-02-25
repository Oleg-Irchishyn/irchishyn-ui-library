import { useCallback } from 'react';
import { MenuItem, Select } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';

import { HISTORY_AUDIT_LAYOUT } from '../constants';
import type { HistoryAudtitTrailModuleDropdownProps } from '../types';
import { HISTORY_AUDIT_ALL_MODULES_VALUE } from '../constants';

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

  return (
    <Select
      data-testid="history-audit-trail-module-dropdown"
      size="small"
      value={value}
      onChange={handleOnValueChange}
      displayEmpty
      sx={(theme) => ({
        minWidth: 160,
        maxWidth: 220,
        height: HISTORY_AUDIT_LAYOUT.TOOLBAR_INPUT_HEIGHT,
        borderRadius: HISTORY_AUDIT_LAYOUT.TOOLBAR_BORDER_RADIUS,
        backgroundColor: theme.palette.common.white,
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.divider,
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.divider,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.primary.main,
          borderWidth: 1,
        },
        '& .MuiSelect-select': {
          fontSize: 13,
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          py: 0.75,
        },
      })}
      inputProps={{ 'aria-label': 'Filter activity history by module' }}
    >
      <MenuItem value={HISTORY_AUDIT_ALL_MODULES_VALUE}>{allModulesLabel}</MenuItem>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.name}
        </MenuItem>
      ))}
    </Select>
  );
};
