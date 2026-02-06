import React, { useMemo } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import createAppTheme from '../theme';

export interface Gen2ThemeProviderProps {
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

export function Gen2ThemeProvider({
  children,
  mode = 'light',
  theme,
  cssBaseline = true,
}: Gen2ThemeProviderProps) {
  const resolvedTheme = useMemo(() => theme ?? createAppTheme(mode), [theme, mode]);

  return (
    <ThemeProvider theme={resolvedTheme}>
      {cssBaseline ? <CssBaseline /> : null}
      {children}
    </ThemeProvider>
  );
}
