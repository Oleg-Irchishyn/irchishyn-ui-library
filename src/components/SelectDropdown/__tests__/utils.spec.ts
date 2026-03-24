import { describe, expect, it } from 'vitest';

import { filterSelectOptions } from '../utils';

const options = [
  { label: 'Fund of Funds', value: 'fof' },
  { label: 'Direct Fund', value: 'df' },
  { label: 'Venture Capital', value: 'vc' },
];

describe('filterSelectOptions', () => {
  it('returns all options when searchText is empty', () => {
    expect(filterSelectOptions(options, '')).toEqual(options);
  });

  it('returns all options when searchText is whitespace only', () => {
    expect(filterSelectOptions(options, '   ')).toEqual(options);
  });

  it('filters options by label substring', () => {
    const result = filterSelectOptions(options, 'fund');
    expect(result).toHaveLength(2);
    expect(result.map((o) => o.value)).toEqual(['fof', 'df']);
  });

  it('filtering is case-insensitive', () => {
    expect(filterSelectOptions(options, 'VENTURE')).toHaveLength(1);
    expect(filterSelectOptions(options, 'venture')).toHaveLength(1);
    expect(filterSelectOptions(options, 'Venture')).toHaveLength(1);
  });

  it('trims whitespace before filtering', () => {
    const result = filterSelectOptions(options, '  direct  ');
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe('df');
  });

  it('returns empty array when no options match', () => {
    expect(filterSelectOptions(options, 'nonexistent')).toHaveLength(0);
  });

  it('returns empty array for empty options list', () => {
    expect(filterSelectOptions([], 'fund')).toHaveLength(0);
  });

  it('preserves badgeLabel and badgeColor on matched options', () => {
    const withBadge = [
      { label: 'Fund of Funds', value: 'fof', badgeLabel: 'System', badgeColor: 'info' as const },
    ];
    const result = filterSelectOptions(withBadge, 'fund');
    expect(result[0].badgeLabel).toBe('System');
    expect(result[0].badgeColor).toBe('info');
  });
});
