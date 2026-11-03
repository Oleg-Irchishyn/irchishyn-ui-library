import { info, neutral, primary } from '../../tokens';
import type { SxProps, Theme } from '@mui/material/styles';

export const getFileNamingSectionStyles = (): SxProps<Theme> => () => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5,
  width: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
});

export const getFileNamingSectionHeadingRowStyles = (): SxProps<Theme> => () => ({
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  margin: 0,
});

export const getFileNamingSectionHeadingStyles = (): SxProps<Theme> => (theme) => ({
  color: theme.palette.text.primary,
  fontWeight: 600,
  fontSize: theme.typography.body1.fontSize,
  margin: 0,
});

export const getFileNamingSectionSubtitleStyles = (): SxProps<Theme> => (theme) => ({
  color: theme.palette.text.secondary,
  fontSize: theme.typography.body2.fontSize,
  margin: 0,
  mt: 0.25,
});

export const getFileNamingSectionIconStyles = (): SxProps<Theme> => (theme) => ({
  color: theme.palette.text.secondary,
  flexShrink: 0,
});

/** Wrapper for the preview area: grey background and border (Platform.styles neutral) */
export const getFileNamingPreviewBoxStyles = (): SxProps<Theme> => (theme) => ({
  backgroundColor: theme.palette.mode === 'dark' ? neutral[800] : neutral[100],
  border: '1px solid',
  borderColor: theme.palette.mode === 'dark' ? neutral[700] : neutral[200],
  borderRadius: 1,
  padding: 1.25,
  width: '100%',
  boxSizing: 'border-box',
});

/** File name text inside preview: theme primary (adapts in dark mode) */
export const getFileNamingPreviewTextStyles = (): SxProps<Theme> => (theme) => ({
  color: theme.palette.primary.main,
  fontFamily: 'monospace',
  fontSize: theme.typography.body2.fontSize,
  wordBreak: 'break-all',
});

export const getFileNamingStructureLabelRowStyles = (): SxProps<Theme> => () => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 1,
  width: '100%',
});

export const getFileNamingStructureLabelStyles = (): SxProps<Theme> => (theme) => ({
  color: theme.palette.text.primary,
  fontSize: theme.typography.body2.fontSize,
  fontWeight: 500,
});

/** Wrapper for the File Name Structure tags area: bordered box (Platform.styles neutral) */
export const getFileNamingStructureBoxStyles = (): SxProps<Theme> => (theme) => ({
  border: '1px solid',
  borderColor: theme.palette.mode === 'dark' ? neutral[700] : neutral[200],
  borderRadius: 1,
  padding: 1.25,
  width: '100%',
  boxSizing: 'border-box',
  minHeight: 42,
});

export const getFileNamingTokensRowStyles = (): SxProps<Theme> => () => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 1,
  width: '100%',
});

/** Variable tag: theme-aware for AC10 (light and dark mode); Platform tokens in light, theme palette in dark */
export const getFileNamingVariableTagStyles = (): SxProps<Theme> => (theme) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    borderRadius: 1,
    backgroundColor: isDark ? theme.palette.info.dark : neutral[50],
    color: isDark ? theme.palette.info.light : primary.dark,
    border: `1px solid ${isDark ? theme.palette.info.main : info.light}`,
    '& .MuiChip-label': {
      color: isDark ? theme.palette.info.light : primary.dark,
    },
    '& .MuiChip-icon': {
      color: isDark ? theme.palette.info.light : primary.dark,
    },
    '& .MuiChip-deleteIcon': {
      color: isDark ? theme.palette.info.light : primary.dark,
    },
  };
};

/** Static tag: theme-aware for AC10 (light and dark mode) */
export const getFileNamingStaticTagStyles = (): SxProps<Theme> => (theme) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    borderRadius: 1,
    backgroundColor: isDark ? theme.palette.grey[800] : neutral[100],
    border: `1px solid ${isDark ? theme.palette.divider : neutral[200]}`,
    color: isDark ? theme.palette.grey[300] : neutral[700],
    '& .MuiChip-deleteIcon': {
      color: isDark ? theme.palette.grey[300] : neutral[700],
    },
  };
};

export const getFileNamingResetLinkStyles = (): SxProps<Theme> => (theme) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.5,
  color: theme.palette.text.secondary,
  fontSize: theme.typography.body2.fontSize,
  cursor: 'pointer',
  textDecoration: 'none',
  '&:hover': {
    color: theme.palette.text.primary,
    textDecoration: 'underline',
  },
});

/** Add segment button: theme-aware outlined button using platform.style (light/dark) */
export const getFileNamingAddButtonStyles = (): SxProps<Theme> => (theme) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    border: '1px solid',
    borderColor: isDark ? theme.palette.primary.main : primary.main,
    color: isDark ? theme.palette.primary.main : primary.dark,
    backgroundColor: 'transparent',
    '&:hover': {
      borderColor: isDark ? theme.palette.primary.dark : primary.dark,
      backgroundColor: isDark ? theme.palette.action.hover : neutral[50],
    },
  };
};
