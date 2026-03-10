import { describe, expect, it } from 'vitest';

import { QUICK_SELECT_PRESET_VALUES } from '../constants';
import {
  getDefaultQuickSelectOptions,
  getQuickSelectTriggerLabel,
  isDateRange,
  isQuickSelectOption,
  isValidDateRange,
  resolveQuickSelectOptionRange,
} from '../utils';

describe('DatePicker utils', () => {
  it('recognizes quick select options', () => {
    expect(isQuickSelectOption({ value: 'last-1-year', label: 'Last 1 Year' })).toBe(true);
    expect(isQuickSelectOption({ value: 'missing-label' })).toBe(false);
  });

  it('recognizes date ranges', () => {
    expect(isDateRange({ from: new Date(), to: new Date() })).toBe(true);
    expect(isDateRange({ from: new Date() })).toBe(false);
    expect(isDateRange(null)).toBe(false);
  });

  it('validates complete date ranges', () => {
    const from = new Date('2026-01-01T00:00:00.000Z');
    const to = new Date('2026-01-31T00:00:00.000Z');
    expect(isValidDateRange({ from, to })).toBe(true);
    expect(isValidDateRange({ from: to, to: from })).toBe(false);
  });

  it('resolves default quick select ranges', () => {
    const referenceDate = new Date('2026-03-09T00:00:00.000Z');
    const options = getDefaultQuickSelectOptions();
    const lastYear = options.find(
      (option) => option.value === QUICK_SELECT_PRESET_VALUES.LAST_1_YEAR,
    );
    const lastThreeMonths = options.find(
      (option) => option.value === QUICK_SELECT_PRESET_VALUES.LAST_3_MONTHS,
    );
    const allTime = options.find((option) => option.value === QUICK_SELECT_PRESET_VALUES.ALL_TIME);

    expect(lastYear).toBeTruthy();
    expect(lastThreeMonths).toBeTruthy();
    expect(allTime).toBeTruthy();
    const range = resolveQuickSelectOptionRange(lastYear!, referenceDate);
    expect(range.from).toBeTruthy();
    expect(range.to).toBeTruthy();

    const threeMonthsRange = resolveQuickSelectOptionRange(lastThreeMonths!, referenceDate);
    expect(threeMonthsRange.from).toBeTruthy();
    expect(threeMonthsRange.to).toBeTruthy();

    const allTimeRange = resolveQuickSelectOptionRange(allTime!, referenceDate);
    expect(allTimeRange.from?.getFullYear()).toBe(1990);
    expect(allTimeRange.to).toBeTruthy();
  });

  it('builds trigger labels for option and custom range', () => {
    const optionLabel = getQuickSelectTriggerLabel(
      { value: QUICK_SELECT_PRESET_VALUES.ALL_TIME, label: 'All Time' },
      'Select date range',
    );
    expect(optionLabel).toBe('All Time');

    const rangeLabel = getQuickSelectTriggerLabel(
      {
        from: new Date('2026-01-01T00:00:00.000Z'),
        to: new Date('2026-01-31T00:00:00.000Z'),
      },
      'Select date range',
    );
    expect(rangeLabel).toContain('01/01/2026');
    expect(rangeLabel).toContain('01/31/2026');
  });

  it('resolves range fallback when quick option has no range helpers', () => {
    const referenceDate = new Date('2026-03-09T00:00:00.000Z');
    const range = resolveQuickSelectOptionRange(
      {
        value: 'custom',
        label: 'Custom',
      },
      referenceDate,
    );

    expect(range.from).toBeTruthy();
    expect(range.to).toBeTruthy();
  });

  it('returns placeholder for invalid range value', () => {
    const label = getQuickSelectTriggerLabel(
      {
        from: new Date('2026-02-01T00:00:00.000Z'),
        to: null,
      },
      'Select date range',
    );

    expect(label).toBe('Select date range');
  });
});
