import { useCallback, useRef, useState } from 'react';

import { validateFiles } from './utils';

export interface UseFileUploadParams {
  onFileSelect: (files: File | File[]) => void;
  accept: string;
  multiple: boolean;
  maxSizeBytes?: number;
  disabled: boolean;
}

export interface UseFileUploadResult {
  inputRef: React.RefObject<HTMLInputElement>;
  isDragOver: boolean;
  error: string | null;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBrowseClick: () => void;
}

export function useFileUpload({
  onFileSelect,
  accept,
  multiple,
  maxSizeBytes,
  disabled,
}: UseFileUploadParams): UseFileUploadResult {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFiles = useCallback(
    (fileList: FileList | null) => {
      setError(null);
      if (!fileList || fileList.length === 0) return;
      const files = Array.from(fileList);
      const { valid, error: err } = validateFiles(files, accept, maxSizeBytes);
      if (err) {
        setError(err);
        return;
      }
      if (valid.length > 0) {
        onFileSelect(multiple ? valid : valid[0]);
      }
    },
    [accept, maxSizeBytes, multiple, onFileSelect],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) setIsDragOver(true);
    },
    [disabled],
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      if (disabled) return;
      processFiles(e.dataTransfer.files);
    },
    [disabled, processFiles],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      processFiles(e.target.files);
      e.target.value = '';
    },
    [processFiles],
  );

  const handleBrowseClick = useCallback(() => {
    if (disabled) return;
    inputRef.current?.click();
  }, [disabled]);

  return {
    inputRef,
    isDragOver,
    error,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleInputChange,
    handleBrowseClick,
  };
}
