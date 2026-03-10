import { Box, Checkbox, FormControlLabel, FormHelperText, Typography } from '@mui/material';
import type { ChangeEvent } from 'react';

import type { OutputFormatSectionProps } from './types';
import {
  getOutputFormatSectionStyles,
  getOutputFormatSectionHeadingStyles,
  getOutputFormatOptionsRowStyles,
  getOutputFormatOptionCardStyles,
  getOutputFormatFormControlLabelStyles,
  getOutputFormatOptionLabelWrapperStyles,
  getOutputFormatOptionIconStyles,
  getOutputFormatErrorStyles,
} from './OutputFormatSection.styles';
import { useOutputFormatSection } from './useOutputFormatSection';

const SECTION_TITLE = 'Output Format';

export function OutputFormatSection({
  formats,
  selectedFormats,
  onFormatsChange,
  minSelected = 1,
  error,
  helperText,
  sx,
}: OutputFormatSectionProps) {
  const { handleChange, displayError } = useOutputFormatSection({
    selectedFormats,
    onFormatsChange,
    minSelected,
    error,
  });

  return (
    <Box
      component="section"
      data-testid="output-format-section"
      aria-labelledby="output-format-heading"
      aria-describedby={
        displayError != null || helperText != null ? 'output-format-helper' : undefined
      }
      sx={[getOutputFormatSectionStyles(), ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
    >
      <Typography
        id="output-format-heading"
        component="h3"
        variant="subtitle1"
        sx={getOutputFormatSectionHeadingStyles()}
      >
        {SECTION_TITLE}
      </Typography>
      <Box role="group" aria-label={SECTION_TITLE} sx={getOutputFormatOptionsRowStyles()}>
        {formats.map((format) => {
          const isChecked = selectedFormats.includes(format.id);
          return (
            <Box
              key={format.id}
              sx={getOutputFormatOptionCardStyles()}
              data-testid={`output-format-option-${format.id}`}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isChecked}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange(format.id, e.target.checked)
                    }
                    inputProps={{
                      'aria-label': `${format.label}${format.description ? `, ${format.description}` : ''}`,
                    }}
                    data-testid={`output-format-checkbox-${format.id}`}
                  />
                }
                label={
                  <Box sx={getOutputFormatOptionLabelWrapperStyles()}>
                    {format.icon != null ? (
                      <Box sx={getOutputFormatOptionIconStyles(format.iconColor)} aria-hidden>
                        {format.icon}
                      </Box>
                    ) : null}
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{ fontWeight: 500, color: 'text.primary' }}
                      >
                        {format.label}
                      </Typography>
                      {format.description ? (
                        <Typography
                          component="span"
                          variant="caption"
                          display="block"
                          sx={{ color: 'text.secondary', mt: 0.25 }}
                        >
                          {format.description}
                        </Typography>
                      ) : null}
                    </Box>
                  </Box>
                }
                sx={getOutputFormatFormControlLabelStyles()}
              />
            </Box>
          );
        })}
      </Box>
      {(displayError != null || helperText != null) && (
        <FormHelperText
          component="div"
          error={displayError != null}
          id="output-format-helper"
          role={displayError != null ? 'alert' : undefined}
          sx={displayError != null ? getOutputFormatErrorStyles() : undefined}
        >
          {displayError ?? helperText}
        </FormHelperText>
      )}
    </Box>
  );
}
