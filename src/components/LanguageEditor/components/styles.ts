import { info, neutral, primary } from '@gen2fund/platform.style';
import type { SxProps, Theme } from '@mui/material/styles';

import { LANGUAGE_EDITOR_LAYOUT } from '../constants';

export const languageEditorPaperStyles: SxProps<Theme> = { overflow: 'hidden' };
export const languageEditorValidationContentStyles: SxProps<Theme> = { flex: 1 };
export const languageEditorValidationErrorItemStyles: SxProps<Theme> = { ml: 1 };
export const languageEditorValidationCloseButtonStyles: SxProps<Theme> = { mt: -0.5 };

export const getLanguageEditorValidationBannerStyles = (isValid: boolean): SxProps<Theme> => ({
  px: 2,
  py: 1,
  borderBottom: 1,
  borderColor: 'divider',
  backgroundColor: isValid ? 'success.light' : 'error.light',
  display: 'flex',
  alignItems: 'flex-start',
  gap: 1,
});

export const getLanguageEditorEditableAreaStyles = (
  minHeight: string,
  readOnly: boolean,
): SxProps<Theme> => ({
  p: 2,
  minHeight,
  outline: 'none',
  cursor: readOnly ? 'default' : 'text',
  '&:empty::before': {
    content: 'attr(data-placeholder)',
    color: 'text.secondary',
    fontStyle: 'italic',
  },
  '& b, & strong': {
    fontWeight: 700,
  },
  '& i, & em': {
    fontStyle: 'italic',
  },
  '& u': {
    textDecoration: 'underline',
  },
});

export const languageEditorToolbarStyles: SxProps<Theme> = (theme) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 0.5,
  p: 1,
  borderBottom: 1,
  borderColor: 'divider',
  backgroundColor: theme.palette.background.paper,
  flexWrap: 'wrap',
});
export const languageEditorToolbarButtonsGroupStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.5,
};
export const languageEditorToolbarDividerStyles: SxProps<Theme> = { mx: 1 };
export const languageEditorToolbarActionButtonStyles: SxProps<Theme> = {
  textTransform: 'none',
  fontSize: 13,
};
export const languageEditorToolbarSpacerStyles: SxProps<Theme> = { flex: 1 };

export const languageEditorFieldMenuPaperStyles: SxProps<Theme> = (theme) => ({
  minWidth: 280,
  maxWidth: 360,
  borderRadius: 1,
  mt: 0.5,
  boxShadow: theme.shadows[4],
});
export const languageEditorFieldMenuListStyles: SxProps<Theme> = { py: 0 };
export const languageEditorFieldSearchWrapStyles: SxProps<Theme> = { px: 1.5, pt: 1.5, pb: 1 };
export const languageEditorFieldSearchInputStyles: SxProps<Theme> = (theme) => ({
  height: LANGUAGE_EDITOR_LAYOUT.SEARCH_INPUT_HEIGHT,
  borderRadius: LANGUAGE_EDITOR_LAYOUT.TOOLBAR_BORDER_RADIUS,
  backgroundColor: theme.palette.grey[100],
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
});
export const languageEditorFieldListStyles: SxProps<Theme> = {
  maxHeight: LANGUAGE_EDITOR_LAYOUT.DROPDOWN_LIST_MAX_HEIGHT,
  overflowY: 'auto',
  py: 0,
};
export const languageEditorFieldEmptyStyles: SxProps<Theme> = {
  py: 3,
  px: 2,
  textAlign: 'center',
  color: 'text.secondary',
  fontSize: 14,
};
export const languageEditorFieldMenuItemStyles: SxProps<Theme> = { py: 1, minHeight: 'auto' };
export const languageEditorFieldPrimaryTextStyles: SxProps<Theme> = {
  fontFamily: 'monospace',
  fontSize: 13,
};
export const getLanguageEditorFieldTypeChipStyles = (badgeColors: {
  bg: string;
  text: string;
}): SxProps<Theme> => ({
  ml: 1,
  height: 22,
  fontSize: 11,
  fontWeight: 600,
  backgroundColor: badgeColors.bg,
  color: badgeColors.text,
  '& .MuiChip-label': { px: 1 },
});

/** POC: outer dialog max-h-[85vh] overflow-hidden flex flex-col */
export const languageEditorDialogPaperStyles: SxProps<Theme> = {
  maxHeight: '85vh',
  height: '85vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};
export const languageEditorDialogTitleStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  flexShrink: 0,
};
/** POC DialogHeader: flex-shrink-0 — title + description block */
export const languageEditorDialogHeaderSectionStyles: SxProps<Theme> = {
  flexShrink: 0,
  px: 3,
  pt: 2,
  pb: 1,
};
/** DialogContent replaced by flex middle — must take remaining height and not scroll itself */
export const languageEditorDialogContentStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  flex: '1 1 0%',
  minHeight: 0,
  maxHeight: '100%',
  overflow: 'hidden',
  p: 0,
  '&.MuiDialogContent-root': {
    paddingTop: 0,
  },
};
/**
 * POC scroll div: flex-1 overflow-y-auto pr-4 min-h-0
 * Only this region scrolls; blocks keep natural height (flexShrink 0 on children).
 */
