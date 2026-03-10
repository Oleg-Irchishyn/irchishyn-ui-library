import { useState, useCallback } from 'react';

import { OUTPUT_FORMAT_MIN_SELECTED_MESSAGE } from './constants';

export type UseOutputFormatSectionParams = {
  selectedFormats: string[];
  onFormatsChange: (selectedIds: string[]) => void;
  minSelected: number;
  error?: string;
};

export type UseOutputFormatSectionResult = {
  handleChange: (formatId: string, checked: boolean) => void;
  displayError: string | undefined;
};

export function useOutputFormatSection({
  selectedFormats,
  onFormatsChange,
  minSelected,
  error,
}: UseOutputFormatSectionParams): UseOutputFormatSectionResult {
  const [showMinSelectedError, setShowMinSelectedError] = useState(false);

  const handleChange = useCallback(
    (formatId: string, checked: boolean) => {
      const nextSelected = checked
        ? [...selectedFormats, formatId]
        : selectedFormats.filter((id) => id !== formatId);
      if (nextSelected.length < minSelected) {
        setShowMinSelectedError(true);
        return;
      }
      setShowMinSelectedError(false);
      onFormatsChange(nextSelected);
    },
    [selectedFormats, minSelected, onFormatsChange],
  );

  const displayError =
    error ?? (showMinSelectedError ? OUTPUT_FORMAT_MIN_SELECTED_MESSAGE : undefined);

  return { handleChange, displayError };
}
