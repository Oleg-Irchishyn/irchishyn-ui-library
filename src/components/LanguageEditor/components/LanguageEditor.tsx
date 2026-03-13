import { useEffect } from 'react';
import { Box, IconButton, Paper, Typography } from '@mui/material';
import { X } from 'lucide-react';

import { LANGUAGE_EDITOR_LABELS } from '../constants';
import { useLanguageEditor } from '../hooks/useLanguageEditor';
import type { LanguageEditorProps } from '../types';
import { ConditionalLanguageBuilder } from './ConditionalLanguageBuilder';
import { LanguageEditorToolbar } from './LanguageEditorToolbar';
import {
  getLanguageEditorEditableAreaStyles,
  getLanguageEditorValidationBannerStyles,
  languageEditorPaperStyles,
  languageEditorValidationCloseButtonStyles,
  languageEditorValidationContentStyles,
  languageEditorValidationErrorItemStyles,
} from './styles';

export function LanguageEditor({
  fieldConfig,
  content,
  onChange,
  onValidate,
  readOnly = false,
  placeholder = LANGUAGE_EDITOR_LABELS.EDITOR_PLACEHOLDER,
  minHeight = '200px',
  embedded = false,
}: LanguageEditorProps) {
  const {
    editorRef,
    fieldDropdownAnchor,
    fieldDropdownOpen,
    showConditionBuilder,
    validationResult,
    handleInput,
    handleBlur,
    handleBold,
    handleItalic,
    handleUnderline,
    handleInsertFieldMouseDown,
    handleInsertFieldClick,
    handleFieldDropdownClose,
    handleInsertField,
    handleConditionalClick,
    handleConditionalClose,
    handleInsertConditional,
    handleValidateClick,
    handleClearValidation,
    syncEditorContent,
  } = useLanguageEditor({
    content,
    onChange,
    onValidate,
    fieldConfig,
    readOnly,
  });

  useEffect(() => {
    syncEditorContent();
  }, [syncEditorContent]);

  return (
    <Paper variant="outlined" sx={languageEditorPaperStyles}>
      <LanguageEditorToolbar
        onBold={handleBold}
        onItalic={handleItalic}
        onUnderline={handleUnderline}
        onInsertFieldMouseDown={handleInsertFieldMouseDown}
        onInsertFieldClick={handleInsertFieldClick}
        onConditionalClick={handleConditionalClick}
        onValidateClick={handleValidateClick}
        fieldDropdownAnchor={fieldDropdownAnchor}
        fieldDropdownOpen={fieldDropdownOpen}
        onFieldDropdownClose={handleFieldDropdownClose}
        onInsertField={handleInsertField}
        fieldConfig={fieldConfig}
        validationResult={validationResult}
        disabled={readOnly}
        showConditionalButton={!embedded}
        showValidateButton={!embedded}
      />

      {validationResult && (
        <Box sx={getLanguageEditorValidationBannerStyles(validationResult.valid)}>
          <Box sx={languageEditorValidationContentStyles}>
            {validationResult.valid ? (
              <Typography variant="body2" color="success.dark">
                {LANGUAGE_EDITOR_LABELS.VALIDATION_PASSED}
              </Typography>
            ) : (
              <Box>
                <Typography variant="body2" fontWeight={600} color="error.dark">
                  {LANGUAGE_EDITOR_LABELS.VALIDATION_ERRORS}
                </Typography>
                {validationResult.errors?.map((error, index) => (
                  <Typography
                    key={index}
                    variant="body2"
                    color="error.dark"
                    sx={languageEditorValidationErrorItemStyles}
                  >
                    • {error.message}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
          <IconButton
            size="small"
            onClick={handleClearValidation}
            sx={languageEditorValidationCloseButtonStyles}
          >
            <X size={16} />
          </IconButton>
        </Box>
      )}

      <Box
        ref={editorRef}
        contentEditable={!readOnly}
        suppressContentEditableWarning
        onInput={readOnly ? undefined : handleInput}
        onBlur={readOnly ? undefined : handleBlur}
        data-placeholder={placeholder}
        sx={(muiTheme) => ({
          ...(getLanguageEditorEditableAreaStyles(minHeight, readOnly) as Record<string, unknown>),
          '--language-editor-token-text': muiTheme.palette.text.primary,
        })}
      />

      {!readOnly && !embedded && (
        <ConditionalLanguageBuilder
          open={showConditionBuilder}
          onClose={handleConditionalClose}
          fieldConfig={fieldConfig}
          onInsertConditional={handleInsertConditional}
        />
      )}
    </Paper>
  );
}
