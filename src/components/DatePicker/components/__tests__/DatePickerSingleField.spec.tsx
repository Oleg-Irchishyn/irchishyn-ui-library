import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@mui/x-date-pickers/DatePicker', () => ({
  DatePicker: ({
    label,
    value,
    onChange,
    format,
    shouldDisableDate,
    slotProps,
  }: {
    label?: string;
    value: Date | null;
    onChange: (value: Date | null) => void;
    format?: string;
    shouldDisableDate?: (date: Date) => boolean;
    slotProps?: { textField?: { helperText?: ReactNode } };
  }) => (
    <div>
      <input
        aria-label={label}
        data-format={format}
        data-has-disable-date={shouldDisableDate ? 'true' : 'false'}
        value={value ? 'selected' : ''}
        onChange={() => onChange(new Date('2026-04-06T00:00:00.000Z'))}
      />
      {slotProps?.textField?.helperText ? <span>{slotProps.textField.helperText}</span> : null}
    </div>
  ),
}));

import { DatePickerSingleField } from '../DatePickerSingleField';

describe('DatePickerSingleField', () => {
  it('renders single field and forwards change', () => {
    const onChange = vi.fn();
    const onError = vi.fn();

    render(
      <DatePickerSingleField
        value={null}
        onChange={onChange}
        onError={onError}
        label="Notice Date"
        disabled={false}
        required={false}
        error={false}
      />,
    );

    fireEvent.change(screen.getByLabelText('Notice Date'), { target: { value: '04/06/2026' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('passes shouldDisableDate to MuiDatePicker', () => {
    const onChange = vi.fn();
    const onError = vi.fn();

    render(
      <DatePickerSingleField
        value={null}
        onChange={onChange}
        onError={onError}
        label="Notice Date"
        disabled={false}
        required={false}
        error={false}
        shouldDisableDate={(date) => date.getDay() === 0 || date.getDay() === 6}
      />,
    );

    expect(screen.getByLabelText('Notice Date').getAttribute('data-has-disable-date')).toBe('true');
  });

  it('passes custom date format to MuiDatePicker', () => {
    const onChange = vi.fn();
    const onError = vi.fn();

    render(
      <DatePickerSingleField
        value={null}
        onChange={onChange}
        onError={onError}
        label="Notice Date"
        disabled={false}
        required={false}
        error={false}
        dateFormat="dd/MM/yyyy"
      />,
    );

    expect(screen.getByLabelText('Notice Date').getAttribute('data-format')).toBe('dd/MM/yyyy');
  });
});
