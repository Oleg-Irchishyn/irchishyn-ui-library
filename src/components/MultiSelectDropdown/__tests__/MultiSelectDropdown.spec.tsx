import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { MultiSelectDropdown } from '../MultiSelectDropdown';
import type { UseMultiSelectDropdownResult } from '../types';

// Mock hook
const useMultiSelectDropdownMock = vi.hoisted(() => vi.fn());
vi.mock('../useMultiSelectDropdown', () => ({
  useMultiSelectDropdown: useMultiSelectDropdownMock,
}));

// Mock SearchTextBox
vi.mock('../../SearchTextBox', () => ({
  SearchTextBox: ({
    value,
    onChange,
    placeholder,
  }: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
  }) => (
    <input
      data-testid="search-text-box-input"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

const baseHook: UseMultiSelectDropdownResult = {
  anchorEl: null,
  isOpen: false,
  searchText: '',
  filteredOptions: [
    { label: 'Acme Corp', value: 'acme' },
    { label: 'Omega Fund', value: 'omega' },
  ],
  isAllSelected: false,
  isIndeterminate: false,
  isSelectAllAvailable: true,
  isDeselectAllAvailable: false,
  triggerLabel: 'All Sponsors',
  handleOpen: vi.fn(),
  handleClose: vi.fn(),
  handleToggleOption: vi.fn(),
  handleSelectAll: vi.fn(),
  handleDeselectAll: vi.fn(),
  handleInvertSelection: vi.fn(),
  handleSearchChange: vi.fn(),
};

const defaultProps = {
  options: [
    { label: 'Acme Corp', value: 'acme' },
    { label: 'Omega Fund', value: 'omega' },
  ],
  selectedValues: [],
  onChange: vi.fn(),
};

describe('MultiSelectDropdown', () => {
  it('renders trigger with the label from hook', () => {
    useMultiSelectDropdownMock.mockReturnValue({ ...baseHook });
    render(<MultiSelectDropdown {...defaultProps} />);
    expect(screen.getByTestId('multi-select-dropdown-label').textContent).toBe('All Sponsors');
  });

  it('renders trigger button', () => {
    useMultiSelectDropdownMock.mockReturnValue({ ...baseHook });
    render(<MultiSelectDropdown {...defaultProps} />);
    expect(screen.getByTestId('multi-select-dropdown-trigger')).toBeTruthy();
  });

  it('does not render popover content when closed', () => {
    useMultiSelectDropdownMock.mockReturnValue({ ...baseHook, isOpen: false });
    render(<MultiSelectDropdown {...defaultProps} />);
    expect(screen.queryByTestId('multi-select-dropdown-popover')).toBeNull();
  });

  it('renders popover with search and options when open', () => {
    const anchorEl = document.createElement('button');
    useMultiSelectDropdownMock.mockReturnValue({ ...baseHook, isOpen: true, anchorEl });
    render(<MultiSelectDropdown {...defaultProps} />);
    expect(screen.getByTestId('multi-select-dropdown-popover')).toBeTruthy();
    expect(screen.getByTestId('search-text-box-input')).toBeTruthy();
    expect(screen.getByTestId('multi-select-option-acme')).toBeTruthy();
    expect(screen.getByTestId('multi-select-option-omega')).toBeTruthy();
  });

  describe('controls row (showSelectAll=true)', () => {
    it('renders select-all, deselect-all and invert buttons', () => {
      const anchorEl = document.createElement('button');
      useMultiSelectDropdownMock.mockReturnValue({ ...baseHook, isOpen: true, anchorEl });
      render(<MultiSelectDropdown {...defaultProps} showSelectAll />);
      expect(screen.getByTestId('multi-select-dropdown-select-all')).toBeTruthy();
      expect(screen.getByTestId('multi-select-dropdown-deselect-all')).toBeTruthy();
      expect(screen.getByTestId('multi-select-dropdown-invert')).toBeTruthy();
    });

    it('select-all button is disabled when isSelectAllAvailable=false', () => {
      const anchorEl = document.createElement('button');
      useMultiSelectDropdownMock.mockReturnValue({
        ...baseHook,
        isOpen: true,
        anchorEl,
        isSelectAllAvailable: false,
      });
      render(<MultiSelectDropdown {...defaultProps} showSelectAll />);
      expect(screen.getByTestId('multi-select-dropdown-select-all')).toBeDisabled();
    });

    it('deselect-all button is disabled when isDeselectAllAvailable=false', () => {
      const anchorEl = document.createElement('button');
      useMultiSelectDropdownMock.mockReturnValue({
        ...baseHook,
        isOpen: true,
        anchorEl,
        isDeselectAllAvailable: false,
      });
      render(<MultiSelectDropdown {...defaultProps} showSelectAll />);
      expect(screen.getByTestId('multi-select-dropdown-deselect-all')).toBeDisabled();
    });

    it('invert button is always enabled', () => {
      const anchorEl = document.createElement('button');
      useMultiSelectDropdownMock.mockReturnValue({ ...baseHook, isOpen: true, anchorEl });
      render(<MultiSelectDropdown {...defaultProps} showSelectAll />);
      expect(screen.getByTestId('multi-select-dropdown-invert')).not.toBeDisabled();
    });

    it('renders controlsLabel when provided', () => {
      const anchorEl = document.createElement('button');
      useMultiSelectDropdownMock.mockReturnValue({ ...baseHook, isOpen: true, anchorEl });
      render(<MultiSelectDropdown {...defaultProps} showSelectAll controlsLabel="Entities" />);
      expect(screen.getByText('Entities')).toBeTruthy();
    });
  });

  describe('controls row (showSelectAll=false)', () => {
    it('does not render controls row', () => {
      const anchorEl = document.createElement('button');
      useMultiSelectDropdownMock.mockReturnValue({ ...baseHook, isOpen: true, anchorEl });
      render(<MultiSelectDropdown {...defaultProps} showSelectAll={false} />);
      expect(screen.queryByTestId('multi-select-dropdown-select-all')).toBeNull();
    });

    it('renders bottom clear-selection when items are selected', () => {
      const anchorEl = document.createElement('button');
      useMultiSelectDropdownMock.mockReturnValue({
        ...baseHook,
        isOpen: true,
        anchorEl,
        isDeselectAllAvailable: true,
      });
      render(
        <MultiSelectDropdown {...defaultProps} showSelectAll={false} selectedValues={['acme']} />,
      );
      expect(screen.getByTestId('multi-select-dropdown-clear-bottom')).toBeTruthy();
    });

    it('does not render bottom clear-selection when nothing is selected', () => {
      const anchorEl = document.createElement('button');
      useMultiSelectDropdownMock.mockReturnValue({
        ...baseHook,
        isOpen: true,
        anchorEl,
        isDeselectAllAvailable: false,
      });
      render(<MultiSelectDropdown {...defaultProps} showSelectAll={false} selectedValues={[]} />);
      expect(screen.queryByTestId('multi-select-dropdown-clear-bottom')).toBeNull();
    });
  });

  it('renders empty state when no filtered options', () => {
    const anchorEl = document.createElement('button');
    useMultiSelectDropdownMock.mockReturnValue({
      ...baseHook,
      isOpen: true,
      anchorEl,
      filteredOptions: [],
    });
    render(<MultiSelectDropdown {...defaultProps} />);
    expect(screen.getByText('No options found')).toBeTruthy();
  });

  it('calls handleOpen when trigger is clicked', () => {
    const handleOpen = vi.fn();
    useMultiSelectDropdownMock.mockReturnValue({ ...baseHook, handleOpen });
    render(<MultiSelectDropdown {...defaultProps} />);
    fireEvent.click(screen.getByTestId('multi-select-dropdown-trigger'));
    expect(handleOpen).toHaveBeenCalled();
  });

  it('calls handleToggleOption when an option is clicked', () => {
    const anchorEl = document.createElement('button');
    const handleToggleOption = vi.fn();
    useMultiSelectDropdownMock.mockReturnValue({
      ...baseHook,
      isOpen: true,
      anchorEl,
      handleToggleOption,
    });
    render(<MultiSelectDropdown {...defaultProps} />);
    fireEvent.click(screen.getByTestId('multi-select-option-acme'));
    expect(handleToggleOption).toHaveBeenCalledWith('acme');
  });

  it('calls handleSelectAll when select-all button is clicked', () => {
    const anchorEl = document.createElement('button');
    const handleSelectAll = vi.fn();
    useMultiSelectDropdownMock.mockReturnValue({
      ...baseHook,
      isOpen: true,
      anchorEl,
      handleSelectAll,
      isSelectAllAvailable: true,
    });
    render(<MultiSelectDropdown {...defaultProps} showSelectAll />);
    fireEvent.click(screen.getByTestId('multi-select-dropdown-select-all'));
    expect(handleSelectAll).toHaveBeenCalled();
  });

  it('calls handleDeselectAll when deselect-all button is clicked', () => {
    const anchorEl = document.createElement('button');
    const handleDeselectAll = vi.fn();
    useMultiSelectDropdownMock.mockReturnValue({
      ...baseHook,
      isOpen: true,
      anchorEl,
      handleDeselectAll,
      isDeselectAllAvailable: true,
    });
    render(<MultiSelectDropdown {...defaultProps} showSelectAll />);
    fireEvent.click(screen.getByTestId('multi-select-dropdown-deselect-all'));
    expect(handleDeselectAll).toHaveBeenCalled();
  });

  it('calls handleInvertSelection when invert button is clicked', () => {
    const anchorEl = document.createElement('button');
    const handleInvertSelection = vi.fn();
    useMultiSelectDropdownMock.mockReturnValue({
      ...baseHook,
      isOpen: true,
      anchorEl,
      handleInvertSelection,
    });
    render(<MultiSelectDropdown {...defaultProps} showSelectAll />);
    fireEvent.click(screen.getByTestId('multi-select-dropdown-invert'));
    expect(handleInvertSelection).toHaveBeenCalled();
  });

  it('trigger is disabled when disabled=true', () => {
    useMultiSelectDropdownMock.mockReturnValue({ ...baseHook });
    render(<MultiSelectDropdown {...defaultProps} disabled />);
    expect(screen.getByTestId('multi-select-dropdown-trigger')).toBeDisabled();
  });

  it('passes searchPlaceholder to SearchTextBox', () => {
    const anchorEl = document.createElement('button');
    useMultiSelectDropdownMock.mockReturnValue({ ...baseHook, isOpen: true, anchorEl });
    render(<MultiSelectDropdown {...defaultProps} searchPlaceholder="Search sponsors..." />);
    expect(screen.getByPlaceholderText('Search sponsors...')).toBeTruthy();
  });
});
