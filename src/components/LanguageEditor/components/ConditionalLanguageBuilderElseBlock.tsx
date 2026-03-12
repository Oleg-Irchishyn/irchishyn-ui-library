import { Box, Button } from '@mui/material';

import { LANGUAGE_EDITOR_LABELS } from '../constants';
import type { ConditionalLanguageBuilderElseBlockProps } from '../types';
import { LanguageEditor } from './LanguageEditor';
import {
  languageEditorElseBlockDisabledButtonStyles,
  languageEditorElseBlockEnabledButtonStyles,
  languageEditorElseBlockHeaderStyles,
  languageEditorElseBodyStyles,
  languageEditorIfElseBlockRootStyles,
  languageEditorIfElseHeaderTextStyles,
} from './styles';

export type { ConditionalLanguageBuilderElseBlockProps };

export function ConditionalLanguageBuilderElseBlock({
  includeElse,
  onIncludeElseChange,
  content,
  onContentChange,
  fieldConfig,
}: ConditionalLanguageBuilderElseBlockProps) {
  return (
    <Box sx={languageEditorIfElseBlockRootStyles}>
      <Box sx={languageEditorElseBlockHeaderStyles}>
        <Box component="span" sx={languageEditorIfElseHeaderTextStyles}>
          {LANGUAGE_EDITOR_LABELS.CLB_ELSE_LABEL} — {LANGUAGE_EDITOR_LABELS.CLB_ELSE_WHEN}
        </Box>
        <Button
          size="small"
          variant={includeElse ? 'contained' : 'outlined'}
          onClick={() => onIncludeElseChange(!includeElse)}
          sx={
            includeElse
              ? languageEditorElseBlockEnabledButtonStyles
              : languageEditorElseBlockDisabledButtonStyles
          }
        >
          {includeElse
            ? LANGUAGE_EDITOR_LABELS.CLB_ELSE_ENABLED
            : LANGUAGE_EDITOR_LABELS.CLB_ELSE_DISABLED}
        </Button>
      </Box>
      {includeElse && (
        <Box sx={languageEditorElseBodyStyles}>
          <Box component="label" sx={{ display: 'block', mb: 1, fontSize: 14, fontWeight: 500 }}>
            {LANGUAGE_EDITOR_LABELS.CLB_CONTENT_LABEL}
          </Box>
          <LanguageEditor
            fieldConfig={fieldConfig}
            content={content}
            onChange={onContentChange}
            placeholder={LANGUAGE_EDITOR_LABELS.CLB_CONTENT_PLACEHOLDER}
            minHeight="120px"
            embedded
          />
        </Box>
      )}
    </Box>
  );
}
