import type { SxProps, Theme } from '@mui/material/styles';

export const getDatePickerTextFieldStyles = (): SxProps<Theme> => (theme: Theme) => ({
  '& .MuiPickersInputBase-root, & .MuiOutlinedInput-root': {
    minHeight: 36,
  },
  '& .MuiPickersSectionList-root.MuiPickersInputBase-sectionsContainer': {
    minHeight: 36,
    paddingTop: '6.5px',
    paddingBottom: '6.5px',
  },

  '& .MuiOutlinedInput-root': {
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.common.white,
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.divider,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.text.secondary,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
      borderWidth: 1,
    },
  },
});

export const quickSelectPopoverContentStyles: SxProps<Theme> = {
  width: 360,
  p: 2,
};

export const quickSelectOptionGroupStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0.5,
};

export const quickSelectCustomRangeStyles: SxProps<Theme> = {
  mt: 2,
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 1,
};

export const quickSelectFooterStyles: SxProps<Theme> = {
  mt: 2,
  display: 'flex',
  justifyContent: 'flex-start',
};
