import { useCallback, useEffect, useMemo, useState } from 'react';
import type { MouseEvent } from 'react';
import type { ChangeEvent } from 'react';
import type { ReactNode } from 'react';
import type { DateValidationError } from '@mui/x-date-pickers/models';

import {
  DATE_PICKER_VALUE_FORMAT,
  DATE_PICKER_VARIANTS,
  QUICK_SELECT_DATE_PICKER_DEFAULT_PLACEHOLDER,
} from './constants';
import type { DatePickerProps, DateRange, UseQuickSelectDatePickerParams } from './types';
import {
  getDatePickerValidationMessage,
  getDefaultQuickSelectOptions,
  getQuickSelectTriggerLabel,
  isDateRange,
  isQuickSelectOption,
  isValidDateRange,
  resolveQuickSelectOptionRange,
} from './utils';

const EMPTY_RANGE: DateRange = {
  from: null,
  to: null,
};

const NO_OP_ON_QUICK_CHANGE = () => {};

export const useDatePickerVariantConfig = (props: DatePickerProps) => {
  const isQuickSelectVariant = props.variant === DATE_PICKER_VARIANTS.QUICK_SELECT;
  const quickSelectValue = isQuickSelectVariant ? props.value : null;
  const quickSelectOnChange = isQuickSelectVariant ? props.onChange : NO_OP_ON_QUICK_CHANGE;
  const quickSelectOptions = isQuickSelectVariant
    ? (props.quickSelectOptions ?? getDefaultQuickSelectOptions())
    : [];
  const allowCustomRange = isQuickSelectVariant ? (props.allowCustomRange ?? true) : false;
  const quickSelectPlaceholder = isQuickSelectVariant
    ? (props.placeholder ?? QUICK_SELECT_DATE_PICKER_DEFAULT_PLACEHOLDER)
    : QUICK_SELECT_DATE_PICKER_DEFAULT_PLACEHOLDER;

  return {
    isQuickSelectVariant,
    quickSelectValue,
    quickSelectOnChange,
    quickSelectOptions,
    allowCustomRange,
    quickSelectPlaceholder,
  };
};

export const useSingleDatePickerValidation = ({
  value,
  required = false,
  error = false,
  helperText,
  minDate,
  maxDate,
  dateFormat = DATE_PICKER_VALUE_FORMAT,
}: {
  value: Date | null;
  required?: boolean;
  error?: boolean;
  helperText?: ReactNode;
  minDate?: Date;
  maxDate?: Date;
  dateFormat?: string;
}) => {
  const [singleDateError, setSingleDateError] = useState<DateValidationError>(null);

  const handleSingleDateError = useCallback((nextError: DateValidationError) => {
    setSingleDateError(nextError);
  }, []);

  const singleValidationMessage = useMemo(
    () => getDatePickerValidationMessage(singleDateError, minDate, maxDate, dateFormat),
    [dateFormat, maxDate, minDate, singleDateError],
  );
  const singleRequiredError = required && !value;
  const singleValidationError =
    singleDateError === 'invalidDate' ||
    singleDateError === 'minDate' ||
    singleDateError === 'maxDate';
  const singleErrorState = error || singleRequiredError || singleValidationError;
  const singleHelperText = helperText ?? singleValidationMessage;

  return {
    handleSingleDateError,
    singleErrorState,
    singleHelperText,
  };
};

export const useQuickSelectDatePicker = ({
  value,
  onChange,
  quickSelectOptions,
  allowCustomRange,
  placeholder = QUICK_SELECT_DATE_PICKER_DEFAULT_PLACEHOLDER,
  dateFormat = DATE_PICKER_VALUE_FORMAT,
}: UseQuickSelectDatePickerParams) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [selectedQuickOptionValue, setSelectedQuickOptionValue] = useState<string>('');
  const [customRange, setCustomRange] = useState<DateRange>(EMPTY_RANGE);
  const [customFromError, setCustomFromError] = useState<DateValidationError>(null);
  const [customToError, setCustomToError] = useState<DateValidationError>(null);

  useEffect(() => {
    if (isQuickSelectOption(value)) {
      const optionRange = resolveQuickSelectOptionRange(value);
      setSelectedQuickOptionValue(value.value);
      setCustomRange(optionRange);
      return;
    }

    if (isDateRange(value)) {
      setSelectedQuickOptionValue('');
      setCustomRange(value);
      return;
    }

    setSelectedQuickOptionValue('');
    setCustomRange(EMPTY_RANGE);
  }, [value]);

  const isOpen = Boolean(anchorEl);

  const triggerLabel = useMemo(
    () => getQuickSelectTriggerLabel(value, placeholder, dateFormat),
    [dateFormat, placeholder, value],
  );

  const handleOpen = useCallback((event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleQuickOptionSelect = useCallback(
    (optionValue: string) => {
      const option = quickSelectOptions.find((item) => item.value === optionValue);
      if (!option) {
        return;
      }

      const resolvedRange = resolveQuickSelectOptionRange(option);
      setSelectedQuickOptionValue(option.value);
      setCustomRange(resolvedRange);
      onChange(resolvedRange, option);
    },
    [onChange, quickSelectOptions],
  );

  const handleQuickOptionChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      handleQuickOptionSelect(event.target.value);
    },
    [handleQuickOptionSelect],
  );

  const handleCustomDateChange = useCallback(
    (key: keyof DateRange, nextValue: Date | null) => {
      if (!allowCustomRange) {
        return;
      }

      setSelectedQuickOptionValue('');
      setCustomRange((prevRange) => {
        const nextRange = { ...prevRange, [key]: nextValue };
        if (isValidDateRange(nextRange)) {
          onChange(nextRange, nextRange);
        }
        return nextRange;
      });
    },
    [allowCustomRange, onChange],
  );

  const handleClearSelection = useCallback(() => {
    setSelectedQuickOptionValue('');
    setCustomRange(EMPTY_RANGE);
    onChange(null, null);
  }, [onChange]);

  const handleCustomFromChange = useCallback(
    (nextValue: Date | null) => {
      handleCustomDateChange('from', nextValue);
    },
    [handleCustomDateChange],
  );

  const handleCustomToChange = useCallback(
    (nextValue: Date | null) => {
      handleCustomDateChange('to', nextValue);
    },
    [handleCustomDateChange],
  );

  const handleCustomFromError = useCallback((nextError: DateValidationError) => {
    setCustomFromError(nextError);
  }, []);

  const handleCustomToError = useCallback((nextError: DateValidationError) => {
    setCustomToError(nextError);
  }, []);

  return {
    triggerLabel,
    anchorEl,
    isOpen,
    selectedQuickOptionValue,
    customRange,
    setAnchorEl,
    handleOpen,
    handleClose,
    handleQuickOptionSelect,
    handleQuickOptionChange,
    handleCustomDateChange,
    handleCustomFromChange,
    handleCustomToChange,
    handleCustomFromError,
    handleCustomToError,
    customFromError,
    customToError,
    handleClearSelection,
  };
};
