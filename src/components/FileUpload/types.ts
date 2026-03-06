import type { BoxProps } from '@mui/material/Box';

export interface FileUploadProps extends Omit<BoxProps, 'onChange'> {
  /** Callback invoked with selected file(s) when a valid file is dropped or chosen via Browse */
  onFileSelect: (files: File | File[]) => void;
  /** Accepted file types (e.g. ".pdf,.docx" or "application/pdf"). Passed to the file input. */
  accept?: string;
  /** Allow selecting multiple files */
  multiple?: boolean;
  /** Maximum file size in bytes. Files exceeding this show an error and onFileSelect is not called. */
  maxSizeBytes?: number;
  /** Disabled state: drop zone dimmed and non-interactive */
  disabled?: boolean;
}

export interface FileUploadStyleParams {
  isDragOver: boolean;
  hasError: boolean;
  disabled: boolean;
}
