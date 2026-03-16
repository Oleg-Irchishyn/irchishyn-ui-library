import { useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { useCallback, useMemo, useState } from 'react';
import { FileText, FileType } from 'lucide-react';

import type {
  OutputFormatSectionProps,
  OutputFormatItem,
  FileSplittingSectionProps,
  FileNamingSectionProps,
  FileNamingToken,
  SplitMode,
} from './types';
import {
  DEFAULT_OUTPUT_FORMATS,
  DEFAULT_SELECTED_FORMATS,
  DEFAULT_MIN_SELECTED_FORMATS,
  DEFAULT_SPLIT_MODE,
  DEFAULT_FILE_NAMING_TOKENS,
  DEFAULT_FILE_NAMING_TOKENS_PER_INVESTOR,
  DEFAULT_FILE_NAMING_VARIABLES,
  DEFAULT_FILE_NAMING_VARIABLES_PER_INVESTOR,
  DEFAULT_FILE_NAMING_DEMO_VALUES,
  OUTPUT_FORMAT_ID_PDF,
  OUTPUT_FORMAT_ID_WORD,
  FILE_NAMING_SUBTITLE_CONSOLIDATED,
  FILE_NAMING_SUBTITLE_PER_INVESTOR,
} from './constants';

export type UseOutputConfigurationPanelParams = {
  outputFormat?: OutputFormatSectionProps;
  fileSplitting?: FileSplittingSectionProps;
  fileNaming?: FileNamingSectionProps;
};

export type UseOutputConfigurationPanelResult = {
  outputFormatProps: OutputFormatSectionProps;
  fileSplittingProps: FileSplittingSectionProps;
  fileNamingProps: FileNamingSectionProps;
};

function computeBaseNameFromTokens(tokens: FileNamingToken[]): string {
  return tokens
    .map((t) =>
      t.type === 'variable' ? (DEFAULT_FILE_NAMING_DEMO_VALUES[t.value] ?? t.value) : t.value,
    )
    .join('');
}

function computePreviewFileNamesFromTokensAndFormats(
  tokens: FileNamingToken[],
  selectedFormatIds: string[],
): string[] {
  const base = computeBaseNameFromTokens(tokens);
  if (!base) return [];
  const names: string[] = [];
  if (selectedFormatIds.includes(OUTPUT_FORMAT_ID_PDF)) names.push(`${base}.pdf`);
  if (selectedFormatIds.includes(OUTPUT_FORMAT_ID_WORD)) names.push(`${base}.docx`);
  return names;
}

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
  fileNaming,
}: UseOutputConfigurationPanelParams): UseOutputConfigurationPanelResult {
  const theme = useTheme();
  const defaultFormatsWithIcons = useMemo(() => getDefaultFormatsWithIcons(theme), [theme]);

  const [internalSplitMode, setInternalSplitMode] = useState<SplitMode>(DEFAULT_SPLIT_MODE);
  const [internalTokens, setInternalTokens] = useState<FileNamingToken[]>(
    DEFAULT_FILE_NAMING_TOKENS,
  );
  const [internalSelectedFormats, setInternalSelectedFormats] =
    useState<string[]>(DEFAULT_SELECTED_FORMATS);

  const selectedFormats = outputFormat?.selectedFormats ?? internalSelectedFormats;

  const outputFormatProps = outputFormat ?? {
    formats: defaultFormatsWithIcons,
    selectedFormats: internalSelectedFormats,
    onFormatsChange: setInternalSelectedFormats,
    minSelected: DEFAULT_MIN_SELECTED_FORMATS,
  };

  const getDefaultTokensForMode = useCallback((mode: SplitMode) => {
    return mode === 'splitPerInvestor'
      ? DEFAULT_FILE_NAMING_TOKENS_PER_INVESTOR
      : DEFAULT_FILE_NAMING_TOKENS;
  }, []);

  const handleSplitModeChange = useCallback(
    (mode: SplitMode) => {
      setInternalSplitMode(mode);
      setInternalTokens(getDefaultTokensForMode(mode));
    },
    [getDefaultTokensForMode],
  );

  const fileSplittingProps: FileSplittingSectionProps = useMemo(() => {
    if (fileSplitting != null) {
      return fileSplitting;
    }
    return {
      splitMode: internalSplitMode,
      onSplitModeChange: handleSplitModeChange,
    };
  }, [fileSplitting, internalSplitMode, handleSplitModeChange]);

  const fileNamingProps: FileNamingSectionProps = useMemo(() => {
    if (fileNaming != null) {
      return fileNaming;
    }
    const splitMode = fileSplitting?.splitMode ?? internalSplitMode;
    const availableVariables =
      splitMode === 'splitPerInvestor'
        ? DEFAULT_FILE_NAMING_VARIABLES_PER_INVESTOR
        : DEFAULT_FILE_NAMING_VARIABLES;
    const defaultTokens = getDefaultTokensForMode(splitMode);
    return {
      tokens: internalTokens,
      availableVariables,
      onTokensChange: setInternalTokens,
      onReset: () => setInternalTokens(defaultTokens),
      previewFileNames: computePreviewFileNamesFromTokensAndFormats(
        internalTokens,
        selectedFormats,
      ),
      subtitle:
        splitMode === 'splitPerInvestor'
          ? FILE_NAMING_SUBTITLE_PER_INVESTOR
          : FILE_NAMING_SUBTITLE_CONSOLIDATED,
      variableExamples: DEFAULT_FILE_NAMING_DEMO_VALUES,
    };
  }, [
    fileNaming,
    fileSplitting?.splitMode,
    internalSplitMode,
    internalTokens,
    selectedFormats,
    getDefaultTokensForMode,
  ]);

  return { outputFormatProps, fileSplittingProps, fileNamingProps };
}
