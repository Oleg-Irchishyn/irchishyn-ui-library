import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@mui/x-date-pickers/DatePicker', () => ({
  DatePicker: ({
    label,
    value,
    onChange,
    shouldDisableDate,
  }: {
    label?: string;
    value: Date | null;
    onChange: (value: Date | null) => void;
    shouldDisableDate?: (date: Date) => boolean;
  }) => (
    <input
      aria-label={label}
      data-has-disable-date={shouldDisableDate ? 'true' : 'false'}
      value={value ? 'selected' : ''}
      onChange={() => onChange(new Date('2026-04-06T00:00:00.000Z'))}
    />
  ),
}));

import { DatePickerQuickSelectPanel } from '../DatePickerQuickSelectPanel';

describe('DatePickerQuickSelectPanel', () => {
  it('renders options and triggers callbacks', () => {
    const onOpen = vi.fn();
    const onQuickOptionChange = vi.fn();
    const onClearSelection = vi.fn();

    render(
      <DatePickerQuickSelectPanel
        label="Date Range"
        disabled={false}
        required={false}
        error={false}
        clearLabel="Clear selection"
        quickSelectPlaceholder="Select date range"
        triggerLabel="Last 1 Year"
        isOpen={true}
        anchorEl={document.createElement('div')}
        selectedQuickOptionValue=""
        customRange={{ from: null, to: null }}
        quickSelectOptions={[{ value: 'last-1-year', label: 'Last 1 Year' }]}
        allowCustomRange={false}
        customFromError={null}
        customToError={null}
        onOpen={onOpen}
        onClose={vi.fn()}
        onQuickOptionChange={onQuickOptionChange}
        onCustomFromChange={vi.fn()}
        onCustomToChange={vi.fn()}
        onCustomFromError={vi.fn()}
        onCustomToError={vi.fn()}
        onClearSelection={onClearSelection}
      />,
    );

    fireEvent.click(screen.getByTestId('quick-select-date-picker-trigger'));
    expect(onOpen).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByLabelText('Last 1 Year'));
    expect(onQuickOptionChange).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('Clear selection'));
    expect(onClearSelection).toHaveBeenCalledTimes(1);
  });

  it('passes shouldDisableDate to custom range date pickers', () => {
    render(
      <DatePickerQuickSelectPanel
        label="Date Range"
        disabled={false}
        required={false}
        error={false}
        clearLabel="Clear selection"
        quickSelectPlaceholder="Select date range"
        triggerLabel="Custom"
        isOpen={true}
        anchorEl={document.createElement('div')}
        selectedQuickOptionValue=""
        customRange={{ from: null, to: null }}
        quickSelectOptions={[{ value: 'custom', label: 'Custom' }]}
        allowCustomRange={true}
        customFromError={null}
        customToError={null}
        shouldDisableDate={(date) => date.getDay() === 0 || date.getDay() === 6}
        onOpen={vi.fn()}
        onClose={vi.fn()}
        onQuickOptionChange={vi.fn()}
        onCustomFromChange={vi.fn()}
        onCustomToChange={vi.fn()}
        onCustomFromError={vi.fn()}
        onCustomToError={vi.fn()}
        onClearSelection={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('From').getAttribute('data-has-disable-date')).toBe('true');
    expect(screen.getByLabelText('To').getAttribute('data-has-disable-date')).toBe('true');
  });
});
