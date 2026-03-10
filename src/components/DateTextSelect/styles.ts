import type { SxProps, Theme } from '@mui/material/styles';

export const dateTextSelectRootStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0.75,
};

export const dateTextSelectRowStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: '2fr 1fr',
  gap: 1,
  alignItems: 'start',
};

export const getDateTextSelectInputStyles = (): SxProps<Theme> => (theme: Theme) => ({
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
  },
  '& .MuiSelect-select, & .MuiSelect-select.MuiInputBase-input, & .MuiSelect-select.MuiInputBase-inputSizeSmall':
    {
      display: 'flex',
      fontSize: '14px',
      alignItems: 'center',
      paddingTop: '7.9px',
      paddingBottom: '7.9px',
    },
  '& .MuiSelect-icon': {
    top: 'calc(50% - 0.5em)',
  },
});
