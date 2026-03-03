import { describe, expect, it } from 'vitest';

import { getHistoryAuditTrailRootStyles, historyAuditTrailContentStyles } from '../styles';

describe('HistoryAuditTrail styles', () => {
  it('builds root styles with undefined external sx', () => {
    const styles = getHistoryAuditTrailRootStyles();
    expect(Array.isArray(styles)).toBe(true);
    if (Array.isArray(styles)) {
      expect(styles[0]).toEqual({ width: '100%' });
      expect(styles[1]).toBeUndefined();
    }
  });

  it('builds root styles with array external sx', () => {
    const styles = getHistoryAuditTrailRootStyles([{ p: 1 }, { m: 2 }]);
    expect(Array.isArray(styles)).toBe(true);
    if (Array.isArray(styles)) {
      expect(styles).toHaveLength(3);
    }
  });

  it('exports content styles', () => {
    expect(historyAuditTrailContentStyles).toEqual({ position: 'relative' });
  });
});
