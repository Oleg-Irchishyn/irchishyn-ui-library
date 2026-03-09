import { useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { useMemo } from 'react';
import { FileText, FileType } from 'lucide-react';

import type { OutputFormatSectionProps, OutputFormatItem } from './types';
import {
  DEFAULT_OUTPUT_FORMATS,
  DEFAULT_SELECTED_FORMATS,
  DEFAULT_MIN_SELECTED_FORMATS,
  OUTPUT_FORMAT_ID_PDF,
  OUTPUT_FORMAT_ID_WORD,
} from './constants';

export type UseOutputConfigurationPanelParams = {
  outputFormat?: OutputFormatSectionProps;
};

export type UseOutputConfigurationPanelResult = {
  outputFormatProps: OutputFormatSectionProps;
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
}: UseOutputConfigurationPanelParams): UseOutputConfigurationPanelResult {
  const theme = useTheme();
  const defaultFormatsWithIcons = useMemo(
    () => getDefaultFormatsWithIcons(theme),
    [theme],
  );

  const outputFormatProps =
    outputFormat ?? {
      formats: defaultFormatsWithIcons,
      selectedFormats: DEFAULT_SELECTED_FORMATS,
      onFormatsChange: () => {},
      minSelected: DEFAULT_MIN_SELECTED_FORMATS,
    };

  return { outputFormatProps };
}
