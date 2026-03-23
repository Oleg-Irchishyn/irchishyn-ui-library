import { describe, expect, it } from 'vitest';

import { filterOptions, getTriggerLabel } from '../utils';
import type { MultiSelectOption } from '../types';

const options: MultiSelectOption[] = [
  { label: 'Acme Corp', value: 'acme' },
  { label: 'Omega Fund', value: 'omega' },
  { label: 'Zenith Partners', value: 'zenith' },
];

describe('getTriggerLabel', () => {
  it('returns placeholder when nothing is selected', () => {
    expect(getTriggerLabel([], options, 'All Sponsors', 2)).toBe('All Sponsors');
  });

  it('returns placeholder when all options are selected', () => {
    expect(getTriggerLabel(['acme', 'omega', 'zenith'], options, 'All Sponsors', 2)).toBe(
      'All Sponsors',
    );
  });

  it('returns single name when 1 option selected and maxDisplayNames=1', () => {
    expect(getTriggerLabel(['acme'], options, 'All Sponsors', 1)).toBe('Acme Corp');
  });

  it('returns comma-joined names when selection count is within maxDisplayNames', () => {
    expect(getTriggerLabel(['acme', 'omega'], options, 'All Sponsors', 2)).toBe(
      'Acme Corp, Omega Fund',
    );
  });

  it('returns count label when selection exceeds maxDisplayNames', () => {
    const twoOfThree = getTriggerLabel(['acme', 'omega'], options, 'All', 1);
    expect(twoOfThree).toBe('2 Selected');
  });

  it('uses the default placeholder when none is provided', () => {
    expect(getTriggerLabel([], options)).toBe('All');
  });

  it('falls back to value when option label is not found', () => {
    expect(getTriggerLabel(['unknown'], options, 'All', 2)).toBe('unknown');
  });
});

describe('filterOptions', () => {
  it('returns all options when search text is empty', () => {
    expect(filterOptions(options, '')).toEqual(options);
  });

  it('returns all options when search text is only whitespace', () => {
    expect(filterOptions(options, '   ')).toEqual(options);
  });

  it('filters options case-insensitively', () => {
    expect(filterOptions(options, 'acme')).toEqual([{ label: 'Acme Corp', value: 'acme' }]);
    expect(filterOptions(options, 'ACME')).toEqual([{ label: 'Acme Corp', value: 'acme' }]);
  });

  it('returns empty array when no options match', () => {
    expect(filterOptions(options, 'xyz')).toEqual([]);
  });

  it('performs substring match', () => {
    expect(filterOptions(options, 'Fund')).toEqual([{ label: 'Omega Fund', value: 'omega' }]);
  });

  it('returns multiple matches', () => {
    const result = filterOptions(options, 'Corp');
    expect(result).toHaveLength(1);
    const multiResult = filterOptions(options, 'a');
    expect(multiResult).toHaveLength(3); // Acme Corp, Omega Fund, Zenith Partners all contain 'a'
  });
});
