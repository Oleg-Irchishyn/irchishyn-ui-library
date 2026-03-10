import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Box } from '@mui/material';

import {
  DATE_PICKER_DEFAULT_PLACEHOLDER,
  DATE_PICKER_VARIANTS,
  QUICK_SELECT_CLEAR_LABEL,
} from './constants';
import { DatePickerQuickSelectPanel } from './components/DatePickerQuickSelectPanel';
import { DatePickerSingleField } from './components/DatePickerSingleField';
import type { DatePickerProps } from './types';
import {
  useDatePickerVariantConfig,
  useQuickSelectDatePicker,
  useSingleDatePickerValidation,
} from './useDatePicker';

export const DatePicker = (props: DatePickerProps) => {
  const {
    quickSelectValue,
    quickSelectOnChange,
    quickSelectOptions,
    allowCustomRange,
    quickSelectPlaceholder,
  } = useDatePickerVariantConfig(props);

  const {
    triggerLabel,
    anchorEl,
    isOpen,
    selectedQuickOptionValue,
    customRange,
    handleOpen,
    handleClose,
    handleQuickOptionChange,
    handleCustomFromChange,
    handleCustomToChange,
    handleCustomFromError,
    handleCustomToError,
    customFromError,
    customToError,
    handleClearSelection,
  } = useQuickSelectDatePicker({
    value: quickSelectValue,
    onChange: quickSelectOnChange,
    quickSelectOptions,
    allowCustomRange,
    placeholder: quickSelectPlaceholder,
    dateFormat: props.dateFormat,
  });

  const singleValue = props.variant === DATE_PICKER_VARIANTS.SINGLE ? props.value : null;
  const { handleSingleDateError, singleErrorState, singleHelperText } =
    useSingleDatePickerValidation({
      value: singleValue,
      required: props.required,
      error: props.error,
      helperText: props.helperText,
      minDate: props.minDate,
      maxDate: props.maxDate,
      dateFormat: props.dateFormat,
    });

  if (props.variant === DATE_PICKER_VARIANTS.QUICK_SELECT) {
    const {
      label,
      disabled = false,
      required = false,
      error = false,
      helperText,
      clearLabel = QUICK_SELECT_CLEAR_LABEL,
      dateFormat,
      minDate,
      maxDate,
      shouldDisableDate,
      sx,
    } = props;

    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={sx}>
          <DatePickerQuickSelectPanel
            label={label}
            disabled={disabled}
            required={required}
            error={error}
            helperText={helperText}
            clearLabel={clearLabel}
            dateFormat={dateFormat}
            minDate={minDate}
            maxDate={maxDate}
            shouldDisableDate={shouldDisableDate}
            quickSelectPlaceholder={quickSelectPlaceholder}
            triggerLabel={triggerLabel}
            isOpen={isOpen}
            anchorEl={anchorEl}
            selectedQuickOptionValue={selectedQuickOptionValue}
            customRange={customRange}
            quickSelectOptions={quickSelectOptions}
            allowCustomRange={allowCustomRange}
            customFromError={customFromError}
            customToError={customToError}
            onOpen={handleOpen}
            onClose={handleClose}
            onQuickOptionChange={handleQuickOptionChange}
            onCustomFromChange={handleCustomFromChange}
            onCustomToChange={handleCustomToChange}
            onCustomFromError={handleCustomFromError}
            onCustomToError={handleCustomToError}
            onClearSelection={handleClearSelection}
          />
        </Box>
      </LocalizationProvider>
    );
  }

  const {
    value,
    onChange,
    label,
    placeholder = DATE_PICKER_DEFAULT_PLACEHOLDER,
    disabled = false,
    required = false,
    dateFormat,
    minDate,
    maxDate,
    shouldDisableDate,
    sx,
  } = props;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePickerSingleField
        value={value}
        onChange={onChange}
        onError={handleSingleDateError}
        label={label}
        disabled={disabled}
        required={required}
        error={singleErrorState}
        helperText={singleHelperText}
        dateFormat={dateFormat}
        minDate={minDate}
        maxDate={maxDate}
        shouldDisableDate={shouldDisableDate}
        placeholder={placeholder ?? DATE_PICKER_DEFAULT_PLACEHOLDER}
        sx={sx}
      />
    </LocalizationProvider>
  );
};
