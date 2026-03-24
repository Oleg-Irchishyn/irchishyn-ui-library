import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SelectDropdown } from '../SelectDropdown';
import type { UseSelectDropdownResult } from '../types';

// Mock hook
const useSelectDropdownMock = vi.hoisted(() => vi.fn());
vi.mock('../useSelectDropdown', () => ({
  useSelectDropdown: useSelectDropdownMock,
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

// Mock Badge
vi.mock('../../Badge', () => ({
  Badge: ({ label, 'data-testid': testId }: { label: string; 'data-testid'?: string }) => (
    <span data-testid={testId ?? 'badge'}>{label}</span>
  ),
}));

const baseHook: UseSelectDropdownResult = {
  anchorEl: null,
  isOpen: false,
  searchText: '',
  filteredOptions: [
    { label: 'Fund of Funds', value: 'fof', badgeLabel: 'System' },
    { label: 'Direct Fund', value: 'df' },
  ],
  triggerLabel: 'Select...',
  triggerOption: null,
  handleOpen: vi.fn(),
  handleClose: vi.fn(),
  handleSelectOption: vi.fn(),
  handleSearchChange: vi.fn(),
};

const defaultProps = {
  options: [
    { label: 'Fund of Funds', value: 'fof', badgeLabel: 'System' },
    { label: 'Direct Fund', value: 'df' },
  ],
  value: null,
  onChange: vi.fn(),
};

describe('SelectDropdown', () => {
  it('renders trigger with the label from hook', () => {
    useSelectDropdownMock.mockReturnValue({ ...baseHook });
    render(<SelectDropdown {...defaultProps} />);
    expect(screen.getByTestId('select-dropdown-label').textContent).toBe('Select...');
  });

  it('renders trigger button', () => {
    useSelectDropdownMock.mockReturnValue({ ...baseHook });
    render(<SelectDropdown {...defaultProps} />);
    expect(screen.getByTestId('select-dropdown-trigger')).toBeTruthy();
  });

  it('does not render popover content when closed', () => {
    useSelectDropdownMock.mockReturnValue({ ...baseHook, isOpen: false });
    render(<SelectDropdown {...defaultProps} />);
    expect(screen.queryByTestId('select-dropdown-popover')).toBeNull();
  });

  it('renders popover with search and options when open', () => {
    const anchorEl = document.createElement('button');
    useSelectDropdownMock.mockReturnValue({ ...baseHook, isOpen: true, anchorEl });
    render(<SelectDropdown {...defaultProps} />);
    expect(screen.getByTestId('select-dropdown-popover')).toBeTruthy();
    expect(screen.getByTestId('search-text-box-input')).toBeTruthy();
    expect(screen.getByTestId('select-dropdown-option-fof')).toBeTruthy();
    expect(screen.getByTestId('select-dropdown-option-df')).toBeTruthy();
  });

  it('renders badge on trigger when selected option has badgeLabel', () => {
    useSelectDropdownMock.mockReturnValue({
      ...baseHook,
      triggerOption: { label: 'Fund of Funds', value: 'fof', badgeLabel: 'System' },
      triggerLabel: 'Fund of Funds',
    });
    render(<SelectDropdown {...defaultProps} value="fof" />);
    expect(screen.getByTestId('select-dropdown-trigger-badge')).toBeTruthy();
  });

  it('does not render badge on trigger when no option is selected', () => {
    useSelectDropdownMock.mockReturnValue({ ...baseHook, triggerOption: null });
    render(<SelectDropdown {...defaultProps} />);
    expect(screen.queryByTestId('select-dropdown-trigger-badge')).toBeNull();
  });

  it('does not render badge on trigger when selected option has no badgeLabel', () => {
    useSelectDropdownMock.mockReturnValue({
      ...baseHook,
      triggerOption: { label: 'Direct Fund', value: 'df' },
      triggerLabel: 'Direct Fund',
    });
    render(<SelectDropdown {...defaultProps} value="df" />);
    expect(screen.queryByTestId('select-dropdown-trigger-badge')).toBeNull();
  });

  it('renders badge on option that has badgeLabel', () => {
    const anchorEl = document.createElement('button');
    useSelectDropdownMock.mockReturnValue({ ...baseHook, isOpen: true, anchorEl });
    render(<SelectDropdown {...defaultProps} />);
    const fofOption = screen.getByTestId('select-dropdown-option-fof');
    expect(fofOption.querySelector('[data-testid="badge"]')).toBeTruthy();
  });

  it('does not render badge on option without badgeLabel', () => {
    const anchorEl = document.createElement('button');
    useSelectDropdownMock.mockReturnValue({ ...baseHook, isOpen: true, anchorEl });
    render(<SelectDropdown {...defaultProps} />);
    const dfOption = screen.getByTestId('select-dropdown-option-df');
    expect(dfOption.querySelector('[data-testid="badge"]')).toBeNull();
  });

  it('renders empty state when no filtered options', () => {
    const anchorEl = document.createElement('button');
    useSelectDropdownMock.mockReturnValue({
      ...baseHook,
      isOpen: true,
      anchorEl,
      filteredOptions: [],
    });
    render(<SelectDropdown {...defaultProps} />);
    expect(screen.getByText('No options found')).toBeTruthy();
  });

  it('calls handleOpen when trigger is clicked', () => {
    const handleOpen = vi.fn();
    useSelectDropdownMock.mockReturnValue({ ...baseHook, handleOpen });
    render(<SelectDropdown {...defaultProps} />);
    fireEvent.click(screen.getByTestId('select-dropdown-trigger'));
    expect(handleOpen).toHaveBeenCalled();
  });

  it('calls handleSelectOption when an option is clicked', () => {
    const anchorEl = document.createElement('button');
    const handleSelectOption = vi.fn();
    useSelectDropdownMock.mockReturnValue({
      ...baseHook,
      isOpen: true,
      anchorEl,
      handleSelectOption,
    });
    render(<SelectDropdown {...defaultProps} />);
    fireEvent.click(screen.getByTestId('select-dropdown-option-fof'));
    expect(handleSelectOption).toHaveBeenCalledWith({
      label: 'Fund of Funds',
      value: 'fof',
      badgeLabel: 'System',
    });
  });

  it('trigger is disabled when disabled=true', () => {
    useSelectDropdownMock.mockReturnValue({ ...baseHook });
    render(<SelectDropdown {...defaultProps} disabled />);
    expect(screen.getByTestId('select-dropdown-trigger')).toBeDisabled();
  });

  it('passes searchPlaceholder to SearchTextBox', () => {
    const anchorEl = document.createElement('button');
    useSelectDropdownMock.mockReturnValue({ ...baseHook, isOpen: true, anchorEl });
    render(<SelectDropdown {...defaultProps} searchPlaceholder="Search reports..." />);
    expect(screen.getByPlaceholderText('Search reports...')).toBeTruthy();
  });

  it('does not render action buttons section when actionButtons is empty', () => {
    const anchorEl = document.createElement('button');
    useSelectDropdownMock.mockReturnValue({ ...baseHook, isOpen: true, anchorEl });
    render(<SelectDropdown {...defaultProps} actionButtons={[]} />);
    expect(screen.queryByTestId('select-dropdown-action-0')).toBeNull();
  });

  it('renders configured action buttons', () => {
    const anchorEl = document.createElement('button');
    useSelectDropdownMock.mockReturnValue({ ...baseHook, isOpen: true, anchorEl });
    render(
      <SelectDropdown
        {...defaultProps}
        actionButtons={[
          { label: 'Refresh List', icon: <span>↻</span>, onClick: vi.fn() },
          { label: 'Create New', icon: <span>+</span>, onClick: vi.fn() },
        ]}
      />,
    );
    expect(screen.getByTestId('select-dropdown-action-0')).toBeTruthy();
    expect(screen.getByTestId('select-dropdown-action-1')).toBeTruthy();
    expect(screen.getByText('Refresh List')).toBeTruthy();
    expect(screen.getByText('Create New')).toBeTruthy();
  });

  it('calls action button onClick when clicked', () => {
    const anchorEl = document.createElement('button');
    const onActionClick = vi.fn();
    useSelectDropdownMock.mockReturnValue({ ...baseHook, isOpen: true, anchorEl });
    render(
      <SelectDropdown
        {...defaultProps}
        actionButtons={[{ label: 'Refresh List', onClick: onActionClick }]}
      />,
    );
    fireEvent.click(screen.getByTestId('select-dropdown-action-0'));
    expect(onActionClick).toHaveBeenCalled();
  });

  it('calls handleClose when action button has closeOnClick=true', () => {
    const anchorEl = document.createElement('button');
    const handleClose = vi.fn();
    useSelectDropdownMock.mockReturnValue({ ...baseHook, isOpen: true, anchorEl, handleClose });
    render(
      <SelectDropdown
        {...defaultProps}
        actionButtons={[{ label: 'Create New', onClick: vi.fn(), closeOnClick: true }]}
      />,
    );
    fireEvent.click(screen.getByTestId('select-dropdown-action-0'));
    expect(handleClose).toHaveBeenCalled();
  });

  it('does not call handleClose when action button has closeOnClick=false', () => {
    const anchorEl = document.createElement('button');
    const handleClose = vi.fn();
    useSelectDropdownMock.mockReturnValue({ ...baseHook, isOpen: true, anchorEl, handleClose });
    render(
      <SelectDropdown
        {...defaultProps}
        actionButtons={[{ label: 'Refresh List', onClick: vi.fn(), closeOnClick: false }]}
      />,
    );
    fireEvent.click(screen.getByTestId('select-dropdown-action-0'));
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('aria-selected is true for the currently selected option', () => {
    const anchorEl = document.createElement('button');
    useSelectDropdownMock.mockReturnValue({ ...baseHook, isOpen: true, anchorEl });
    render(<SelectDropdown {...defaultProps} value="fof" />);
    expect(screen.getByTestId('select-dropdown-option-fof').getAttribute('aria-selected')).toBe(
      'true',
    );
  });

  it('aria-selected is false for non-selected options', () => {
    const anchorEl = document.createElement('button');
    useSelectDropdownMock.mockReturnValue({ ...baseHook, isOpen: true, anchorEl });
    render(<SelectDropdown {...defaultProps} value="fof" />);
    expect(screen.getByTestId('select-dropdown-option-df').getAttribute('aria-selected')).toBe(
      'false',
    );
  });
});
