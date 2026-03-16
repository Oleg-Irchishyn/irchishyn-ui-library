import type { SxProps, Theme } from '@mui/material/styles';

export const getFileSplittingSectionStyles = (): SxProps<Theme> => () => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5,
  width: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
});

export const getFileSplittingSectionHeadingRowStyles = (): SxProps<Theme> => () => ({
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  margin: 0,
});

export const getFileSplittingSectionHeadingStyles = (): SxProps<Theme> => (theme) => ({
  color: theme.palette.text.primary,
  fontWeight: 600,
  fontSize: theme.typography.body1.fontSize,
  margin: 0,
});

export const getFileSplittingSectionIconStyles = (): SxProps<Theme> => (theme) => ({
  color: theme.palette.text.secondary,
  flexShrink: 0,
});

export const getFileSplittingOptionsRowStyles = (): SxProps<Theme> => () => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  width: '100%',
});

export const getFileSplittingOptionCardStyles = (): SxProps<Theme> => (theme) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: 1,
  padding: 1.5,
  borderRadius: 1,
  border: '1px solid',
  borderColor: theme.palette.divider,
  backgroundColor: theme.palette.background.paper,
  width: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
});
