import { alpha } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';

import type { AlertStyleParams } from './types';

export const getAlertStyles = ({
  severity,
  variant,
  hasTitle,
}: AlertStyleParams): SxProps<Theme> => {
  return (theme) => {
    const paletteColor = theme.palette[severity];

    const toneColor = theme.palette.mode === 'dark' ? paletteColor.light : paletteColor.main;
    const filledBackground = paletteColor.main;
    const filledTextColor = paletteColor.contrastText || '#fff';

    const standardBackground = alpha(
      paletteColor.main,
      theme.palette.mode === 'dark' ? 0.24 : 0.12,
    );
    const standardBorder = alpha(paletteColor.main, theme.palette.mode === 'dark' ? 0.5 : 0.32);

    const variantStyles =
      variant === 'filled'
        ? {
            backgroundColor: filledBackground,
            borderColor: filledBackground,
            color: filledTextColor,
          }
        : variant === 'outlined'
          ? {
              backgroundColor: 'transparent',
              borderColor: toneColor,
              color: toneColor,
            }
          : {
              backgroundColor: standardBackground,
              borderColor: standardBorder,
              color: toneColor,
            };

    return {
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: 2,
      alignItems: hasTitle ? 'flex-start' : 'center',
      ...variantStyles,
      '& .MuiAlert-icon': {
        color: 'inherit',
        padding: 0,
        paddingTop: hasTitle ? 0.25 : 0,
        marginTop: 0,
        marginBottom: 0,
        marginRight: 1,
      },
      '& .MuiAlert-message': {
        paddingTop: 0,
        paddingBottom: 0,
        display: 'flex',
        flexDirection: hasTitle ? 'column' : 'row',
        alignItems: hasTitle ? 'flex-start' : 'center',
        justifyContent: 'center',
        minHeight: hasTitle ? 'auto' : 24,
        lineHeight: 1.5,
      },
      '& .MuiAlertTitle-root': {
        marginBottom: 0.5,
        fontWeight: 700,
      },
      '& .MuiAlert-action': {
        alignItems: hasTitle ? 'flex-start' : 'center',
        alignSelf: hasTitle ? 'flex-start' : 'center',
        marginRight: 0,
        paddingLeft: 1.5,
        paddingTop: hasTitle ? 0.25 : 0,
      },
      '& .MuiAlert-icon, & .MuiAlert-action': {
        alignSelf: hasTitle ? 'flex-start' : 'center',
      },
      '& .MuiAlert-icon svg, & .MuiAlert-action .MuiSvgIcon-root': {
        display: 'block',
      },
      '& .MuiAlert-action .MuiButton-root': {
        color: 'inherit',
      },
      '& .MuiAlert-action .MuiIconButton-root': {
        color: 'inherit',
      },
    };
  };
};
