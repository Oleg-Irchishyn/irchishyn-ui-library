import { Box, Typography } from '@mui/material';

import { OutputFormatSection } from './OutputFormatSection';
import {
  getOutputConfigurationPanelRootStyles,
  outputConfigurationPanelPlaceholderStyles,
} from './styles';
import type { OutputConfigurationPanelProps } from './types';
import { useOutputConfigurationPanel } from './useOutputConfigurationPanel';

export function OutputConfigurationPanel({
  outputFormat,
  sx,
}: OutputConfigurationPanelProps) {
  const { outputFormatProps } = useOutputConfigurationPanel({ outputFormat });

  return (
    <Box
      data-testid="output-configuration-panel"
      sx={getOutputConfigurationPanelRootStyles(sx)}
    >
      <OutputFormatSection {...outputFormatProps} />
      <Box component="section" sx={outputConfigurationPanelPlaceholderStyles}>
        <Typography component="span">File Splitting — coming soon</Typography>
      </Box>
      <Box component="section" sx={outputConfigurationPanelPlaceholderStyles}>
        <Typography component="span">File Naming Convention — coming soon</Typography>
      </Box>
    </Box>
  );
}