export const languageEditorDialogScrollAreaStyles: SxProps<Theme> = {
  flex: '1 1 0%',
  minHeight: 0,
  overflowY: 'auto',
  overflowX: 'hidden',
  WebkitOverflowScrolling: 'touch',
  px: 3,
  pr: 2,
  py: 2,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  // POC space-y-4 between blocks — prevent flex from squishing block heights
  '& > *': {
    flexShrink: 0,
  },
};
/** Validation banner between scroll and footer — flex-shrink-0 like POC */
export const languageEditorDialogValidationSectionStyles: SxProps<Theme> = {
  flexShrink: 0,
  px: 3,
  pb: 1,
};
export const languageEditorDialogActionsStyles: SxProps<Theme> = { px: 2, py: 1.5, flexShrink: 0 };
export const languageEditorDialogDescriptionStyles: SxProps<Theme> = {
  m: 0,
  color: 'text.secondary',
  fontSize: 14,
};

export const languageEditorClauseRowStyles: SxProps<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 2,
  alignItems: 'flex-start',
};
export const languageEditorClauseFormControlStyles: SxProps<Theme> = { minWidth: 180 };
export const languageEditorClauseRangeWrapStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
};
export const languageEditorClauseRangeAndStyles: SxProps<Theme> = {
  fontSize: 12,
  color: 'text.secondary',
};
export const languageEditorClauseRemoveButtonStyles: SxProps<Theme> = { minWidth: 36 };
export const languageEditorClauseValueInputWrapperStyles: SxProps<Theme> = { flex: 1, minWidth: 0 };
export const languageEditorClauseBooleanValueControlStyles: SxProps<Theme> = { minWidth: 120 };
export const languageEditorClauseTextValueInputStyles: SxProps<Theme> = { minWidth: 140, flex: 1 };

export const languageEditorIfElseBlockRootStyles: SxProps<Theme> = {
  border: 1,
  borderColor: 'divider',
  borderRadius: 1,
  overflow: 'hidden',
  flexShrink: 0,
};
export const languageEditorIfBlockHeaderStyles: SxProps<Theme> = {
  px: 2,
  py: 1,
  bgcolor: info.light,
  borderBottom: 1,
  borderColor: 'divider',
  display: 'flex',
  alignItems: 'center',
  gap: 1,
};
export const languageEditorElseIfBlockHeaderStyles: SxProps<Theme> = {
  px: 2,
  py: 1,
  bgcolor: primary.light,
  borderBottom: 1,
  borderColor: 'divider',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};
export const languageEditorElseIfHeaderLeftStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
};
export const languageEditorElseBlockHeaderStyles: SxProps<Theme> = {
  px: 2,
  py: 1,
  bgcolor: neutral[200],
  borderBottom: 1,
  borderColor: 'divider',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};
/** Enabled state: white text, no box shadow, no hover effect */
export const languageEditorElseBlockEnabledButtonStyles: SxProps<Theme> = {
  color: '#fff',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: 'primary.main',
    color: '#fff',
    boxShadow: 'none',
  },
};
/** Disabled state: grey text and border, transparent background, no hover effect */
export const languageEditorElseBlockDisabledButtonStyles: SxProps<Theme> = (theme) => ({
  color: theme.palette.grey[600],
  borderColor: theme.palette.grey[500],
  backgroundColor: 'transparent',
  '&:hover': {
    backgroundColor: 'transparent',
    color: theme.palette.grey[600],
    borderColor: theme.palette.grey[500],
  },
});
export const languageEditorIfElseTagStyles: SxProps<Theme> = {
  px: 1,
  py: 0.25,
  borderRadius: 0.5,
  fontSize: 12,
  fontWeight: 600,
  color: 'white',
};
export const languageEditorIfTagStyles: SxProps<Theme> = {
  ...languageEditorIfElseTagStyles,
  bgcolor: info.dark,
};
export const languageEditorElseIfTagStyles: SxProps<Theme> = {
  ...languageEditorIfElseTagStyles,
  bgcolor: primary.dark,
};
export const languageEditorIfElseHeaderTextStyles: SxProps<Theme> = {
  fontSize: 14,
  fontWeight: 500,
};
export const languageEditorIfElseBodyStyles: SxProps<Theme> = {
  p: 2,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};
export const languageEditorElseBodyStyles: SxProps<Theme> = { p: 2 };
export const languageEditorContentLabelStyles: SxProps<Theme> = {
  fontSize: 12,
  color: 'text.secondary',
  display: 'block',
  mb: 0.5,
};
