import { useCallback } from 'react';
import { Box, MenuItem, Select } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { primary } from '@gen2fund/platform.style';

import { HISTORY_AUDIT_LAYOUT } from '../constants';
import type { HistoryAudtitTrailModuleDropdownProps } from '../types';
import { HISTORY_AUDIT_ALL_MODULES_VALUE } from '../constants';
import { CheckIcon } from './HistoryAuditTrailIcons';

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
      sx={(theme) => ({
        minWidth: 160,
        width: 176,
        height: HISTORY_AUDIT_LAYOUT.TOOLBAR_INPUT_HEIGHT,
        borderRadius: HISTORY_AUDIT_LAYOUT.TOOLBAR_BORDER_RADIUS,
        backgroundColor:
          theme.palette.mode === 'dark'
            ? theme.palette.background.paper
            : theme.palette.common.white,
        color: theme.palette.text.primary,
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
          fontSize: 12,
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          py: 0.75,
        },
        '& .MuiSelect-icon': {
          color: theme.palette.text.secondary,
        },
      })}
      MenuProps={{
        PaperProps: {
          sx: (theme) => ({
            mt: 0.5,
            borderRadius: 1,
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor:
              theme.palette.mode === 'dark'
                ? theme.palette.background.paper
                : theme.palette.common.white,
            color: theme.palette.text.primary,
            boxShadow: theme.shadows[2],
            '& .MuiMenuItem-root': {
              py: 0.75,
              pl: 1,
              pr: 3.5,
              fontSize: 13,
              minHeight: 30,
              borderRadius: 0.5,
            },
            '& .MuiMenuItem-root.Mui-focusVisible': {
              backgroundColor: theme.palette.action.hover,
            },
            '& .MuiMenuItem-root.Mui-selected': {
              backgroundColor: `${primary.main}14`,
              color: primary.main,
            },
            '& .MuiMenuItem-root.Mui-selected:hover': {
              backgroundColor: theme.palette.action.hover,
              color: theme.palette.text.primary,
            },
          }),
        },
      }}
      inputProps={{ 'aria-label': 'Filter activity history by module' }}
    >
      <MenuItem value={HISTORY_AUDIT_ALL_MODULES_VALUE}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', minWidth: 0 }}>
          <Box
            component="span"
            sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {allModulesLabel}
          </Box>
          {value === HISTORY_AUDIT_ALL_MODULES_VALUE ? <CheckIcon /> : null}
        </Box>
      </MenuItem>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', minWidth: 0 }}>
            <Box
              component="span"
              sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {option.name}
            </Box>
            {value === option.value ? <CheckIcon /> : null}
          </Box>
        </MenuItem>
      ))}
    </Select>
  );
};
