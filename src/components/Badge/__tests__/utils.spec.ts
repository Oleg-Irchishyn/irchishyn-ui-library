import { createTheme } from '@mui/material/styles';
import { describe, expect, it } from 'vitest';

import { resolveFilledColors, resolveOutlinedColors } from '../utils';

describe('Badge utils', () => {
  it('resolves filled semantic colors with white text', () => {
    const theme = createTheme({ palette: { mode: 'light' } });

    const colors = resolveFilledColors(theme, 'info');

    expect(colors.backgroundColor).toBe(theme.palette.info.main);
    expect(colors.borderColor).toBe(theme.palette.info.main);
    expect(colors.textColor).toBe('#fff');
  });

  it('resolves filled custom color with white text', () => {
    const theme = createTheme({ palette: { mode: 'light' } });

    const colors = resolveFilledColors(theme, '#00A9E0');

    expect(colors.backgroundColor).toBe('#00A9E0');
    expect(colors.borderColor).toBe('#00A9E0');
    expect(colors.textColor).toBe('#fff');
  });

  it('resolves outlined semantic color in light mode', () => {
    const theme = createTheme({ palette: { mode: 'light' } });

    const colors = resolveOutlinedColors(theme, 'success');

    expect(colors.backgroundColor).toBe('transparent');
    expect(colors.borderColor).toBe(theme.palette.success.main);
    expect(colors.textColor).toBe(theme.palette.success.main);
  });

  it('resolves outlined semantic color in dark mode', () => {
    const theme = createTheme({ palette: { mode: 'dark' } });

    const colors = resolveOutlinedColors(theme, 'success');

    expect(colors.backgroundColor).toBe('transparent');
    expect(colors.borderColor).toBe(theme.palette.success.light);
    expect(colors.textColor).toBe(theme.palette.success.light);
  });

  it('resolves outlined custom color', () => {
    const theme = createTheme({ palette: { mode: 'dark' } });

    const colors = resolveOutlinedColors(theme, '#1D4ED8');

    expect(colors.backgroundColor).toBe('transparent');
    expect(colors.borderColor).toBe('#1D4ED8');
    expect(colors.textColor).toBe('#1D4ED8');
  });

  it('resolves neutral semantic color for dark mode', () => {
    const theme = createTheme({ palette: { mode: 'dark' } });

    const filled = resolveFilledColors(theme, 'neutral');
    const outlined = resolveOutlinedColors(theme, 'neutral');

    expect(filled.backgroundColor).toBe(theme.palette.grey[600]);
    expect(filled.borderColor).toBe(theme.palette.grey[600]);
    expect(filled.textColor).toBe('#fff');
    expect(outlined.borderColor).toBe(theme.palette.grey[300]);
    expect(outlined.textColor).toBe(theme.palette.grey[300]);
  });
});
