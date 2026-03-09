import { alpha } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';

export const getOutputFormatSectionStyles = (): SxProps<Theme> => () => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5,
});

export const getOutputFormatSectionHeadingStyles = (): SxProps<Theme> => (theme) => ({
  color: theme.palette.text.primary,
  fontWeight: 600,
  fontSize: theme.typography.body1.fontSize,
  margin: 0,
});

export const getOutputFormatOptionsRowStyles = (): SxProps<Theme> => () => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 2,
});

export const getOutputFormatOptionCardStyles = (): SxProps<Theme> => (theme) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 0,
  padding: 1.5,
  borderRadius: 1,
  border: '1px solid',
  borderColor: theme.palette.divider,
  backgroundColor: theme.palette.background.paper,
  minWidth: 140,
});

export const getOutputFormatFormControlLabelStyles = (): SxProps<Theme> => () => ({
  margin: 0,
  alignItems: 'center',
  flex: 1,
  minWidth: 0,
});

export const getOutputFormatOptionLabelWrapperStyles = (): SxProps<Theme> => () => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 1,
  minWidth: 0,
});

/** Resolves icon background: uses palette[iconColor].main with alpha when iconColor is a palette key, or alpha(iconColor) for raw CSS colors; else neutral. */
export const getOutputFormatOptionIconStyles =
  (iconColor?: string): SxProps<Theme> =>
  (theme) => {
    const palette = theme.palette as unknown as Record<string, { main?: string } | undefined>;
    const colorSource =
      iconColor && palette[iconColor]?.main ? palette[iconColor]!.main! : iconColor;
    const backgroundColor = colorSource
      ? alpha(colorSource, theme.palette.mode === 'dark' ? 0.24 : 0.12)
      : theme.palette.mode === 'dark'
        ? theme.palette.action.hover
        : theme.palette.action.selected;

    return {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      borderRadius: 0.75,
      padding: 0.5,
      backgroundColor,
      '& svg': {
        width: 24,
        height: 24,
      },
    };
  };

export const getOutputFormatErrorStyles = (): SxProps<Theme> => (theme) => ({
  color: theme.palette.error.main,
  fontSize: theme.typography.body2.fontSize,
});
