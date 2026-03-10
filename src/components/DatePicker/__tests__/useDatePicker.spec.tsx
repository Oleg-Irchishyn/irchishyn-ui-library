import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { QUICK_SELECT_PRESET_VALUES } from '../constants';
import { useQuickSelectDatePicker } from '../useDatePicker';
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

const selectedLastMonthOption: QuickSelectOption = {
  value: QUICK_SELECT_PRESET_VALUES.LAST_1_MONTH,
  label: 'Last 1 Month',
};

describe('useQuickSelectDatePicker', () => {
  it('initializes from explicit custom date range value', () => {
    const onChange = vi.fn();
    const customValue = {
      from: new Date('2026-01-01T00:00:00.000Z'),
      to: new Date('2026-01-15T00:00:00.000Z'),
    };

    const { result } = renderHook(() =>
      useQuickSelectDatePicker({
        value: customValue,
        onChange,
        quickSelectOptions,
        allowCustomRange: true,
      }),
    );

    expect(result.current.selectedQuickOptionValue).toBe('');
    expect(result.current.customRange).toEqual(customValue);
  });

  it('selects quick option and emits resolved range', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useQuickSelectDatePicker({
        value: null,
        onChange,
        quickSelectOptions,
        allowCustomRange: true,
      }),
    );

    act(() => {
      result.current.handleQuickOptionSelect(QUICK_SELECT_PRESET_VALUES.LAST_1_YEAR);
    });

    expect(result.current.selectedQuickOptionValue).toBe(QUICK_SELECT_PRESET_VALUES.LAST_1_YEAR);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0]?.[0]).toEqual({
      from: new Date('2025-03-01T00:00:00.000Z'),
      to: new Date('2026-03-01T00:00:00.000Z'),
    });
  });

  it('emits custom range only when both dates are valid', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useQuickSelectDatePicker({
        value: null,
        onChange,
        quickSelectOptions,
        allowCustomRange: true,
      }),
    );

    act(() => {
      result.current.handleCustomDateChange('from', new Date('2026-01-01T00:00:00.000Z'));
    });
    expect(onChange).toHaveBeenCalledTimes(0);

    act(() => {
      result.current.handleCustomDateChange('to', new Date('2026-01-15T00:00:00.000Z'));
    });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('clears selection', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useQuickSelectDatePicker({
        // Keep object reference stable to avoid rerender loops in tests.
        value: selectedLastMonthOption,
        onChange,
        quickSelectOptions,
        allowCustomRange: true,
      }),
    );

    act(() => {
      result.current.handleClearSelection();
    });

    expect(result.current.selectedQuickOptionValue).toBe('');
    expect(onChange).toHaveBeenCalledWith(null, null);
  });

  it('does not emit when quick option is unknown', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useQuickSelectDatePicker({
        value: null,
        onChange,
        quickSelectOptions,
        allowCustomRange: true,
      }),
    );

    act(() => {
      result.current.handleQuickOptionSelect('missing-option');
    });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('opens and closes popover state', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useQuickSelectDatePicker({
        value: null,
        onChange,
        quickSelectOptions,
        allowCustomRange: true,
      }),
    );

    const anchor = document.createElement('div');

    act(() => {
      result.current.handleOpen({ currentTarget: anchor } as never);
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.handleClose();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('ignores custom range edits when allowCustomRange is false', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useQuickSelectDatePicker({
        value: null,
        onChange,
        quickSelectOptions,
        allowCustomRange: false,
      }),
    );

    act(() => {
      result.current.handleCustomDateChange('from', new Date('2026-01-01T00:00:00.000Z'));
    });

    expect(result.current.customRange).toEqual({ from: null, to: null });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('supports callback wrappers for quick option and custom from/to', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useQuickSelectDatePicker({
        value: null,
        onChange,
        quickSelectOptions,
        allowCustomRange: true,
      }),
    );

    act(() => {
      result.current.handleQuickOptionChange({
        target: { value: QUICK_SELECT_PRESET_VALUES.LAST_1_MONTH },
      } as never);
    });
    expect(onChange).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.handleCustomFromChange(new Date('2026-01-01T00:00:00.000Z'));
    });
    act(() => {
      result.current.handleCustomToChange(new Date('2026-01-10T00:00:00.000Z'));
    });
    expect(onChange).toHaveBeenCalledTimes(3);
  });

  it('stores custom from/to validation errors via callbacks', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useQuickSelectDatePicker({
        value: null,
        onChange,
        quickSelectOptions,
        allowCustomRange: true,
      }),
    );

    act(() => {
      result.current.handleCustomFromError('minDate');
      result.current.handleCustomToError('maxDate');
    });

    expect(result.current.customFromError).toBe('minDate');
    expect(result.current.customToError).toBe('maxDate');
  });
});
