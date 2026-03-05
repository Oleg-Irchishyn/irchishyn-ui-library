import { createTheme } from '@mui/material/styles';
import { describe, expect, it } from 'vitest';

import { getAlertStyles } from '../styles';

type ResolvedAlertStyles = {
  backgroundColor?: string;
  borderColor?: string;
  color?: string;
  alignItems?: string;
  '& .MuiAlert-icon'?: {
    paddingTop?: number;
  };
  '& .MuiAlert-message'?: {
    flexDirection?: string;
  };
  '& .MuiAlert-action'?: {
    alignSelf?: string;
  };
};

const resolveAlertStyles = (
  severity: 'success' | 'warning' | 'info',
  variant: 'filled' | 'outlined' | 'standard',
  hasTitle: boolean,
) => {
  const theme = createTheme();
  const styles = getAlertStyles({ severity, variant, hasTitle });

  return (typeof styles === 'function' ? styles(theme) : styles) as ResolvedAlertStyles;
};

describe('getAlertStyles', () => {
  it('returns filled styles with severity background colors', () => {
    const theme = createTheme({ palette: { mode: 'light' } });
    const styles = getAlertStyles({ severity: 'success', variant: 'filled', hasTitle: false });
    const resolved = (typeof styles === 'function' ? styles(theme) : styles) as ResolvedAlertStyles;

    expect(resolved.backgroundColor).toBe(theme.palette.success.main);
    expect(resolved.borderColor).toBe(theme.palette.success.main);
    expect(resolved.color).toBe(theme.palette.success.contrastText);
    expect(resolved.alignItems).toBe('center');
  });

  it('returns outlined styles using severity tone color', () => {
    const theme = createTheme({ palette: { mode: 'dark' } });
    const styles = getAlertStyles({ severity: 'warning', variant: 'outlined', hasTitle: false });
    const resolved = (typeof styles === 'function' ? styles(theme) : styles) as ResolvedAlertStyles;

    expect(resolved.backgroundColor).toBe('transparent');
    expect(resolved.borderColor).toBe(theme.palette.warning.light);
    expect(resolved.color).toBe(theme.palette.warning.light);
  });

  it('applies title-specific alignment and spacing overrides', () => {
    const resolved = resolveAlertStyles('info', 'standard', true);

    expect(resolved.alignItems).toBe('flex-start');
    expect(resolved['& .MuiAlert-icon']?.paddingTop).toBe(0.25);
    expect(resolved['& .MuiAlert-message']?.flexDirection).toBe('column');
    expect(resolved['& .MuiAlert-action']?.alignSelf).toBe('flex-start');
  });
});
