import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
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
    value,
    onChange,
    format,
    shouldDisableDate,
    slotProps,
  }: {
    value: Date | null;
    onChange: (value: Date | null) => void;
    format?: string;
    shouldDisableDate?: (date: Date) => boolean;
    slotProps?: {
      textField?: {
        error?: boolean;
        helperText?: ReactNode;
        onBlur?: () => void;
      };
    };
  }) => (
    <div>
      <input
        aria-label="Date text input"
        data-format={format}
        data-has-disable-date={shouldDisableDate ? 'true' : 'false'}
        data-error={slotProps?.textField?.error ? 'true' : 'false'}
        value={value ? 'selected' : ''}
        onBlur={slotProps?.textField?.onBlur}
        onChange={() => onChange(new Date('2026-04-06T00:00:00.000Z'))}
      />
      {slotProps?.textField?.helperText ? <span>{slotProps.textField.helperText}</span> : null}
    </div>
  ),
}));

import { DateTextSelect } from '../DateTextSelect';

const options = [
  { value: 'business-days', label: 'Business Days' },
  { value: 'calendar-days', label: 'Calendar Days' },
];

describe('DateTextSelect', () => {
  it('renders date input and select in one component', () => {
    render(
      <DateTextSelect
        label="Due Date Type"
        dateValue={null}
        onDateChange={() => {}}
        selectValue=""
        selectOptions={options}
        onSelectChange={() => {}}
      />,
    );

    expect(screen.getByText('Due Date Type')).toBeTruthy();
    expect(screen.getByLabelText('Date text input')).toBeTruthy();
    expect(screen.getByLabelText('Date text select dropdown')).toBeTruthy();
  });

  it('fires onDateChange when date input changes', () => {
    const onDateChange = vi.fn();
    render(
      <DateTextSelect
        label="Due Date Type"
        dateValue={null}
        onDateChange={onDateChange}
        selectValue=""
        selectOptions={options}
        onSelectChange={() => {}}
      />,
    );

    fireEvent.change(screen.getByLabelText('Date text input'), { target: { value: '04/06/2026' } });
    expect(onDateChange).toHaveBeenCalledTimes(1);
  });

  it('fires onSelectChange when select option changes', () => {
    const onSelectChange = vi.fn();
    render(
      <DateTextSelect
        label="Due Date Type"
        dateValue={null}
        onDateChange={() => {}}
        selectValue=""
        selectOptions={options}
        onSelectChange={onSelectChange}
      />,
    );

    fireEvent.mouseDown(screen.getByLabelText('Date text select dropdown'));
    fireEvent.click(screen.getByText('Business Days'));

    expect(onSelectChange).toHaveBeenCalledWith('business-days');
  });

  it('passes shouldDisableDate to DatePicker', () => {
    render(
      <DateTextSelect
        label="Due Date Type"
        dateValue={null}
        onDateChange={() => {}}
        selectValue=""
        selectOptions={options}
        onSelectChange={() => {}}
        shouldDisableDate={(date) => date.getDay() === 0 || date.getDay() === 6}
      />,
    );

    expect(screen.getByLabelText('Date text input').getAttribute('data-has-disable-date')).toBe(
      'true',
    );
  });

  it('passes custom date format to DatePicker', () => {
    render(
      <DateTextSelect
        label="Due Date Type"
        dateValue={null}
        onDateChange={() => {}}
        dateFormat="dd/MM/yyyy"
        selectValue=""
        selectOptions={options}
        onSelectChange={() => {}}
      />,
    );

    expect(screen.getByLabelText('Date text input').getAttribute('data-format')).toBe('dd/MM/yyyy');
  });

  it('shows required validation message when required is true and date is empty', () => {
    render(
      <DateTextSelect
        label="Due Date Type"
        dateValue={null}
        onDateChange={() => {}}
        selectValue=""
        selectOptions={options}
        onSelectChange={() => {}}
        required
      />,
    );

    expect(screen.getByText('Date is required')).toBeTruthy();
    expect(screen.getByLabelText('Date text input').getAttribute('data-error')).toBe('true');
  });

  it('renders in dark theme', () => {
    const darkTheme = createTheme({ palette: { mode: 'dark' } });
    render(
      <ThemeProvider theme={darkTheme}>
        <DateTextSelect
          label="Due Date Type"
          dateValue={null}
          onDateChange={() => {}}
          selectValue=""
          selectOptions={options}
          onSelectChange={() => {}}
        />
      </ThemeProvider>,
    );

    expect(screen.getByText('Due Date Type')).toBeTruthy();
    expect(screen.getByLabelText('Date text input')).toBeTruthy();
  });
});
