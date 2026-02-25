import { Box, TextField } from '@mui/material';

import { neutral } from '@gen2fund/platform.style';

import { LANGUAGE_EDITOR_LABELS } from '../constants';

export interface ConditionalLanguageBuilderElseBlockProps {
  content: string;
  onContentChange: (content: string) => void;
}

export function ConditionalLanguageBuilderElseBlock({
  content,
  onContentChange,
}: ConditionalLanguageBuilderElseBlockProps) {
  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1,
          bgcolor: neutral[200],
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box component="span" sx={{ fontSize: 14, fontWeight: 500 }}>
          {LANGUAGE_EDITOR_LABELS.CLB_ELSE_LABEL} — {LANGUAGE_EDITOR_LABELS.CLB_ELSE_WHEN}
        </Box>
      </Box>
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          multiline
          minRows={2}
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder={LANGUAGE_EDITOR_LABELS.CLB_CONTENT_PLACEHOLDER}
          size="small"
        />
      </Box>
    </Box>
  );
}
