import { CalendarDays } from 'lucide-react';
import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  IconButton,
  Popover,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';

import { DATE_PICKER_RANGE_INPUT_PLACEHOLDER, DATE_PICKER_VALUE_FORMAT } from '../constants';
import {
  getDatePickerTextFieldStyles,
  quickSelectCustomRangeStyles,
  quickSelectFooterStyles,
  quickSelectOptionGroupStyles,
  quickSelectPopoverContentStyles,
} from '../styles';
import type { DatePickerQuickSelectPanelProps } from '../types';
import { getDatePickerValidationMessage } from '../utils';

export const DatePickerQuickSelectPanel = ({
  label,
  disabled,
  required,
  error,
  helperText,
  clearLabel,
  dateFormat = DATE_PICKER_VALUE_FORMAT,
  minDate,
  maxDate,
  shouldDisableDate,
  quickSelectPlaceholder,
  triggerLabel,
  isOpen,
  anchorEl,
  selectedQuickOptionValue,
  customRange,
  quickSelectOptions,
  allowCustomRange,
  customFromError,
  customToError,
  onOpen,
  onClose,
  onQuickOptionChange,
  onCustomFromChange,
  onCustomToChange,
  onCustomFromError,
  onCustomToError,
  onClearSelection,
}: DatePickerQuickSelectPanelProps) => {
  return (
    <Box>
      <TextField
        data-testid="quick-select-date-picker-trigger"
        label={label}
        value={triggerLabel === quickSelectPlaceholder ? '' : triggerLabel}
        placeholder={quickSelectPlaceholder}
        onClick={onOpen}
        fullWidth
        size="small"
        disabled={disabled}
        required={required}
        error={error}
        helperText={helperText}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <IconButton
              size="small"
              edge="end"
              disabled={disabled}
              aria-label="Open date range menu"
            >
              <CalendarDays size={16} />
            </IconButton>
          ),
        }}
        sx={getDatePickerTextFieldStyles()}
      />

      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Box sx={quickSelectPopoverContentStyles}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Quick Select
          </Typography>
          <RadioGroup
            value={selectedQuickOptionValue}
            onChange={onQuickOptionChange}
            sx={quickSelectOptionGroupStyles}
          >
            {quickSelectOptions.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio size="small" />}
                label={option.label}
              />
            ))}
          </RadioGroup>

          {allowCustomRange ? (
            <>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="subtitle2">Custom Range</Typography>
              <Box sx={quickSelectCustomRangeStyles}>
                <MuiDatePicker
                  label="From"
                  value={customRange.from}
                  onChange={onCustomFromChange}
                  onError={onCustomFromError}
                  minDate={minDate}
                  maxDate={maxDate}
                  shouldDisableDate={shouldDisableDate}
                  format={dateFormat}
                  slotProps={{
                    textField: {
                      size: 'small',
                      placeholder:
                        dateFormat === DATE_PICKER_VALUE_FORMAT
                          ? DATE_PICKER_RANGE_INPUT_PLACEHOLDER
                          : dateFormat,
                      error:
                        customFromError === 'invalidDate' ||
                        customFromError === 'minDate' ||
                        customFromError === 'maxDate',
                      helperText: getDatePickerValidationMessage(
                        customFromError,
                        minDate,
                        maxDate,
                        dateFormat,
                      ),
                    },
                  }}
                />
                <MuiDatePicker
                  label="To"
                  value={customRange.to}
                  onChange={onCustomToChange}
                  onError={onCustomToError}
                  minDate={minDate}
                  maxDate={maxDate}
                  shouldDisableDate={shouldDisableDate}
                  format={dateFormat}
                  slotProps={{
                    textField: {
                      size: 'small',
                      placeholder:
                        dateFormat === DATE_PICKER_VALUE_FORMAT
                          ? DATE_PICKER_RANGE_INPUT_PLACEHOLDER
                          : dateFormat,
                      error:
                        customToError === 'invalidDate' ||
                        customToError === 'minDate' ||
                        customToError === 'maxDate',
                      helperText: getDatePickerValidationMessage(
                        customToError,
                        minDate,
                        maxDate,
                        dateFormat,
                      ),
                    },
                  }}
                />
              </Box>
            </>
          ) : null}

          <Box sx={quickSelectFooterStyles}>
            <Button size="small" variant="text" onClick={onClearSelection}>
              {clearLabel}
            </Button>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};
