import { useCallback, useState } from 'react';

import { SELECT_DROPDOWN_LABELS } from './constants';
import type {
  SelectDropdownOption,
  UseSelectDropdownParams,
  UseSelectDropdownResult,
} from './types';
import { filterSelectOptions } from './utils';

export function useSelectDropdown({
  options,
  value,
  onChange,
  placeholder = SELECT_DROPDOWN_LABELS.DEFAULT_PLACEHOLDER,
}: UseSelectDropdownParams): UseSelectDropdownResult {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [searchText, setSearchText] = useState('');

  const isOpen = Boolean(anchorEl);
  const filteredOptions = filterSelectOptions(options, searchText);
  const triggerOption = options.find((o) => o.value === value) ?? null;
  const triggerLabel = triggerOption?.label ?? placeholder;

  const handleOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
    setSearchText('');
  }, []);

  const handleSelectOption = useCallback(
    (option: SelectDropdownOption) => {
      onChange(option);
      setAnchorEl(null);
      setSearchText('');
    },
    [onChange],
  );

  const handleSearchChange = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  return {
    anchorEl,
    isOpen,
    searchText,
    filteredOptions,
    triggerLabel,
    triggerOption,
    handleOpen,
    handleClose,
    handleSelectOption,
    handleSearchChange,
  };
}
