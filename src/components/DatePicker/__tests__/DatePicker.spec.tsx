import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@mui/x-date-pickers/LocalizationProvider', () => ({
  LocalizationProvider: ({ children }: { children: ReactNode }) => children,
}));

vi.mock('@mui/x-date-pickers/AdapterDateFns', () => ({
  AdapterDateFns: class AdapterDateFns {},
}));

vi.mock('@mui/x-date-pickers/DatePicker', () => ({
  DatePicker: ({
    label,
    value,
    onChange,
  }: {
    label?: string;
    value: Date | null;
    onChange: (value: Date | null) => void;
  }) => (
    <input
      aria-label={label}
      value={value ? 'selected' : ''}
      onChange={() => {
        onChange(new Date('2026-04-06T00:00:00.000Z'));
      }}
    />
  ),
}));

vi.mock('@mui/x-date-pickers/DateCalendar', () => ({
  DateCalendar: () => <div data-testid="mock-date-calendar" />,
}));

import { DATE_PICKER_VARIANTS, QUICK_SELECT_PRESET_VALUES } from '../constants';
import { DatePicker } from '../DatePicker';
import type { QuickSelectOption } from '../types';

const quickSelectOptions: QuickSelectOption[] = [
  {
    value: QUICK_SELECT_PRESET_VALUES.LAST_1_MONTH,
    label: 'Last 1 Month',
    getRange: () => ({
      from: new Date('2026-02-01T00:00:00.000Z'),
      to: new Date('2026-03-01T00:00:00.000Z'),
    }),
  },
  {
    value: QUICK_SELECT_PRESET_VALUES.LAST_1_YEAR,
    label: 'Last 1 Year',
    getRange: () => ({
      from: new Date('2025-03-01T00:00:00.000Z'),
      to: new Date('2026-03-01T00:00:00.000Z'),
    }),
  },
];

describe('DatePicker', () => {
  it('renders single date picker input', () => {
    render(
      <DatePicker
        variant={DATE_PICKER_VARIANTS.SINGLE}
        value={new Date('2026-04-06T00:00:00.000Z')}
        onChange={() => {}}
        label="Notice Date"
      />,
    );

    expect(screen.getByLabelText('Notice Date')).toBeTruthy();
  });

  it('renders quick select panel and handles option selection', () => {
    const onChange = vi.fn();

    render(
      <DatePicker
        variant={DATE_PICKER_VARIANTS.QUICK_SELECT}
        value={null}
        onChange={onChange}
        quickSelectOptions={quickSelectOptions}
        label="Date Range"
      />,
    );

    fireEvent.click(screen.getByLabelText('Date Range'));
    expect(screen.getByText('Quick Select')).toBeTruthy();

    fireEvent.click(screen.getByLabelText('Last 1 Year'));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('handles clear selection', () => {
    const onChange = vi.fn();

    render(
      <DatePicker
        variant={DATE_PICKER_VARIANTS.QUICK_SELECT}
        value={{
          value: QUICK_SELECT_PRESET_VALUES.LAST_1_YEAR,
          label: 'Last 1 Year',
        }}
        onChange={onChange}
        quickSelectOptions={quickSelectOptions}
        label="Date Range"
      />,
    );

    fireEvent.click(screen.getByLabelText('Date Range'));
    fireEvent.click(screen.getByText('Clear selection'));

    expect(onChange).toHaveBeenCalledWith(null, null);
  });

  it('handles custom range from/to changes', () => {
    const onChange = vi.fn();

    render(
      <DatePicker
        variant={DATE_PICKER_VARIANTS.QUICK_SELECT}
        value={null}
        onChange={onChange}
        quickSelectOptions={quickSelectOptions}
        label="Date Range"
      />,
    );

    fireEvent.click(screen.getByLabelText('Date Range'));
    fireEvent.change(screen.getByLabelText('From'), { target: { value: '04/01/2026' } });
    fireEvent.change(screen.getByLabelText('To'), { target: { value: '04/06/2026' } });

    expect(onChange).toHaveBeenCalled();
  });

  it('hides custom range section when allowCustomRange is false', () => {
    render(
      <DatePicker
        variant={DATE_PICKER_VARIANTS.QUICK_SELECT}
        value={null}
        onChange={() => {}}
        quickSelectOptions={quickSelectOptions}
        allowCustomRange={false}
        label="Date Range"
      />,
    );

    fireEvent.click(screen.getByLabelText('Date Range'));
    expect(screen.queryByLabelText('From')).toBeNull();
    expect(screen.queryByLabelText('To')).toBeNull();
  });

  it('renders default quick select options when custom options are not provided', () => {
    render(
      <DatePicker
        variant={DATE_PICKER_VARIANTS.QUICK_SELECT}
        value={null}
        onChange={() => {}}
        label="Date Range"
      />,
    );

    fireEvent.click(screen.getByLabelText('Date Range'));

    expect(screen.getByLabelText('Last 1 Month')).toBeTruthy();
    expect(screen.getByLabelText('Last 3 Months')).toBeTruthy();
    expect(screen.getByLabelText('Last 1 Year')).toBeTruthy();
    expect(screen.getByLabelText('All Time')).toBeTruthy();
  });

  it('updates trigger label on selection and resets to placeholder after clear in controlled mode', () => {
    const ControlledQuickSelect = () => {
      const [value, setValue] = useState<
        QuickSelectOption | { from: Date | null; to: Date | null } | null
      >(null);

      return (
        <DatePicker
          variant={DATE_PICKER_VARIANTS.QUICK_SELECT}
          label="Date Range"
          value={value}
          quickSelectOptions={quickSelectOptions}
          onChange={(_resolvedRange, nextValue) => {
            setValue(nextValue);
          }}
        />
      );
    };

    render(<ControlledQuickSelect />);

    const trigger = screen.getByLabelText('Date Range');
    fireEvent.click(trigger);
    fireEvent.click(screen.getByLabelText('Last 1 Year'));

    expect(screen.getByDisplayValue('Last 1 Year')).toBeTruthy();

    fireEvent.click(screen.getByText('Clear selection'));
    expect(screen.getByPlaceholderText('Select date range')).toBeTruthy();
  });

  it('renders in dark theme', () => {
    const darkTheme = createTheme({ palette: { mode: 'dark' } });

    render(
      <ThemeProvider theme={darkTheme}>
        <DatePicker
          variant={DATE_PICKER_VARIANTS.QUICK_SELECT}
          value={null}
          onChange={() => {}}
          quickSelectOptions={quickSelectOptions}
          label="Date Range"
        />
      </ThemeProvider>,
    );

    expect(screen.getByLabelText('Date Range')).toBeTruthy();
  });

  it('renders single variant in dark theme', () => {
    const darkTheme = createTheme({ palette: { mode: 'dark' } });

    render(
      <ThemeProvider theme={darkTheme}>
        <DatePicker
          variant={DATE_PICKER_VARIANTS.SINGLE}
          value={new Date('2026-04-06T00:00:00.000Z')}
          onChange={() => {}}
          label="Notice Date"
        />
      </ThemeProvider>,
    );

    expect(screen.getByLabelText('Notice Date')).toBeTruthy();
  });
});
