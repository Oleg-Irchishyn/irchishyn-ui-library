import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useDateTextSelect } from '../useDateTextSelect';

describe('useDateTextSelect', () => {
  const onSelectChange = vi.fn();

  it('shows required error when date is empty and required is true', () => {
    const { result } = renderHook(() =>
      useDateTextSelect({
        dateValue: null,
        dateFormat: 'MM/dd/yyyy',
        required: true,
        onSelectChange,
      }),
    );

    expect(result.current.isDateInvalid).toBe(true);
    expect(result.current.dateHelperText).toBe('Date is required');
  });

  it('shows invalid date message when date parser reports invalid date', () => {
    const { result } = renderHook(() =>
      useDateTextSelect({
        dateValue: null,
        dateFormat: 'MM/dd/yyyy',
        required: false,
        onSelectChange,
      }),
    );

    act(() => {
      result.current.handleDateError('invalidDate');
    });

    expect(result.current.isDateInvalid).toBe(true);
    expect(result.current.dateHelperText).toBe('Enter a valid date (MM/DD/YYYY)');
  });

  it('is not invalid when date is provided and no parser error', () => {
    const { result } = renderHook(() =>
      useDateTextSelect({
        dateValue: new Date('2026-03-10T00:00:00.000Z'),
        dateFormat: 'MM/dd/yyyy',
        required: true,
        onSelectChange,
      }),
    );

    act(() => {
      result.current.handleDateError(null);
    });

    expect(result.current.isDateInvalid).toBe(false);
    expect(result.current.dateHelperText).toBeUndefined();
  });

  it('handles select value change callback', () => {
    const onSelectChangeLocal = vi.fn();
    const { result } = renderHook(() =>
      useDateTextSelect({
        dateValue: null,
        dateFormat: 'MM/dd/yyyy',
        required: false,
        onSelectChange: onSelectChangeLocal,
      }),
    );

    act(() => {
      result.current.handleSelectValueChange({
        target: { value: 'business-days' },
      } as never);
    });

    expect(onSelectChangeLocal).toHaveBeenCalledWith('business-days');
  });

  it('shows min/max range error messages', () => {
    const minDate = new Date('2026-01-01T12:00:00.000Z');
    const maxDate = new Date('2026-12-31T12:00:00.000Z');
    const { result } = renderHook(() =>
      useDateTextSelect({
        dateValue: null,
        dateFormat: 'MM/dd/yyyy',
        required: false,
        minDate,
        maxDate,
        onSelectChange,
      }),
    );

    act(() => {
      result.current.handleDateError('minDate');
    });
    expect(result.current.dateHelperText).toContain('01/01/2026');

    act(() => {
      result.current.handleDateError('maxDate');
    });
    expect(result.current.dateHelperText).toContain('12/31/2026');
  });
});
