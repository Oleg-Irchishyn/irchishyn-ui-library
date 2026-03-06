import type { SxProps, Theme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

export const getDocumentTemplateCardRootStyles =
  (selected: boolean, clickable: boolean): SxProps<Theme> =>
  (theme: Theme) => ({
    width: 180,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 2,
    border: '2px solid',
    borderColor: selected ? theme.palette.primary.main : theme.palette.divider,
    backgroundColor: theme.palette.background.paper,
    overflow: 'hidden',
    transition: theme.transitions.create(['border-color', 'box-shadow', 'transform'], {
      duration: theme.transitions.duration.shorter,
    }),
    cursor: clickable ? 'pointer' : 'default',
    '&:hover': {
      borderColor: selected ? theme.palette.primary.main : theme.palette.primary.light,
      boxShadow: `0 0 0 1px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.35)}`,
    },
  });

export const documentTemplateCardActionBarStyles: SxProps<Theme> = (theme: Theme) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: 0.5,
  px: 1,
  py: 0.75,
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: alpha(theme.palette.text.primary, theme.palette.mode === 'dark' ? 0.08 : 0.04),
});

export const getDocumentTemplateCardActionButtonStyles =
  (danger: boolean): SxProps<Theme> =>
  (theme: Theme) => ({
    width: 24,
    height: 24,
    color: danger ? theme.palette.error.main : theme.palette.text.secondary,
    '&:hover': {
      backgroundColor: danger
        ? alpha(theme.palette.error.main, 0.12)
        : alpha(theme.palette.primary.main, 0.1),
      color: danger ? theme.palette.error.main : theme.palette.primary.main,
    },
  });

export const documentTemplateCardPreviewStyles: SxProps<Theme> = (theme: Theme) => ({
  minHeight: 120,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  px: 1.5,
  py: 1,
  backgroundColor: alpha(theme.palette.text.primary, theme.palette.mode === 'dark' ? 0.08 : 0.03),
});

export const getDocumentTemplateCardBadgeStyles =
  (isTemplate: boolean): SxProps<Theme> =>
  (theme: Theme) => ({
    maxWidth: '100%',
    height: 18,
    borderRadius: 1,
    '& .MuiChip-label': {
      px: 1,
      py: 0.25,
      fontSize: '0.625rem',
      lineHeight: 1.2,
    },
    ...(isTemplate
      ? {
          backgroundColor: theme.palette.primary.main,
          borderColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        }
      : undefined),
  });

export const getDocumentTemplateCardFileIconContainerStyles =
  (isPdf: boolean): SxProps<Theme> =>
  (theme: Theme) => ({
    width: 40,
    height: 46,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 1,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: isPdf ? theme.palette.background.paper : 'transparent',
  });

export const documentTemplateCardFooterStyles: SxProps<Theme> = (theme: Theme) => ({
  px: 1.25,
  py: 1,
  borderTop: `1px solid ${theme.palette.divider}`,
});

export const getDocumentTemplateCardFileNameStyles =
  (selected: boolean): SxProps<Theme> =>
  (theme: Theme) => ({
    margin: 0,
    fontSize: '0.75rem',
    lineHeight: 1.4,
    fontWeight: 600,
    textAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: selected ? theme.palette.primary.main : theme.palette.text.primary,
  });
