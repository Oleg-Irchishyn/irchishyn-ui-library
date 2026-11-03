import React, { useMemo } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import createAppTheme from '../theme';

export interface IrchishynThemeProviderProps {
  children: React.ReactNode;
  mode?: 'light' | 'dark';
  /**
   * Optional explicit theme override. If provided, `mode` is ignored.
   */
  theme?: Theme;
  /**
   * Whether to inject MUI CssBaseline. Defaults to true.
   */
  cssBaseline?: boolean;
}

export function IrchishynThemeProvider({
  children,
  mode = 'light',
  theme,
  cssBaseline = true,
}: IrchishynThemeProviderProps) {
  const resolvedTheme = useMemo(() => theme ?? createAppTheme(mode), [theme, mode]);

  return (
    <ThemeProvider theme={resolvedTheme}>
      {cssBaseline ? <CssBaseline /> : null}
      {children}
    </ThemeProvider>
  );
}
