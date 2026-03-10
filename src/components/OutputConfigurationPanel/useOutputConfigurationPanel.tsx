import { useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { useMemo, useState } from 'react';
import { FileText, FileType } from 'lucide-react';

import type {
  OutputFormatSectionProps,
  OutputFormatItem,
  FileSplittingSectionProps,
  SplitMode,
} from './types';
import {
  DEFAULT_OUTPUT_FORMATS,
  DEFAULT_SELECTED_FORMATS,
  DEFAULT_MIN_SELECTED_FORMATS,
  DEFAULT_SPLIT_MODE,
  OUTPUT_FORMAT_ID_PDF,
  OUTPUT_FORMAT_ID_WORD,
} from './constants';

export type UseOutputConfigurationPanelParams = {
  outputFormat?: OutputFormatSectionProps;
  fileSplitting?: FileSplittingSectionProps;
};

export type UseOutputConfigurationPanelResult = {
  outputFormatProps: OutputFormatSectionProps;
  fileSplittingProps: FileSplittingSectionProps;
};

function getDefaultFormatsWithIcons(theme: Theme): OutputFormatItem[] {
  return DEFAULT_OUTPUT_FORMATS.map((item) => {
    const icon =
      item.id === OUTPUT_FORMAT_ID_PDF ? (
        <FileText size={24} color={theme.palette.error.main} />
      ) : item.id === OUTPUT_FORMAT_ID_WORD ? (
        <FileType size={24} color={theme.palette.info.main} />
      ) : undefined;
    return { ...item, icon };
  });
}

export function useOutputConfigurationPanel({
  outputFormat,
  fileSplitting,
}: UseOutputConfigurationPanelParams): UseOutputConfigurationPanelResult {
  const theme = useTheme();
  const defaultFormatsWithIcons = useMemo(() => getDefaultFormatsWithIcons(theme), [theme]);

  const [internalSplitMode, setInternalSplitMode] = useState<SplitMode>(DEFAULT_SPLIT_MODE);

  const outputFormatProps = outputFormat ?? {
    formats: defaultFormatsWithIcons,
    selectedFormats: DEFAULT_SELECTED_FORMATS,
    onFormatsChange: () => {},
    minSelected: DEFAULT_MIN_SELECTED_FORMATS,
  };

  const fileSplittingProps: FileSplittingSectionProps = useMemo(() => {
    if (fileSplitting != null) {
      return fileSplitting;
    }
    return {
      splitMode: internalSplitMode,
      onSplitModeChange: setInternalSplitMode,
    };
  }, [fileSplitting, internalSplitMode]);

  return { outputFormatProps, fileSplittingProps };
}
