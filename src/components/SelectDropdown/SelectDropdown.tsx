import { Box, ButtonBase, CircularProgress, Popover, Typography } from '@mui/material';
import { ChevronsUpDown as ChevronsUpDownIcon } from 'lucide-react';

import { Badge } from '../Badge';
import { SearchTextBox } from '../SearchTextBox';
import { SELECT_DROPDOWN_LABELS } from './constants';
import {
  getSelectDropdownActionButtonStyles,
  getSelectDropdownActionsDividerStyles,
  getSelectDropdownEmptyStateStyles,
  getSelectDropdownHeaderStyles,
  getSelectDropdownLoadingStateStyles,
  getSelectDropdownListStyles,
  getSelectDropdownOptionStyles,
  getSelectDropdownPopoverPaperStyles,
  getSelectDropdownTriggerContentStyles,
  getSelectDropdownTriggerLabelStyles,
  getSelectDropdownTriggerStyles,
} from './styles';
import type { SelectDropdownProps } from './types';
import { useSelectDropdown } from './useSelectDropdown';

export const SelectDropdown = ({
  options,
  value,
  onChange,
  searchPlaceholder = SELECT_DROPDOWN_LABELS.DEFAULT_SEARCH_PLACEHOLDER,
  actionButtons = [],
  placeholder = SELECT_DROPDOWN_LABELS.DEFAULT_PLACEHOLDER,
  disabled = false,
  loading = false,
  sx,
}: SelectDropdownProps) => {
  const {
    anchorEl,
    isOpen,
    searchText,
    filteredOptions,
    triggerLabel,
    triggerOption,
    handleOpen,
    handleClose,
    handleSelectOption,
    handleSearchChange,
  } = useSelectDropdown({ options, value, onChange, placeholder });

  const popoverId = isOpen ? 'select-dropdown-popover' : undefined;

  return (
    <Box sx={sx} data-testid="select-dropdown">
      {/* Trigger */}
      <ButtonBase
        data-testid="select-dropdown-trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={popoverId}
        disabled={disabled}
        onClick={handleOpen}
        sx={getSelectDropdownTriggerStyles(disabled)}
        disableRipple={false}
      >
        <Box sx={getSelectDropdownTriggerContentStyles()}>
          {triggerOption?.badgeLabel && (
            <Badge
              data-testid="select-dropdown-trigger-badge"
              label={triggerOption.badgeLabel}
              color={triggerOption.badgeColor}
              size="small"
            />
          )}
          <Typography
            component="span"
            data-testid="select-dropdown-label"
            sx={getSelectDropdownTriggerLabelStyles()}
          >
            {triggerLabel}
          </Typography>
        </Box>
        <ChevronsUpDownIcon size={16} />
      </ButtonBase>

      {/* Popover */}
      <Popover
        id={popoverId}
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: { sx: getSelectDropdownPopoverPaperStyles() },
        }}
        disableAutoFocus
        disableEnforceFocus
      >
        <Box data-testid="select-dropdown-popover">
          {/* Row 1: Search input */}
          <Box sx={getSelectDropdownHeaderStyles()}>
            <SearchTextBox
              value={searchText}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
              debounceMs={0}
              data-testid="select-dropdown-search"
            />
          </Box>

          {/* Row 2: Action buttons */}
          {actionButtons.length > 0 && (
            <Box sx={getSelectDropdownActionsDividerStyles()}>
              {actionButtons.map((btn, index) => (
                <Box
                  key={index}
                  data-testid={`select-dropdown-action-${index}`}
                  onClick={() => {
                    btn.onClick();
                    if (btn.closeOnClick) handleClose();
                  }}
                  sx={getSelectDropdownActionButtonStyles()}
                >
                  {btn.icon}
                  {btn.label}
                </Box>
              ))}
            </Box>
          )}

          {/* Options list */}
          <Box
            component="ul"
            role="listbox"
            aria-label="Options"
            sx={getSelectDropdownListStyles()}
          >
            {loading ? (
              <Box data-testid="select-dropdown-loading" sx={getSelectDropdownLoadingStateStyles()}>
                <CircularProgress size={20} aria-label={SELECT_DROPDOWN_LABELS.LOADING} />
              </Box>
            ) : filteredOptions.length === 0 ? (
              <Box sx={getSelectDropdownEmptyStateStyles()}>
                <Typography variant="body2">{SELECT_DROPDOWN_LABELS.NO_OPTIONS}</Typography>
              </Box>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = option.value === value;
                return (
                  <Box
                    key={option.value}
                    component="li"
                    role="option"
                    aria-selected={isSelected}
                    data-testid={`select-dropdown-option-${option.value}`}
                    onClick={() => handleSelectOption(option)}
                    sx={getSelectDropdownOptionStyles(isSelected)}
                  >
                    {option.badgeLabel && (
                      <Badge label={option.badgeLabel} color={option.badgeColor} size="small" />
                    )}
                    <Typography variant="body2">{option.label}</Typography>
                  </Box>
                );
              })
            )}
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};
