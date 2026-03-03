import { primary } from '@gen2fund/platform.style';
import type { SxProps, Theme } from '@mui/material/styles';

import { HISTORY_AUDIT_LAYOUT } from '../constants';

export const historyAuditExportButtonStyles: SxProps<Theme> = (theme) => ({
  height: HISTORY_AUDIT_LAYOUT.TOOLBAR_INPUT_HEIGHT,
  minHeight: HISTORY_AUDIT_LAYOUT.TOOLBAR_INPUT_HEIGHT,
  textTransform: 'none',
  borderRadius: HISTORY_AUDIT_LAYOUT.TOOLBAR_BORDER_RADIUS,
  borderColor: theme.palette.divider,
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.common.white,
  color: theme.palette.text.secondary,
  '&:hover': {
    borderColor: theme.palette.divider,
    backgroundColor: theme.palette.action.hover,
  },
});

export const historyAuditListItemIconStyles: SxProps<Theme> = { minWidth: 32 };

export const historyAuditHeaderStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  mb: 1,
};

export const historyAuditHeaderLeftStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  minWidth: 0,
};

export const historyAuditHeaderIconStyles: SxProps<Theme> = (theme) => ({
  color: theme.palette.info.main,
  display: 'flex',
});

export const historyAuditHeaderTitleStyles: SxProps<Theme> = (theme) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
});

export const historyAuditHeaderCountChipStyles: SxProps<Theme> = (theme) => ({
  borderRadius: HISTORY_AUDIT_LAYOUT.TOOLBAR_BORDER_RADIUS,
  borderColor: theme.palette.divider,
});

export const historyAuditHeaderRightStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.75,
};

export const historyAuditLoaderStyles: SxProps<Theme> = {
  py: 6,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

export const historyAuditLoaderLabelStyles: SxProps<Theme> = { mt: 1 };

export const historyAuditSearchInputStyles: SxProps<Theme> = (theme) => ({
  maxWidth: 225,
  height: HISTORY_AUDIT_LAYOUT.TOOLBAR_INPUT_HEIGHT,
  minHeight: HISTORY_AUDIT_LAYOUT.TOOLBAR_INPUT_HEIGHT,
  borderRadius: HISTORY_AUDIT_LAYOUT.TOOLBAR_BORDER_RADIUS,
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.common.white,
  color: theme.palette.text.primary,
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.divider,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.divider,
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
    borderWidth: 1,
  },
  '& input': {
    padding: '5px 14px 5px 0',
    fontSize: '14px',
    color: theme.palette.text.primary,
  },
  '& input::placeholder': {
    color: theme.palette.text.secondary,
    opacity: 1,
    textOverflow: 'clip',
  },
});

export const historyAuditSearchAdornmentStyles: SxProps<Theme> = (theme) => ({
  color: theme.palette.text.secondary,
});

export const getHistoryAuditTableStyles = (
  height: number | string,
  sx?: SxProps<Theme>,
): SxProps<Theme> => [
  {
    width: '100%',
    height,
    '& .ag-header': { borderBottom: 'none !important' },
    '& .ag-header-cell': { paddingLeft: '0 !important', paddingRight: '0 !important' },
    '& .ag-cell': {
      paddingLeft: '16px !important',
      paddingRight: '16px !important',
      border: 'none !important',
    },
    '& .ag-row': { borderBottom: 'none !important' },
    '& .ag-row-hover': { backgroundColor: 'transparent !important' },
    '& .ag-row-hover .ag-cell': { backgroundColor: 'transparent !important' },
    '& .ag-row-hover::before': { backgroundColor: 'transparent !important' },
    '& .ag-root-wrapper': { border: 'none !important' },
  },
  ...(Array.isArray(sx) ? sx : [sx]),
];

export const historyAuditModuleDropdownStyles: SxProps<Theme> = (theme) => ({
  minWidth: 160,
  width: 176,
  height: HISTORY_AUDIT_LAYOUT.TOOLBAR_INPUT_HEIGHT,
  borderRadius: HISTORY_AUDIT_LAYOUT.TOOLBAR_BORDER_RADIUS,
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.common.white,
  color: theme.palette.text.primary,
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.divider,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.divider,
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
    borderWidth: 1,
  },
  '& .MuiSelect-select': {
    fontSize: 12,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    py: 0.75,
  },
  '& .MuiSelect-icon': {
    color: theme.palette.text.secondary,
  },
});

export const historyAuditModuleDropdownPaperStyles: SxProps<Theme> = (theme) => ({
  mt: 0.5,
  borderRadius: 1,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.common.white,
  color: theme.palette.text.primary,
  boxShadow: theme.shadows[2],
  '& .MuiMenuItem-root': {
    py: 0.75,
    pl: 1,
    pr: 3.5,
    fontSize: 13,
    minHeight: 30,
    borderRadius: 0.5,
  },
  '& .MuiMenuItem-root.Mui-focusVisible': {
    backgroundColor: theme.palette.action.hover,
  },
  '& .MuiMenuItem-root.Mui-selected': {
    backgroundColor: `${primary.main}14`,
    color: primary.main,
  },
  '& .MuiMenuItem-root.Mui-selected:hover': {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.text.primary,
  },
});

export const historyAuditModuleDropdownMenuItemRowStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  minWidth: 0,
};

export const historyAuditModuleDropdownMenuItemTextStyles: SxProps<Theme> = {
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};
