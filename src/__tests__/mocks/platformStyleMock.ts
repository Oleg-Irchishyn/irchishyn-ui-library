export const lightMode = {
  primary: { main: '#0055aa', light: '#3377cc', dark: '#003377', contrastText: '#ffffff' },
  secondary: { main: '#00a9e0', light: '#53d5ff', dark: '#007bb5', contrastText: '#ffffff' },
  error: { main: '#f44336', light: '#e57373', dark: '#d32f2f' },
  warning: { main: '#ff9800', light: '#ffb74d', dark: '#f57c00' },
  info: { main: '#2196f3', light: '#64b5f6', dark: '#1976d2' },
  success: { main: '#4caf50', light: '#81c784', dark: '#388e3c' },
  background: { default: '#fafafa', paper: '#ffffff' },
  text: { primary: '#212121', secondary: 'rgba(0,0,0,0.6)', disabled: 'rgba(0,0,0,0.38)' },
  divider: 'rgba(0,0,0,0.12)',
  action: {
    active: 'rgba(0,0,0,0.54)',
    hover: 'rgba(0,0,0,0.04)',
    selected: 'rgba(0,0,0,0.08)',
    disabled: 'rgba(0,0,0,0.26)',
    disabledBackground: 'rgba(0,0,0,0.12)',
  },
};

export const darkMode = {
  ...lightMode,
  background: { default: '#121212', paper: '#1e1e1e' },
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255,255,255,0.7)',
    disabled: 'rgba(255,255,255,0.5)',
  },
  divider: 'rgba(255,255,255,0.12)',
  action: {
    active: '#fff',
    hover: 'rgba(255,255,255,0.08)',
    selected: 'rgba(255,255,255,0.16)',
    disabled: 'rgba(255,255,255,0.3)',
    disabledBackground: 'rgba(255,255,255,0.12)',
  },
};

export const primary = lightMode.primary;
export const secondary = lightMode.secondary;
export const warning = lightMode.warning;
export const info = lightMode.info;
export const neutral = {
  50: '#fafafa',
  100: '#f5f5f5',
  200: '#eeeeee',
  300: '#e0e0e0',
  400: '#bdbdbd',
  500: '#9e9e9e',
  600: '#757575',
  700: '#616161',
  800: '#424242',
  900: '#212121',
};
export const colors = {
  error: lightMode.error,
  warning: lightMode.warning,
  info: lightMode.info,
  success: lightMode.success,
};
export const common = {
  black: '#000000',
  white: '#ffffff',
};
export const fontFamily = {
  primary: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
};
