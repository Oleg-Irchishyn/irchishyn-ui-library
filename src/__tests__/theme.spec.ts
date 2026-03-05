import { afterEach, describe, expect, it, vi } from 'vitest';

const loadThemeModule = async () => import('../theme');

afterEach(() => {
  vi.resetModules();
  vi.unmock('@gen2fund/platform.style');
});

describe('createAppTheme', () => {
  it('creates a light theme by default', async () => {
    const { createAppTheme } = await loadThemeModule();
    const theme = createAppTheme();

    expect(theme.palette.mode).toBe('light');
    expect((theme.typography.fontFamily ?? '').length).toBeGreaterThan(0);
    expect(theme.shape.borderRadius).toBe(4);
  });

  it('creates a dark theme when requested', async () => {
    const { createAppTheme } = await loadThemeModule();
    const theme = createAppTheme('dark');

    expect(theme.palette.mode).toBe('dark');
    expect(theme.palette.background.default).toBeTruthy();
    expect(theme.palette.text.primary).toBeTruthy();
  });

  it('falls back to default values when platform tokens are missing', async () => {
    vi.doMock('@gen2fund/platform.style', () => ({
      lightMode: {},
      darkMode: {},
      primary: {},
      secondary: {},
      neutral: {},
      colors: {},
      fontFamily: {},
    }));

    const { createAppTheme } = await loadThemeModule();
    const lightTheme = createAppTheme('light');
    const darkTheme = createAppTheme('dark');

    expect(lightTheme.palette.primary.main).toBe('#00A9E0');
    expect(lightTheme.palette.background.default).toBe('#fafafa');
    expect(lightTheme.palette.text.primary).toBe('#212121');

    expect(darkTheme.palette.background.default).toBe('#121212');
    expect(darkTheme.palette.text.primary).toBe('#ffffff');
    expect(darkTheme.palette.action.hover).toBe('rgba(255,255,255,0.08)');
  });
});
