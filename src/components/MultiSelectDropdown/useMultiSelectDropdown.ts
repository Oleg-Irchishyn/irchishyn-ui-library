import { useCallback, useState } from 'react';

import { MULTI_SELECT_LAYOUT } from './constants';
import type { MultiSelectOption, UseMultiSelectDropdownParams, UseMultiSelectDropdownResult } from './types';
import { filterOptions, getTriggerLabel } from './utils';

export function useMultiSelectDropdown({
  options,
  selectedValues,
  onChange,
  placeholder,
  maxDisplayNames = MULTI_SELECT_LAYOUT.DEFAULT_MAX_DISPLAY_NAMES,
}: UseMultiSelectDropdownParams): UseMultiSelectDropdownResult {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [searchText, setSearchText] = useState('');

  const isOpen = Boolean(anchorEl);
  const filteredOptions: MultiSelectOption[] = filterOptions(options, searchText);
  const isAllSelected = options.length > 0 && selectedValues.length === options.length;
  const isIndeterminate = selectedValues.length > 0 && !isAllSelected;
  const isSelectAllAvailable = !isAllSelected;
  const isDeselectAllAvailable = selectedValues.length > 0;
  const triggerLabel = getTriggerLabel(selectedValues, options, placeholder, maxDisplayNames);

  const handleOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
    setSearchText('');
  }, []);

  const handleToggleOption = useCallback(
    (value: string) => {
      const next = selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value];
      onChange(next);
    },
    [selectedValues, onChange],
  );

  const handleSelectAll = useCallback(() => {
    onChange(options.map((o) => o.value));
  }, [options, onChange]);

  const handleDeselectAll = useCallback(() => {
    onChange([]);
  }, [onChange]);

  const handleInvertSelection = useCallback(() => {
    const inverted = options
      .filter((o) => !selectedValues.includes(o.value))
      .map((o) => o.value);
    onChange(inverted);
  }, [options, selectedValues, onChange]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchText(value);
  }, []);

  return {
    anchorEl,
    isOpen,
    searchText,
    filteredOptions,
    isAllSelected,
    isIndeterminate,
    isSelectAllAvailable,
    isDeselectAllAvailable,
    triggerLabel,
    handleOpen,
    handleClose,
    handleToggleOption,
    handleSelectAll,
    handleDeselectAll,
    handleInvertSelection,
    handleSearchChange,
  };
}
