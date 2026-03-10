import { createTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { describe, expect, it } from 'vitest';

import { getOutputFormatOptionIconStyles } from '../OutputFormatSection.styles';

describe('OutputFormatSection.styles', () => {
  it('uses palette color key when iconColor matches theme palette', () => {
    const theme = createTheme();
    const styles = getOutputFormatOptionIconStyles('error');
    const resolved = (styles as (theme: Theme) => Record<string, unknown>)(theme);

    expect(resolved.backgroundColor).toContain('rgba');
  });

  it('uses raw css color when iconColor is custom color value', () => {
    const theme = createTheme();
    const styles = getOutputFormatOptionIconStyles('#123456');
    const resolved = (styles as (theme: Theme) => Record<string, unknown>)(theme);

    expect(resolved.backgroundColor).toContain('rgba');
  });

  it('uses neutral fallback when iconColor is not provided', () => {
    const lightTheme = createTheme({ palette: { mode: 'light' } });
    const darkTheme = createTheme({ palette: { mode: 'dark' } });
    const styles = getOutputFormatOptionIconStyles();

    const lightResolved = (styles as (theme: Theme) => Record<string, unknown>)(lightTheme);
    const darkResolved = (styles as (theme: Theme) => Record<string, unknown>)(darkTheme);

    expect(lightResolved.backgroundColor).toBe(lightTheme.palette.action.selected);
    expect(darkResolved.backgroundColor).toBe(darkTheme.palette.action.hover);
  });
});
