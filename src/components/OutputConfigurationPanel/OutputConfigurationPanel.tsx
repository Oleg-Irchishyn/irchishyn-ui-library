import { Box } from '@mui/material';

import { FileNamingSection } from './FileNamingSection';
import { FileSplittingSection } from './FileSplittingSection';
import { OutputFormatSection } from './OutputFormatSection';
import {
  getOutputConfigurationPanelRootStyles,
  getOutputConfigurationSectionCardStyles,
} from './styles';
import type { OutputConfigurationPanelProps } from './types';
import { useOutputConfigurationPanel } from './useOutputConfigurationPanel';

const sectionCardStyles = getOutputConfigurationSectionCardStyles();

export function OutputConfigurationPanel({
  outputFormat,
  fileSplitting,
  fileNaming,
  sx,
}: OutputConfigurationPanelProps) {
  const { outputFormatProps, fileSplittingProps, fileNamingProps } = useOutputConfigurationPanel({
    outputFormat,
    fileSplitting,
    fileNaming,
  });

  return (
    <Box data-testid="output-configuration-panel" sx={getOutputConfigurationPanelRootStyles(sx)}>
      <Box component="section" sx={sectionCardStyles} data-testid="output-format-section-card">
        <OutputFormatSection {...outputFormatProps} />
      </Box>
      <Box component="section" sx={sectionCardStyles} data-testid="file-splitting-section-card">
        <FileSplittingSection {...fileSplittingProps} />
      </Box>
      <Box component="section" sx={sectionCardStyles} data-testid="file-naming-section-card">
        <FileNamingSection {...fileNamingProps} />
      </Box>
    </Box>
  );
}
