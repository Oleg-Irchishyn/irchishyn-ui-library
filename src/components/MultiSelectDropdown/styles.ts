import type { SxProps, Theme } from '@mui/material/styles';

import { MULTI_SELECT_LAYOUT } from './constants';

export const getMultiSelectTriggerStyles =
  (disabled?: boolean): SxProps<Theme> =>
  (theme: Theme) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 1,
    px: 1.5,
    py: 0.875,
    width: '100%',
    minWidth: MULTI_SELECT_LAYOUT.POPOVER_MIN_WIDTH,
    height: 40,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 1,
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.common.white,
    color: disabled ? theme.palette.text.disabled : theme.palette.text.primary,
    cursor: disabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:hover': disabled
      ? {}
      : {
          borderColor: theme.palette.text.primary,
        },
    '&[aria-expanded="true"]': {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 1px ${theme.palette.primary.main}`,
    },
  });

export const getMultiSelectTriggerLabelStyles = (): SxProps<Theme> => (theme: Theme) => ({
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  typography: 'body2',
  color: 'inherit',
  textAlign: 'left',
  lineHeight: theme.typography.body2.lineHeight,
});

export const getMultiSelectPopoverPaperStyles = (): SxProps<Theme> => (theme: Theme) => ({
  mt: 0.5,
  minWidth: MULTI_SELECT_LAYOUT.POPOVER_MIN_WIDTH,
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.common.white,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[4],
  borderRadius: 1,
  overflow: 'hidden',
});

export const getMultiSelectHeaderStyles = (): SxProps<Theme> => (theme: Theme) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 0.5,
  px: MULTI_SELECT_LAYOUT.SEARCH_PADDING,
  py: MULTI_SELECT_LAYOUT.SEARCH_PADDING,
  borderBottom: `1px solid ${theme.palette.divider}`,
  '& .MuiTextField-root': {
    flex: 1,
    width: '100%',
  },
});

export const getMultiSelectControlsRowStyles = (): SxProps<Theme> => (theme: Theme) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  px: 1.5,
  py: 0.5,
  borderBottom: `1px solid ${theme.palette.divider}`,
  minHeight: 36,
});

export const getMultiSelectActionIconStyles =
  (active: boolean): SxProps<Theme> =>
  (theme: Theme) => ({
    color: active ? theme.palette.primary.main : theme.palette.text.secondary,
    flexShrink: 0,
    '&:hover': {
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.action.hover,
    },
  });

export const getMultiSelectListStyles = (): SxProps<Theme> => ({
  maxHeight: MULTI_SELECT_LAYOUT.LIST_MAX_HEIGHT,
  overflowY: 'auto',
  py: MULTI_SELECT_LAYOUT.LIST_PADDING_Y,
  listStyle: 'none',
  m: 0,
  p: 0,
});

export const getMultiSelectOptionStyles =
  (checked: boolean): SxProps<Theme> =>
  (theme: Theme) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    px: 1,
    py: 0.75,
    mx: 0.5,
    borderRadius: 1,
    cursor: 'pointer',
    backgroundColor: checked ? theme.palette.action.selected : 'transparent',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  });

export const getMultiSelectEmptyStateStyles = (): SxProps<Theme> => ({
  px: 2,
  py: 1.5,
  textAlign: 'center',
  color: 'text.secondary',
});

export const getMultiSelectClearButtonStyles = (): SxProps<Theme> => (theme: Theme) => ({
  display: 'block',
  width: '100%',
  px: 1.5,
  py: 0.875,
  typography: 'body2',
  color: theme.palette.text.secondary,
  cursor: 'pointer',
  borderTop: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.text.primary,
  },
});
