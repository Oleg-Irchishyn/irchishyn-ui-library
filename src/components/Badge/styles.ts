import type { SxProps, Theme } from '@mui/material/styles';

import type { BadgeStyleParams } from './types';
import { resolveFilledColors, resolveOutlinedColors } from './utils';

export const getBadgeStyles = ({
  variant,
  color,
  size,
  hasIcon,
}: BadgeStyleParams): SxProps<Theme> => {
  return (theme) => {
    const resolvedColors =
      variant === 'filled'
        ? resolveFilledColors(theme, color)
        : resolveOutlinedColors(theme, color);

    return {
      borderRadius: 999,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: resolvedColors.borderColor,
      backgroundColor: resolvedColors.backgroundColor,
      color: resolvedColors.textColor,
      fontWeight: 600,
      letterSpacing: 0.2,
      height: size === 'small' ? 22 : 28,
      fontSize: size === 'small' ? 12 : 13,
      '& .MuiChip-label': {
        px: hasIcon ? (size === 'small' ? 0.75 : 1) : size === 'small' ? 1 : 1.25,
      },
      '& .MuiChip-icon + .MuiChip-label': {
        paddingLeft: 0,
      },
      '& .MuiChip-icon': {
        color: resolvedColors.textColor,
        marginLeft: size === 'small' ? 1 : 1,
        marginRight: size === 'small' ? 1 : 1.5,
        fontSize: size === 'small' ? 12 : 13,
        lineHeight: 1,
        display: 'flex',
        alignItems: 'center',
      },
      '& .MuiChip-icon svg': {
        width: size === 'small' ? 12 : 13,
        height: size === 'small' ? 12 : 13,
      },
    };
  };
};
