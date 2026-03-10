export const DATE_PICKER_VARIANTS = {
  SINGLE: 'single',
  QUICK_SELECT: 'quick-select',
} as const;

export const DATE_PICKER_DEFAULT_PLACEHOLDER = 'Select Notice Date';
export const DATE_PICKER_RANGE_INPUT_PLACEHOLDER = 'MM/DD/YYYY';
export const QUICK_SELECT_DATE_PICKER_DEFAULT_PLACEHOLDER = 'Select date range';
export const QUICK_SELECT_CLEAR_LABEL = 'Clear selection';
export const DATE_PICKER_VALUE_FORMAT = 'MM/dd/yyyy';
export const DATE_PICKER_INVALID_ERROR = 'Enter a valid date (MM/DD/YYYY)';
export const DATE_PICKER_MIN_ERROR_PREFIX = 'Date should be on or after';
export const DATE_PICKER_MAX_ERROR_PREFIX = 'Date should be on or before';
export const QUICK_SELECT_ALL_TIME_START_DATE = new Date(1990, 0, 1);

export const QUICK_SELECT_PRESET_VALUES = {
  LAST_1_MONTH: 'last-1-month',
  LAST_3_MONTHS: 'last-3-months',
  LAST_1_YEAR: 'last-1-year',
  ALL_TIME: 'all-time',
} as const;
