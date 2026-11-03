/**
 * Design tokens derived from the default MUI palette.
 * Replaces the former `@gen2fund/platform.style` dependency.
 */
import { createTheme } from '@mui/material/styles';

const light = createTheme({ palette: { mode: 'light' } }).palette;
const dark = createTheme({ palette: { mode: 'dark' } }).palette;

const pick = (p: typeof light) => ({
  primary: p.primary,
  secondary: p.secondary,
  error: p.error,
  warning: p.warning,
  info: p.info,
  success: p.success,
  background: p.background,
  text: p.text,
  divider: p.divider,
  action: p.action,
});

export const lightMode = pick(light);
export const darkMode = pick(dark);

export const primary = light.primary;
export const secondary = light.secondary;
export const info = light.info;
export const warning = light.warning;
export const neutral = light.grey;
export const colors = {
  error: light.error,
  warning: light.warning,
  info: light.info,
  success: light.success,
};
export const common = light.common;
export const fontFamily = {
  primary: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
};
