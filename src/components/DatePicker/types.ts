import type { SxProps, Theme } from '@mui/material/styles';
import type { ChangeEvent, MouseEvent, ReactNode } from 'react';
import type { DateValidationError } from '@mui/x-date-pickers/models';

import type { DATE_PICKER_VARIANTS } from './constants';

export type DatePickerVariant = (typeof DATE_PICKER_VARIANTS)[keyof typeof DATE_PICKER_VARIANTS];

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface QuickSelectOption {
  value: string;
  label: string;
  getRange?: (referenceDate: Date) => DateRange;
  range?: DateRange;
}

export interface DatePickerBaseProps {
  label?: string;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: ReactNode;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
  shouldDisableDate?: (date: Date) => boolean;
  placeholder?: string;
  sx?: SxProps<Theme>;
}

export interface SingleDatePickerProps extends DatePickerBaseProps {
  variant?: typeof DATE_PICKER_VARIANTS.SINGLE;
  value: Date | null;
  onChange: (value: Date | null) => void;
}

export interface QuickSelectDatePickerProps extends DatePickerBaseProps {
  variant: typeof DATE_PICKER_VARIANTS.QUICK_SELECT;
  value: DateRange | QuickSelectOption | null;
  onChange: (resolvedRange: DateRange | null, value: DateRange | QuickSelectOption | null) => void;
  quickSelectOptions?: QuickSelectOption[];
  allowCustomRange?: boolean;
  clearLabel?: string;
}

export type DatePickerProps = SingleDatePickerProps | QuickSelectDatePickerProps;

export interface UseQuickSelectDatePickerParams {
  value: DateRange | QuickSelectOption | null;
  onChange: (resolvedRange: DateRange | null, value: DateRange | QuickSelectOption | null) => void;
  quickSelectOptions: QuickSelectOption[];
  allowCustomRange: boolean;
  placeholder?: string;
  dateFormat?: string;
}

export interface UseQuickSelectDatePickerResult {
  triggerLabel: string;
  anchorEl: HTMLDivElement | null;
  isOpen: boolean;
  selectedQuickOptionValue: string;
  customRange: DateRange;
  setAnchorEl: (anchorEl: HTMLDivElement | null) => void;
  handleOpen: (event: MouseEvent<HTMLDivElement>) => void;
  handleClose: () => void;
  handleQuickOptionSelect: (optionValue: string) => void;
  handleQuickOptionChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleCustomDateChange: (key: keyof DateRange, nextValue: Date | null) => void;
  handleCustomFromChange: (nextValue: Date | null) => void;
  handleCustomToChange: (nextValue: Date | null) => void;
  handleCustomFromError: (nextError: DateValidationError) => void;
  handleCustomToError: (nextError: DateValidationError) => void;
  customFromError: DateValidationError;
  customToError: DateValidationError;
  handleClearSelection: () => void;
}

export interface DatePickerSingleFieldProps {
  value: Date | null;
  onChange: (value: Date | null) => void;
  onError: (error: DateValidationError) => void;
  label?: string;
  disabled: boolean;
  required: boolean;
  error: boolean;
  helperText?: ReactNode;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
  shouldDisableDate?: (date: Date) => boolean;
  placeholder?: string;
  sx?: SxProps<Theme>;
}

export interface DatePickerQuickSelectPanelProps {
  label?: string;
  disabled: boolean;
  required: boolean;
  error: boolean;
  helperText?: ReactNode;
  clearLabel: string;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
  shouldDisableDate?: (date: Date) => boolean;
  quickSelectPlaceholder: string;
  triggerLabel: string;
  isOpen: boolean;
  anchorEl: HTMLDivElement | null;
  selectedQuickOptionValue: string;
  customRange: DateRange;
  quickSelectOptions: QuickSelectOption[];
  allowCustomRange: boolean;
  customFromError: DateValidationError;
  customToError: DateValidationError;
  onOpen: (event: MouseEvent<HTMLDivElement>) => void;
  onClose: () => void;
  onQuickOptionChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onCustomFromChange: (value: Date | null) => void;
  onCustomToChange: (value: Date | null) => void;
  onCustomFromError: (error: DateValidationError) => void;
  onCustomToError: (error: DateValidationError) => void;
  onClearSelection: () => void;
}
