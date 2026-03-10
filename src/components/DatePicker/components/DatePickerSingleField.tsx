import { Box } from '@mui/material';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';

import { DATE_PICKER_DEFAULT_PLACEHOLDER, DATE_PICKER_VALUE_FORMAT } from '../constants';
import { getDatePickerTextFieldStyles } from '../styles';
import type { DatePickerSingleFieldProps } from '../types';

export const DatePickerSingleField = ({
  value,
  onChange,
  onError,
  label,
  disabled,
  required,
  error,
  helperText,
  dateFormat = DATE_PICKER_VALUE_FORMAT,
  minDate,
  maxDate,
  shouldDisableDate,
  placeholder = DATE_PICKER_DEFAULT_PLACEHOLDER,
  sx,
}: DatePickerSingleFieldProps) => {
  return (
    <Box sx={sx}>
      <MuiDatePicker
        value={value}
        onChange={onChange}
        onError={onError}
        disabled={disabled}
        minDate={minDate}
        maxDate={maxDate}
        shouldDisableDate={shouldDisableDate}
        label={label}
        format={dateFormat}
        slotProps={{
          textField: {
            size: 'small',
            fullWidth: true,
            required,
            error,
            helperText,
            placeholder,
            sx: getDatePickerTextFieldStyles(),
            inputProps: {
              'data-testid': 'single-date-picker-input',
            },
          },
        }}
      />
    </Box>
  );
};
