import {
  Box,
  ButtonBase,
  Checkbox,
  IconButton,
  Popover,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  CheckCheck as CheckCheckIcon,
  ChevronsUpDown as ChevronsUpDownIcon,
  CircleX as CircleXIcon,
  Shuffle as ShuffleIcon,
} from 'lucide-react';

import { SearchTextBox } from '../SearchTextBox';
import { MULTI_SELECT_LABELS } from './constants';
import {
  getMultiSelectControlsRowStyles,
  getMultiSelectClearButtonStyles,
  getMultiSelectEmptyStateStyles,
  getMultiSelectHeaderStyles,
  getMultiSelectListStyles,
  getMultiSelectOptionStyles,
  getMultiSelectPopoverPaperStyles,
  getMultiSelectTriggerLabelStyles,
  getMultiSelectTriggerStyles,
} from './styles';
import type { MultiSelectDropdownProps } from './types';
import { useMultiSelectDropdown } from './useMultiSelectDropdown';

export const MultiSelectDropdown = ({
  options,
  selectedValues,
  onChange,
  placeholder = MULTI_SELECT_LABELS.DEFAULT_PLACEHOLDER,
  searchPlaceholder = MULTI_SELECT_LABELS.DEFAULT_SEARCH_PLACEHOLDER,
  showSelectAll = true,
  controlsLabel,
  maxDisplayNames,
  disabled = false,
  sx,
}: MultiSelectDropdownProps) => {
  const {
    anchorEl,
    isOpen,
    searchText,
    filteredOptions,
    isSelectAllAvailable,
    isDeselectAllAvailable,
    triggerLabel,
    handleOpen,
    handleClose,
    handleToggleOption,
    handleSelectAll,
    handleDeselectAll,
    handleInvertSelection,
    handleSearchChange,
  } = useMultiSelectDropdown({ options, selectedValues, onChange, placeholder, maxDisplayNames });

  const popoverId = isOpen ? 'multi-select-dropdown-popover' : undefined;

  return (
    <Box sx={sx} data-testid="multi-select-dropdown">
      {/* Trigger */}
      <ButtonBase
        data-testid="multi-select-dropdown-trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={popoverId}
        disabled={disabled}
        onClick={handleOpen}
        sx={getMultiSelectTriggerStyles(disabled)}
        disableRipple={false}
      >
        <Typography
          component="span"
          data-testid="multi-select-dropdown-label"
          sx={getMultiSelectTriggerLabelStyles()}
        >
          {triggerLabel}
        </Typography>
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
          paper: { sx: getMultiSelectPopoverPaperStyles() },
        }}
        disableAutoFocus
        disableEnforceFocus
      >
        <Box data-testid="multi-select-dropdown-popover">
        {/* Row 1: search input */}
        <Box sx={getMultiSelectHeaderStyles()}>
          <SearchTextBox
            value={searchText}
            onChange={handleSearchChange}
            placeholder={searchPlaceholder}
            debounceMs={0}
            data-testid="multi-select-dropdown-search"
          />
        </Box>

        {/* Row 2: controls (Select All / Deselect All / Invert) */}
        {showSelectAll && (
          <Box sx={getMultiSelectControlsRowStyles()}>
            {controlsLabel ? (
              <Typography variant="caption" color="text.secondary">
                {controlsLabel}
              </Typography>
            ) : (
              <Box />
            )}

            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title={MULTI_SELECT_LABELS.SELECT_ALL}>
                <span>
                  <IconButton
                    data-testid="multi-select-dropdown-select-all"
                    size="small"
                    disabled={!isSelectAllAvailable}
                    onClick={handleSelectAll}
                  >
                    <CheckCheckIcon size={16} />
                  </IconButton>
                </span>
              </Tooltip>

              <Tooltip title={MULTI_SELECT_LABELS.DESELECT_ALL}>
                <span>
                  <IconButton
                    data-testid="multi-select-dropdown-deselect-all"
                    size="small"
                    disabled={!isDeselectAllAvailable}
                    onClick={handleDeselectAll}
                  >
                    <CircleXIcon size={16} />
                  </IconButton>
                </span>
              </Tooltip>

              <Tooltip title={MULTI_SELECT_LABELS.INVERT_SELECTION}>
                <IconButton
                  data-testid="multi-select-dropdown-invert"
                  size="small"
                  onClick={handleInvertSelection}
                >
                  <ShuffleIcon size={16} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        )}

        {/* Options list */}
        <Box
          component="ul"
          role="listbox"
          aria-multiselectable="true"
          aria-label="Options"
          sx={getMultiSelectListStyles()}
        >
          {filteredOptions.length === 0 ? (
            <Box sx={getMultiSelectEmptyStateStyles()}>
              <Typography variant="body2">{MULTI_SELECT_LABELS.NO_OPTIONS}</Typography>
            </Box>
          ) : (
            filteredOptions.map((option) => {
              const isChecked = selectedValues.includes(option.value);
              return (
                <Box
                  key={option.value}
                  component="li"
                  role="option"
                  aria-selected={isChecked}
                  data-testid={`multi-select-option-${option.value}`}
                  onClick={() => handleToggleOption(option.value)}
                  sx={getMultiSelectOptionStyles(isChecked)}
                >
                  <Checkbox
                    size="small"
                    checked={isChecked}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-hidden': true }}
                  />
                  <Typography variant="body2">{option.label}</Typography>
                </Box>
              );
            })
          )}
        </Box>

        {/* Clear selection — only when showSelectAll=false */}
        {!showSelectAll && isDeselectAllAvailable && (
          <Box
            data-testid="multi-select-dropdown-clear-bottom"
            onClick={handleDeselectAll}
            sx={getMultiSelectClearButtonStyles()}
          >
            {MULTI_SELECT_LABELS.CLEAR_SELECTION}
          </Box>
        )}
        </Box>
      </Popover>
    </Box>
  );
};
