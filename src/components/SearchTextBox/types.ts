import type { TextFieldProps } from '@mui/material/TextField';

export interface SearchTextBoxProps extends Omit<
  TextFieldProps,
  'value' | 'onChange' | 'placeholder'
> {
  /** Placeholder text displayed in the input */
  placeholder?: string;
  /** Controlled input value */
  value: string;
  /** Called after debounce period elapses with the current input value */
  onChange: (value: string) => void;
  /** Debounce delay in milliseconds before invoking onChange (default 300) */
  debounceMs?: number;
  /** Optional callback when the clear (X) button is clicked */
  onClear?: () => void;
  /** Accessible label for the input (defaults to placeholder or "Search") */
  ariaLabel?: string;
}
