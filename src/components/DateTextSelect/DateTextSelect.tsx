import { Box, FormControl, MenuItem, Select, Typography } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import {
  DATE_TEXT_SELECT_DATE_FORMAT,
  DATE_TEXT_SELECT_DEFAULT_DATE_PLACEHOLDER,
  DATE_TEXT_SELECT_DEFAULT_SELECT_PLACEHOLDER,
} from './constants';
import {
  dateTextSelectRootStyles,
  dateTextSelectRowStyles,
  getDateTextSelectInputStyles,
} from './styles';
import type { DateTextSelectProps } from './types';
import { useDateTextSelect } from './useDateTextSelect';

export const DateTextSelect = ({
  dateValue,
  onDateChange,
  dateFormat = DATE_TEXT_SELECT_DATE_FORMAT,
  shouldDisableDate,
  selectValue,
  selectOptions,
  onSelectChange,
  minDate,
  maxDate,
  required = false,
  label = 'Date',
  disabled = false,
  datePlaceholder = DATE_TEXT_SELECT_DEFAULT_DATE_PLACEHOLDER,
  selectPlaceholder = DATE_TEXT_SELECT_DEFAULT_SELECT_PLACEHOLDER,
  sx,
}: DateTextSelectProps) => {
  const { isDateInvalid, dateHelperText, handleDateError, handleSelectValueChange } =
    useDateTextSelect({
      dateValue,
      dateFormat,
      required,
      minDate,
      maxDate,
      onSelectChange,
    });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={[dateTextSelectRootStyles, ...(Array.isArray(sx) ? sx : [sx])]}
        data-testid="date-text-select"
      >
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {label}
        </Typography>
        <Box sx={dateTextSelectRowStyles}>
          <DatePicker
            value={dateValue}
            onChange={onDateChange}
            onError={handleDateError}
            minDate={minDate}
            maxDate={maxDate}
            shouldDisableDate={shouldDisableDate}
            format={dateFormat}
            disabled={disabled}
            slotProps={{
              textField: {
                required,
                error: isDateInvalid,
                helperText: dateHelperText,
                placeholder: datePlaceholder,
                size: 'small',
                fullWidth: true,
                sx: getDateTextSelectInputStyles(),
                inputProps: {
                  'data-testid': 'date-text-select-date-input',
                },
              },
            }}
          />

          <FormControl size="small" fullWidth disabled={disabled}>
            <Select
              value={selectValue}
              displayEmpty
              onChange={handleSelectValueChange}
              sx={getDateTextSelectInputStyles()}
              inputProps={{
                'aria-label': 'Date text select dropdown',
                autoComplete: 'off',
                'data-testid': 'date-text-select-select-input',
              }}
            >
              <MenuItem value="" disabled>
                {selectPlaceholder}
              </MenuItem>
              {selectOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};
