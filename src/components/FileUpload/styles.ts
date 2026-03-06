import type { SxProps, Theme } from '@mui/material/styles';

import type { FileUploadStyleParams } from './types';

export const getFileUploadStyles = ({
  isDragOver,
  hasError,
  disabled,
}: FileUploadStyleParams): SxProps<Theme> => {
  return (theme: Theme) => {
    const borderColor = hasError
      ? theme.palette.error.main
      : isDragOver
        ? theme.palette.primary.main
        : theme.palette.divider;
    const backgroundColor =
      theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.common.white;
    const opacity = disabled ? 0.5 : 1;
    const pointerEvents = disabled ? 'none' : 'auto';

    return {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 1.5,
      py: 3,
      px: 2,
      border: '2px dashed',
      borderColor,
      borderRadius: 2,
      backgroundColor: isDragOver ? theme.palette.action.hover : backgroundColor,
      opacity,
      pointerEvents,
      transition: 'border-color 0.2s, background-color 0.2s',
      '& .file-upload-input': {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        opacity: 0,
        cursor: disabled ? 'default' : 'pointer',
      },
      '& .file-upload-error': {
        color: theme.palette.error.main,
        typography: theme.typography.body2,
      },
    };
  };
};
