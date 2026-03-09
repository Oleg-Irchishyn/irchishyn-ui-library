import type { SxProps, Theme } from '@mui/material/styles';

export const getOutputConfigurationPanelRootStyles = (sx?: SxProps<Theme>): SxProps<Theme> => [
  {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },
  ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
];

export const outputConfigurationPanelPlaceholderStyles: SxProps<Theme> = {
  py: 2,
  px: 2,
  color: 'text.secondary',
  typography: 'body2',
};
