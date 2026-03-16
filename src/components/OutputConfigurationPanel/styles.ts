import type { SxProps, Theme } from '@mui/material/styles';

export const getOutputConfigurationPanelRootStyles = (sx?: SxProps<Theme>): SxProps<Theme> => [
  {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    width: '100%',
    minWidth: 0,
    maxWidth: '100%',
    boxSizing: 'border-box',
  },
  ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
];

/** Card styles from POC (shadcn Card: rounded-xl border bg-card shadow); background from theme (Platform); full width */
export const getOutputConfigurationSectionCardStyles = (): SxProps<Theme> => (theme) => ({
  borderRadius: 1.5, // rounded-xl (12px)
  border: '1px solid',
  borderColor: theme.palette.divider,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: theme.shadows[1],
  padding: 3, // p-6 equivalent (24px)
  width: '100%',
  minWidth: 0,
  maxWidth: '100%',
  boxSizing: 'border-box',
});

export const outputConfigurationPanelPlaceholderStyles: SxProps<Theme> = {
  py: 2,
  px: 2,
  color: 'text.secondary',
  typography: 'body2',
};
