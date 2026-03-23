import type { SxProps, Theme } from '@mui/material/styles';

export interface MultiSelectOption {
  label: string;
  value: string;
}

export interface MultiSelectDropdownProps {
  /** List of options to display */
  options: MultiSelectOption[];
  /** Currently selected values */
  selectedValues: string[];
  /** Called when selection changes */
  onChange: (values: string[]) => void;
  /** Trigger label shown when nothing is selected or all are selected */
  placeholder?: string;
  /** Placeholder text inside the search input */
  searchPlaceholder?: string;
  /** Whether to show the controls row (Select All / Deselect All / Invert) */
  showSelectAll?: boolean;
  /** Optional label rendered to the left of the control buttons */
  controlsLabel?: string;
  /** Max number of names to display before switching to "{count} Selected" */
  maxDisplayNames?: number;
  /** Disables the trigger button */
  disabled?: boolean;
  /** Additional MUI sx styles for the root element */
  sx?: SxProps<Theme>;
}

export interface UseMultiSelectDropdownParams {
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  maxDisplayNames?: number;
}

export interface UseMultiSelectDropdownResult {
  anchorEl: HTMLElement | null;
  isOpen: boolean;
  searchText: string;
  filteredOptions: MultiSelectOption[];
  isAllSelected: boolean;
  isIndeterminate: boolean;
  /** True when not all options are selected — SelectAll button should be enabled */
  isSelectAllAvailable: boolean;
  /** True when at least one option is selected — Deselect button should be enabled */
  isDeselectAllAvailable: boolean;
  triggerLabel: string;
  handleOpen: (event: React.MouseEvent<HTMLElement>) => void;
  handleClose: () => void;
  handleToggleOption: (value: string) => void;
  handleSelectAll: () => void;
  handleDeselectAll: () => void;
  handleInvertSelection: () => void;
  handleSearchChange: (value: string) => void;
}
