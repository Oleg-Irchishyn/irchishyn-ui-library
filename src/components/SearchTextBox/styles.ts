import type { SxProps, Theme } from '@mui/material/styles';

export const getSearchTextBoxBaseStyles = (): SxProps<Theme> => (theme: Theme) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? theme.palette.background.paper
      : theme.palette.common.white,
  color: theme.palette.text.primary,
  '& .MuiOutlinedInput-root': {
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
      color: theme.palette.text.primary,
    },
    '& input::placeholder': {
      color: theme.palette.text.secondary,
      opacity: 1,
    },
  },
});
