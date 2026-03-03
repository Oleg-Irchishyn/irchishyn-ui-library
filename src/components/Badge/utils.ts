import type { Theme } from '@mui/material/styles';

import { PRESET_COLOR_SET } from './constants';
import type { BadgeColorPreset } from '../../types';
import type { BadgeResolvedColors } from './types';

const isPresetColor = (color: string): color is BadgeColorPreset => PRESET_COLOR_SET.has(color);

const getNeutralColors = (theme: Theme) => ({
  main: theme.palette.mode === 'dark' ? theme.palette.grey[600] : theme.palette.grey[700],
  light: theme.palette.mode === 'dark' ? theme.palette.grey[300] : theme.palette.grey[600],
  dark: theme.palette.grey[800],
  contrastText: '#fff',
});

const resolvePresetColor = (theme: Theme, color: BadgeColorPreset) => {
  if (color === 'neutral') return getNeutralColors(theme);
  return theme.palette[color];
};

export const resolveFilledColors = (
  theme: Theme,
  color: BadgeColorPreset | string,
): BadgeResolvedColors => {
  if (isPresetColor(color)) {
    const paletteColor = resolvePresetColor(theme, color);
    return {
      backgroundColor: paletteColor.main,
      borderColor: paletteColor.main,
      textColor: '#fff',
    };
  }

  return {
    backgroundColor: color,
    borderColor: color,
    textColor: '#fff',
  };
};

export const resolveOutlinedColors = (
  theme: Theme,
  color: BadgeColorPreset | string,
): BadgeResolvedColors => {
  if (isPresetColor(color)) {
    const paletteColor = resolvePresetColor(theme, color);
    const outlinedColor = theme.palette.mode === 'dark' ? paletteColor.light : paletteColor.main;
    return {
      backgroundColor: 'transparent',
      borderColor: outlinedColor,
      textColor: outlinedColor,
    };
  }

  return {
    backgroundColor: 'transparent',
    borderColor: color,
    textColor: color,
  };
};
