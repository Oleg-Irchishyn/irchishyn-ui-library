import { describe, expect, it } from 'vitest';

import { createAppTheme } from '../theme';

describe('createAppTheme', () => {
  it('creates a light theme by default', () => {
    const theme = createAppTheme();

    expect(theme.palette.mode).toBe('light');
    expect((theme.typography.fontFamily ?? '').length).toBeGreaterThan(0);
    expect(theme.shape.borderRadius).toBe(4);
  });

  it('creates a dark theme when requested', () => {
    const theme = createAppTheme('dark');

    expect(theme.palette.mode).toBe('dark');
    expect(theme.palette.background.default).toBeTruthy();
    expect(theme.palette.text.primary).toBeTruthy();
  });
});
