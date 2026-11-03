import { common } from '../../../tokens';
import { describe, expect, it } from 'vitest';

import { loadingSpinnerSize, primaryButtonSx } from '../styles';

describe('ActionButton styles', () => {
  it('primaryButtonSx uses common.white from platform.style', () => {
    expect(primaryButtonSx).toMatchObject({ color: common.white });
  });

  describe('loadingSpinnerSize', () => {
    it('returns 14 for small', () => {
      expect(loadingSpinnerSize.small).toBe(14);
    });

    it('returns 16 for medium', () => {
      expect(loadingSpinnerSize.medium).toBe(16);
    });

    it('returns 18 for large', () => {
      expect(loadingSpinnerSize.large).toBe(18);
    });
  });
});
