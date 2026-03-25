import type { SxProps, Theme } from '@mui/material/styles';

import { SELECT_DROPDOWN_LAYOUT } from './constants';

export const getSelectDropdownTriggerStyles =
  (disabled?: boolean): SxProps<Theme> =>
  (theme: Theme) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 1,
    px: 1.5,
    py: 0.875,
    width: '100%',
    minWidth: SELECT_DROPDOWN_LAYOUT.POPOVER_MIN_WIDTH,
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

export const getSelectDropdownTriggerContentStyles = (): SxProps<Theme> => ({
  display: 'flex',
  alignItems: 'center',
  gap: 0.75,
  flex: 1,
  overflow: 'hidden',
  minWidth: 0,
});

export const getSelectDropdownTriggerLabelStyles = (): SxProps<Theme> => (theme: Theme) => ({
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  typography: 'body2',
  color: 'inherit',
  textAlign: 'left',
  lineHeight: theme.typography.body2.lineHeight,
});

export const getSelectDropdownPopoverPaperStyles = (): SxProps<Theme> => (theme: Theme) => ({
  mt: 0.5,
  minWidth: SELECT_DROPDOWN_LAYOUT.POPOVER_MIN_WIDTH,
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.common.white,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[4],
  borderRadius: 1,
  overflow: 'hidden',
});

export const getSelectDropdownHeaderStyles = (): SxProps<Theme> => (theme: Theme) => ({
  display: 'flex',
  alignItems: 'center',
  px: SELECT_DROPDOWN_LAYOUT.SEARCH_PADDING,
  py: SELECT_DROPDOWN_LAYOUT.SEARCH_PADDING,
  borderBottom: `1px solid ${theme.palette.divider}`,
  '& .MuiTextField-root': {
    flex: 1,
    width: '100%',
  },
});

export const getSelectDropdownActionButtonStyles = (): SxProps<Theme> => (theme: Theme) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 0.75,
  width: '100%',
  px: 1.5,
  py: 0.75,
  typography: 'body2',
  color: theme.palette.text.secondary,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.text.primary,
  },
});

export const getSelectDropdownActionsDividerStyles = (): SxProps<Theme> => (theme: Theme) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
});

export const getSelectDropdownListStyles = (): SxProps<Theme> => ({
  maxHeight: SELECT_DROPDOWN_LAYOUT.LIST_MAX_HEIGHT,
  overflowY: 'auto',
  py: SELECT_DROPDOWN_LAYOUT.LIST_PADDING_Y,
  listStyle: 'none',
  m: 0,
  p: 0,
});

export const getSelectDropdownOptionStyles =
  (isSelected: boolean): SxProps<Theme> =>
  (theme: Theme) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 0.75,
    px: 1,
    py: 0.75,
    mx: 0.5,
    borderRadius: 1,
    cursor: 'pointer',
    backgroundColor: isSelected ? theme.palette.action.selected : 'transparent',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  });

export const getSelectDropdownEmptyStateStyles = (): SxProps<Theme> => ({
  px: 2,
  py: 1.5,
  textAlign: 'center',
  color: 'text.secondary',
});

export const getSelectDropdownLoadingStateStyles = (): SxProps<Theme> => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  px: 2,
  py: 2,
});
