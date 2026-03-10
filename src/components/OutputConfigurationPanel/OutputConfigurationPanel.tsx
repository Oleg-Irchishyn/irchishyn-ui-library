import { Box, Typography } from '@mui/material';

import { FileSplittingSection } from './FileSplittingSection';
import { OutputFormatSection } from './OutputFormatSection';
import {
  getOutputConfigurationPanelRootStyles,
  outputConfigurationPanelPlaceholderStyles,
} from './styles';
import type { OutputConfigurationPanelProps } from './types';
import { useOutputConfigurationPanel } from './useOutputConfigurationPanel';

export function OutputConfigurationPanel({
  outputFormat,
  fileSplitting,
  sx,
}: OutputConfigurationPanelProps) {
  const { outputFormatProps, fileSplittingProps } = useOutputConfigurationPanel({
    outputFormat,
    fileSplitting,
  });

  return (
    <Box data-testid="output-configuration-panel" sx={getOutputConfigurationPanelRootStyles(sx)}>
      <OutputFormatSection {...outputFormatProps} />
      <FileSplittingSection {...fileSplittingProps} />
      <Box component="section" sx={outputConfigurationPanelPlaceholderStyles}>
        <Typography component="span">File Naming Convention — coming soon</Typography>
      </Box>
    </Box>
  );
}
