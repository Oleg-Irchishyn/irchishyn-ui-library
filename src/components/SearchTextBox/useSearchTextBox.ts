import { useCallback, useEffect, useRef, useState } from 'react';

import { SEARCH_TEXT_BOX_DEFAULT_DEBOUNCE_MS } from './constants';

export interface UseSearchTextBoxParams {
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
  onClear?: () => void;
}

export interface UseSearchTextBoxResult {
  localValue: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleClear: () => void;
  showClearButton: boolean;
}

export function useSearchTextBox({
  value,
  onChange,
  debounceMs = SEARCH_TEXT_BOX_DEFAULT_DEBOUNCE_MS,
  onClear,
}: UseSearchTextBoxParams): UseSearchTextBoxResult {
  const [localValue, setLocalValue] = useState(value);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const scheduleOnChange = useCallback(
    (newValue: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      if (debounceMs <= 0) {
        onChange(newValue);
        return;
      }
      debounceTimerRef.current = setTimeout(() => {
        debounceTimerRef.current = null;
        onChange(newValue);
      }, debounceMs);
    },
    [onChange, debounceMs],
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setLocalValue(newValue);
      scheduleOnChange(newValue);
    },
    [scheduleOnChange],
  );

  const handleClear = useCallback(() => {
    setLocalValue('');
    onChange('');
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    onClear?.();
  }, [onChange, onClear]);

  const showClearButton = localValue.length > 0;

  return { localValue, handleChange, handleClear, showClearButton };
}
