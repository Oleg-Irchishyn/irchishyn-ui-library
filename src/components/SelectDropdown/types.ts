import type { ReactNode } from 'react';

import type { SxProps, Theme } from '@mui/material/styles';

import type { BadgeColorPreset } from '../../types';

export interface SelectDropdownOption {
  label: string;
  value: string;
  badgeLabel?: string;
  badgeColor?: BadgeColorPreset | string;
}

export interface SelectDropdownActionButton {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  /** When true, the dropdown closes after the button is clicked. Defaults to false. */
  closeOnClick?: boolean;
}

export interface SelectDropdownProps {
  /** List of selectable options */
  options: SelectDropdownOption[];
  /** Currently selected value, or null when nothing is selected */
  value: string | null;
  /** Called with the selected option when the user picks one */
  onChange: (option: SelectDropdownOption) => void;
  /** Placeholder text inside the search input */
  searchPlaceholder?: string;
  /** Optional action buttons rendered above the options list */
  actionButtons?: SelectDropdownActionButton[];
  /** Label shown in the trigger when no option is selected */
  placeholder?: string;
  /** Disables the trigger button */
  disabled?: boolean;
  /** Shows a loading spinner inside the dropdown list while options are being fetched */
  loading?: boolean;
  /** Additional MUI sx styles for the root element */
  sx?: SxProps<Theme>;
}

export interface UseSelectDropdownParams {
  options: SelectDropdownOption[];
  value: string | null;
  onChange: (option: SelectDropdownOption) => void;
  placeholder?: string;
}

export interface UseSelectDropdownResult {
  anchorEl: HTMLElement | null;
  isOpen: boolean;
  searchText: string;
  filteredOptions: SelectDropdownOption[];
  triggerLabel: string;
  triggerOption: SelectDropdownOption | null;
  handleOpen: (event: React.MouseEvent<HTMLElement>) => void;
  handleClose: () => void;
  handleSelectOption: (option: SelectDropdownOption) => void;
  handleSearchChange: (value: string) => void;
}
