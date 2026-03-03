import { Box, TextField } from '@mui/material';

import { LANGUAGE_EDITOR_LABELS } from '../constants';
import {
  languageEditorElseBlockHeaderStyles,
  languageEditorElseBodyStyles,
  languageEditorIfElseBlockRootStyles,
  languageEditorIfElseHeaderTextStyles,
} from './styles';

export interface ConditionalLanguageBuilderElseBlockProps {
  content: string;
  onContentChange: (content: string) => void;
}

export function ConditionalLanguageBuilderElseBlock({
  content,
  onContentChange,
}: ConditionalLanguageBuilderElseBlockProps) {
  return (
    <Box sx={languageEditorIfElseBlockRootStyles}>
      <Box sx={languageEditorElseBlockHeaderStyles}>
        <Box component="span" sx={languageEditorIfElseHeaderTextStyles}>
          {LANGUAGE_EDITOR_LABELS.CLB_ELSE_LABEL} — {LANGUAGE_EDITOR_LABELS.CLB_ELSE_WHEN}
        </Box>
      </Box>
      <Box sx={languageEditorElseBodyStyles}>
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
