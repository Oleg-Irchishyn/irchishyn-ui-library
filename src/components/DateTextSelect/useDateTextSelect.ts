import { useMemo, useState } from 'react';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { DateValidationError } from '@mui/x-date-pickers/models';

import type { UseDateTextSelectParams } from './types';
import { getDateValidationMessage } from './utils';

export const useDateTextSelect = ({
  dateValue,
  dateFormat,
  required,
  minDate,
  maxDate,
  onSelectChange,
}: UseDateTextSelectParams) => {
  const [dateError, setDateError] = useState<DateValidationError>(null);

  const requiredError = required && !dateValue;
  const validationError =
    dateError === 'invalidDate' || dateError === 'minDate' || dateError === 'maxDate';
  const isDateInvalid = requiredError || validationError;

  const dateHelperText = useMemo(() => {
    if (!isDateInvalid) {
      return undefined;
    }

    if (validationError) {
      return getDateValidationMessage(dateError, required, minDate, maxDate, dateFormat);
    }

    return getDateValidationMessage(null, required, minDate, maxDate, dateFormat);
  }, [dateError, dateFormat, isDateInvalid, maxDate, minDate, required, validationError]);

  const handleDateError = (error: DateValidationError) => {
    setDateError(error);
  };

  const handleSelectValueChange = (event: SelectChangeEvent<string>) => {
    onSelectChange(event.target.value);
  };

  return {
    isDateInvalid,
    dateHelperText,
    handleDateError,
    handleSelectValueChange,
  };
};
