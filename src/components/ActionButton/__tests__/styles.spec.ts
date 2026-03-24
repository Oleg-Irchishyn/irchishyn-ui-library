import { common } from '@gen2fund/platform.style';
import { describe, expect, it } from 'vitest';

import { primaryButtonSx } from '../styles';

describe('ActionButton styles', () => {
  it('primaryButtonSx uses common.white from platform.style', () => {
    expect(primaryButtonSx).toMatchObject({ color: common.white });
  });
});
