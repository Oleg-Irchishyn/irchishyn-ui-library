import type { ReactNode } from 'react';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { DateValidationError } from '@mui/x-date-pickers/models';
import type { SxProps, Theme } from '@mui/material/styles';

export interface DateTextSelectOption {
  value: string;
  label: string;
}

export interface DateTextSelectProps {
  dateValue: Date | null;
  onDateChange: (value: Date | null) => void;
  dateFormat?: string;
  shouldDisableDate?: (date: Date) => boolean;
  selectValue: string;
  selectOptions: DateTextSelectOption[];
  onSelectChange: (value: string) => void;
  minDate?: Date;
  maxDate?: Date;
  required?: boolean;
  label?: string;
  disabled?: boolean;
  datePlaceholder?: string;
  selectPlaceholder?: string;
  sx?: SxProps<Theme>;
}

export interface UseDateTextSelectParams {
  dateValue: Date | null;
  dateFormat: string;
  required: boolean;
  minDate?: Date;
  maxDate?: Date;
  onSelectChange: (value: string) => void;
}

export interface UseDateTextSelectResult {
  isDateInvalid: boolean;
  dateHelperText?: ReactNode;
  handleDateError: (error: DateValidationError) => void;
  handleSelectValueChange: (event: SelectChangeEvent<string>) => void;
}
