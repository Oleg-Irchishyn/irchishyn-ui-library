import { Box, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { Split } from 'lucide-react';

import type { FileSplittingSectionProps, SplitMode } from './types';
import {
  getFileSplittingSectionStyles,
  getFileSplittingSectionHeadingRowStyles,
  getFileSplittingSectionHeadingStyles,
  getFileSplittingSectionIconStyles,
  getFileSplittingOptionsRowStyles,
  getFileSplittingOptionCardStyles,
} from './FileSplittingSection.styles';
import { DEFAULT_FILE_SPLITTING_OPTIONS } from './constants';

const SECTION_TITLE = 'File Splitting';

const FILE_SPLITTING_ICON_SIZE = 20;

export function FileSplittingSection({
  splitMode,
  onSplitModeChange,
  sx,
}: FileSplittingSectionProps) {
  return (
    <Box
      component="section"
      data-testid="file-splitting-section"
      aria-labelledby="file-splitting-heading"
      sx={[getFileSplittingSectionStyles(), ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
    >
      <Box component="div" sx={getFileSplittingSectionHeadingRowStyles()}>
        <Box component="span" sx={getFileSplittingSectionIconStyles()} aria-hidden>
          <Split size={FILE_SPLITTING_ICON_SIZE} />
        </Box>
        <Typography
          id="file-splitting-heading"
          component="h3"
          variant="subtitle1"
          sx={getFileSplittingSectionHeadingStyles()}
        >
          {SECTION_TITLE}
        </Typography>
      </Box>
      <RadioGroup
        role="radiogroup"
        aria-labelledby="file-splitting-heading"
        value={splitMode}
        onChange={(_, value) => onSplitModeChange(value as SplitMode)}
        sx={getFileSplittingOptionsRowStyles()}
      >
        {DEFAULT_FILE_SPLITTING_OPTIONS.map((option) => (
          <Box
            key={option.value}
            sx={getFileSplittingOptionCardStyles()}
            data-testid={`file-splitting-option-${option.value}`}
          >
            <FormControlLabel
              value={option.value}
              control={
                <Radio
                  data-testid={`file-splitting-radio-${option.value}`}
                  inputProps={{
                    'aria-label': `${option.title}, ${option.description}`,
                  }}
                />
              }
              label={
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ fontWeight: 500, color: 'text.primary', display: 'block' }}
                  >
                    {option.title}
                  </Typography>
                  <Typography
                    component="span"
                    variant="caption"
                    display="block"
                    sx={{ color: 'text.secondary', mt: 0.25 }}
                  >
                    {option.description}
                  </Typography>
                </Box>
              }
              sx={{ margin: 0, alignItems: 'flex-start' }}
            />
          </Box>
        ))}
      </RadioGroup>
    </Box>
  );
}
