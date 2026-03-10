import { endOfDay, format, isValid, startOfDay, subMonths, subYears } from 'date-fns';
import type { DateValidationError } from '@mui/x-date-pickers/models';

import {
  DATE_PICKER_INVALID_ERROR,
  DATE_PICKER_MAX_ERROR_PREFIX,
  DATE_PICKER_MIN_ERROR_PREFIX,
  DATE_PICKER_VALUE_FORMAT,
  QUICK_SELECT_ALL_TIME_START_DATE,
  QUICK_SELECT_PRESET_VALUES,
} from './constants';
import type { DateRange, QuickSelectOption } from './types';

export const toDateLabel = (date: Date | null): string =>
  date ? format(date, DATE_PICKER_VALUE_FORMAT) : '';

const toDateLabelWithFormat = (date: Date | null, dateFormat: string): string =>
  date ? format(date, dateFormat) : '';

const toFormatHint = (dateFormat: string): string =>
  dateFormat.replaceAll('d', 'D').replaceAll('y', 'Y');

export const isDateRange = (value: unknown): value is DateRange => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const maybeRange = value as Partial<DateRange>;

  return 'from' in maybeRange && 'to' in maybeRange;
};

export const isQuickSelectOption = (value: unknown): value is QuickSelectOption => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const maybeOption = value as Partial<QuickSelectOption>;
  return typeof maybeOption.value === 'string' && typeof maybeOption.label === 'string';
};

export const isValidDateRange = (range: DateRange): boolean => {
  if (!range.from || !range.to) {
    return false;
  }

  return isValid(range.from) && isValid(range.to) && range.from <= range.to;
};

export const resolveQuickSelectOptionRange = (
  option: QuickSelectOption,
  referenceDate = new Date(),
): DateRange => {
  if (option.getRange) {
    return option.getRange(referenceDate);
  }

  if (option.range) {
    return option.range;
  }

  const endDate = endOfDay(referenceDate);
  return { from: startOfDay(endDate), to: endDate };
};

export const getDefaultQuickSelectOptions = (): QuickSelectOption[] => [
  {
    value: QUICK_SELECT_PRESET_VALUES.LAST_1_MONTH,
    label: 'Last 1 Month',
    getRange: (referenceDate) => ({
      from: startOfDay(subMonths(referenceDate, 1)),
      to: endOfDay(referenceDate),
    }),
  },
  {
    value: QUICK_SELECT_PRESET_VALUES.LAST_3_MONTHS,
    label: 'Last 3 Months',
    getRange: (referenceDate) => ({
      from: startOfDay(subMonths(referenceDate, 3)),
      to: endOfDay(referenceDate),
    }),
  },
  {
    value: QUICK_SELECT_PRESET_VALUES.LAST_1_YEAR,
    label: 'Last 1 Year',
    getRange: (referenceDate) => ({
      from: startOfDay(subYears(referenceDate, 1)),
      to: endOfDay(referenceDate),
    }),
  },
  {
    value: QUICK_SELECT_PRESET_VALUES.ALL_TIME,
    label: 'All Time',
    getRange: (referenceDate) => ({
      from: startOfDay(QUICK_SELECT_ALL_TIME_START_DATE),
      to: endOfDay(referenceDate),
    }),
  },
];

export const getQuickSelectTriggerLabel = (
  value: DateRange | QuickSelectOption | null,
  placeholder: string,
  dateFormat = DATE_PICKER_VALUE_FORMAT,
): string => {
  if (!value) {
    return placeholder;
  }

  if (isQuickSelectOption(value)) {
    return value.label;
  }

  if (isDateRange(value) && isValidDateRange(value)) {
    return `${toDateLabelWithFormat(value.from, dateFormat)} - ${toDateLabelWithFormat(value.to, dateFormat)}`;
  }

  return placeholder;
};

export const getDatePickerValidationMessage = (
  error: DateValidationError,
  minDate?: Date,
  maxDate?: Date,
  dateFormat = DATE_PICKER_VALUE_FORMAT,
): string | undefined => {
  if (error === 'invalidDate') {
    if (dateFormat === DATE_PICKER_VALUE_FORMAT) {
      return DATE_PICKER_INVALID_ERROR;
    }

    return `Enter a valid date (${toFormatHint(dateFormat)})`;
  }

  if (error === 'minDate' && minDate) {
    return `${DATE_PICKER_MIN_ERROR_PREFIX} ${toDateLabelWithFormat(minDate, dateFormat)}`;
  }

  if (error === 'maxDate' && maxDate) {
    return `${DATE_PICKER_MAX_ERROR_PREFIX} ${toDateLabelWithFormat(maxDate, dateFormat)}`;
  }

  return undefined;
};
