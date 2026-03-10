import type { DateValidationError } from '@mui/x-date-pickers/models';
import { format } from 'date-fns';

import {
  DATE_TEXT_SELECT_DATE_FORMAT,
  DATE_TEXT_SELECT_DEFAULT_INVALID_ERROR,
  DATE_TEXT_SELECT_MAX_ERROR_PREFIX,
  DATE_TEXT_SELECT_MIN_ERROR_PREFIX,
  DATE_TEXT_SELECT_DEFAULT_REQUIRED_ERROR,
} from './constants';

const toFormatHint = (dateFormat: string): string =>
  dateFormat.replaceAll('d', 'D').replaceAll('y', 'Y');

export const getDateValidationMessage = (
  error: DateValidationError,
  required: boolean,
  minDate?: Date,
  maxDate?: Date,
  dateFormat = DATE_TEXT_SELECT_DATE_FORMAT,
): string | undefined => {
  if (error === 'invalidDate') {
    if (dateFormat === DATE_TEXT_SELECT_DATE_FORMAT) {
      return DATE_TEXT_SELECT_DEFAULT_INVALID_ERROR;
    }

    return `Enter a valid date (${toFormatHint(dateFormat)})`;
  }

  if (error === 'minDate' && minDate) {
    return `${DATE_TEXT_SELECT_MIN_ERROR_PREFIX} ${format(minDate, dateFormat)}`;
  }

  if (error === 'maxDate' && maxDate) {
    return `${DATE_TEXT_SELECT_MAX_ERROR_PREFIX} ${format(maxDate, dateFormat)}`;
  }

  if (required && error === null) {
    return DATE_TEXT_SELECT_DEFAULT_REQUIRED_ERROR;
  }

  return undefined;
};
