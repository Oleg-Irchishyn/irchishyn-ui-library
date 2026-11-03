/**
 * MUI Theme configuration using MUI-derived tokens (src/tokens.ts)
 * This creates proper MUI themes that respond to light/dark mode from the container
 */
import { createTheme, Theme } from '@mui/material/styles';
import {
  lightMode,
  darkMode,
  primary,
  secondary,
  neutral,
  colors,
  fontFamily,
} from './tokens';

function safeGet<T>(obj: unknown, path: string): T | undefined;
function safeGet<T>(obj: unknown, path: string, defaultValue: T): T;
function safeGet<T>(obj: unknown, path: string, defaultValue?: T): T | undefined {
  if (obj === null || obj === undefined) return defaultValue;

  const keys = path.split('.');
  let result: unknown = obj;

  for (const key of keys) {
    if (result === null || result === undefined) return defaultValue;
    if (typeof result !== 'object') return defaultValue;
    result = (result as Record<string, unknown>)[key];
  }

  return result !== undefined ? (result as T) : defaultValue;
}

/**
 * Creates a MUI theme based on the mode (light/dark)
 * @param mode - 'light' or 'dark'
 * @returns MUI Theme object
 */

export const createAppTheme = (mode: 'light' | 'dark' = 'light'): Theme => {
  const isDark = mode === 'dark';
  const platformTheme = isDark ? darkMode : lightMode;

  return createTheme({
    palette: {
      mode,
      primary: {
        main: safeGet(platformTheme, 'primary.main') || safeGet(primary, 'main', '#00A9E0'),
        light: safeGet(platformTheme, 'primary.light') || safeGet(primary, 'light', '#53D5FF'),
        dark: safeGet(platformTheme, 'primary.dark') || safeGet(primary, 'dark', '#007BB5'),
        contrastText:
          safeGet(platformTheme, 'primary.contrastText') ||
          safeGet(primary, 'contrastText', '#ffffff'),
      },
      secondary: {
        main: safeGet(platformTheme, 'secondary.main') || safeGet(secondary, 'main', '#1DC9FF'),
        light: safeGet(platformTheme, 'secondary.light') || safeGet(secondary, 'light', '#8DE3FF'),
        dark: safeGet(platformTheme, 'secondary.dark') || safeGet(secondary, 'dark', '#00A9E0'),
        contrastText:
          safeGet(platformTheme, 'secondary.contrastText') ||
          safeGet(secondary, 'contrastText', '#ffffff'),
      },
      error: {
        main: safeGet(platformTheme, 'error.main') || safeGet(colors, 'error.main', '#f44336'),
        light: safeGet(platformTheme, 'error.light') || safeGet(colors, 'error.light', '#e57373'),
        dark: safeGet(platformTheme, 'error.dark') || safeGet(colors, 'error.dark', '#d32f2f'),
      },
      warning: {
        main: safeGet(platformTheme, 'warning.main') || safeGet(colors, 'warning.main', '#ff9800'),
        light:
          safeGet(platformTheme, 'warning.light') || safeGet(colors, 'warning.light', '#ffb74d'),
        dark: safeGet(platformTheme, 'warning.dark') || safeGet(colors, 'warning.dark', '#f57c00'),
      },
      info: {
        main: safeGet(platformTheme, 'info.main') || safeGet(colors, 'info.main', '#2196f3'),
        light: safeGet(platformTheme, 'info.light') || safeGet(colors, 'info.light', '#64b5f6'),
        dark: safeGet(platformTheme, 'info.dark') || safeGet(colors, 'info.dark', '#1976d2'),
      },
      success: {
        main: safeGet(platformTheme, 'success.main') || safeGet(colors, 'success.main', '#4caf50'),
        light:
          safeGet(platformTheme, 'success.light') || safeGet(colors, 'success.light', '#81c784'),
        dark: safeGet(platformTheme, 'success.dark') || safeGet(colors, 'success.dark', '#388e3c'),
      },
      background: {
        default: safeGet(platformTheme, 'background.default') || (isDark ? '#121212' : '#fafafa'),
        paper: safeGet(platformTheme, 'background.paper') || (isDark ? '#1e1e1e' : '#ffffff'),
      },
      text: {
        primary: safeGet(platformTheme, 'text.primary') || (isDark ? '#ffffff' : '#212121'),
        secondary:
          safeGet(platformTheme, 'text.secondary') ||
          (isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'),
        disabled:
          safeGet(platformTheme, 'text.disabled') ||
          (isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.38)'),
      },
      divider:
        safeGet(platformTheme, 'divider') ||
        (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'),
      action: {
        active: safeGet(platformTheme, 'action.active') || (isDark ? '#fff' : 'rgba(0,0,0,0.54)'),
        hover:
          safeGet(platformTheme, 'action.hover') ||
          (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'),
        selected:
          safeGet(platformTheme, 'action.selected') ||
          (isDark ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.08)'),
        disabled:
          safeGet(platformTheme, 'action.disabled') ||
          (isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.26)'),
        disabledBackground:
          safeGet(platformTheme, 'action.disabledBackground') ||
          (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'),
      },
      // Add grey palette from neutral colors
      grey: {
        50: safeGet(neutral, '50', '#fafafa'),
        100: safeGet(neutral, '100', '#f5f5f5'),
        200: safeGet(neutral, '200', '#eeeeee'),
        300: safeGet(neutral, '300', '#e0e0e0'),
        400: safeGet(neutral, '400', '#bdbdbd'),
        500: safeGet(neutral, '500', '#9e9e9e'),
        600: safeGet(neutral, '600', '#757575'),
        700: safeGet(neutral, '700', '#616161'),
        800: safeGet(neutral, '800', '#424242'),
        900: safeGet(neutral, '900', '#212121'),
      },
    },
    typography: {
      fontFamily: safeGet(
        fontFamily,
        'primary',
        '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      ),
    },
    shape: {
      borderRadius: 4,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            margin: 0,
            padding: 0,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiInputBase: {
        defaultProps: {
          sx: {
            fontSize: '14px',
          },
        },
      },
      MuiInputLabel: {
        defaultProps: {
          sx: {
            fontSize: '14px',
          },
        },
      },
    },
  });
};

export default createAppTheme;
