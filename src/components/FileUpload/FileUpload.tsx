import React from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { Upload as UploadIcon } from 'lucide-react';

import {
  FILE_UPLOAD_BROWSE_LABEL,
  FILE_UPLOAD_DEFAULT_ACCEPT,
  FILE_UPLOAD_LABEL,
} from './constants';
import { getFileUploadStyles } from './styles';
import type { FileUploadProps } from './types';
import { useFileUpload } from './useFileUpload';

export const FileUpload = ({
  onFileSelect,
  accept = FILE_UPLOAD_DEFAULT_ACCEPT,
  multiple = false,
  maxSizeBytes,
  disabled = false,
  sx,
  ...rest
}: FileUploadProps) => {
  const theme = useTheme();
  const {
    inputRef,
    isDragOver,
    error,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleInputChange,
    handleBrowseClick,
  } = useFileUpload({
    onFileSelect,
    accept,
    multiple,
    maxSizeBytes,
    disabled,
  });

  const iconColor = theme.palette.text.secondary;
  const resolvedSx = [
    getFileUploadStyles({ isDragOver, hasError: Boolean(error), disabled }),
    ...(Array.isArray(sx) ? sx : [sx]),
  ] as SxProps<Theme>;

  return (
    <Box
      data-testid="file-upload"
      component="div"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      sx={resolvedSx}
      {...rest}
    >
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="file"
        className="file-upload-input"
        data-testid="file-upload-input"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleInputChange}
        aria-label="File upload"
      />
      <UploadIcon size={32} color={iconColor} aria-hidden />
      <Typography variant="body2" color="text.secondary">
        {FILE_UPLOAD_LABEL}
      </Typography>
      <Button
        variant="outlined"
        size="small"
        onClick={handleBrowseClick}
        disabled={disabled}
        data-testid="file-upload-browse"
        aria-label={FILE_UPLOAD_BROWSE_LABEL}
        sx={{
          color: theme.palette.text.secondary,
          borderColor: theme.palette.divider,
          '&:hover': {
            borderColor: theme.palette.text.secondary,
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        {FILE_UPLOAD_BROWSE_LABEL}
      </Button>
      {error && (
        <Typography className="file-upload-error" variant="body2" data-testid="file-upload-error">
          {error}
        </Typography>
      )}
    </Box>
  );
};
