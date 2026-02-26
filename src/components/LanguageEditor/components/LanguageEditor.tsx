import { useEffect } from 'react';
import { Box, IconButton, Paper, Typography } from '@mui/material';
import { X } from 'lucide-react';

import { LANGUAGE_EDITOR_LABELS } from '../constants';
import { useLanguageEditor } from '../hooks/useLanguageEditor';
import type { LanguageEditorProps } from '../types';
import { ConditionalLanguageBuilder } from './ConditionalLanguageBuilder';
import { LanguageEditorToolbar } from './LanguageEditorToolbar';

export function LanguageEditor({
  fieldConfig,
  content,
  onChange,
  onValidate,
  readOnly = false,
  placeholder = LANGUAGE_EDITOR_LABELS.EDITOR_PLACEHOLDER,
  minHeight = '200px',
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
    handleInsertFieldClick,
    handleFieldDropdownClose,
    handleInsertField,
    handleConditionalClick,
    handleConditionalClose,
    handleInsertConditional,
    handleValidateClick,
    handleClearValidation,
    getFormattedContent,
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

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = getFormattedContent();
    }
  }, []);

  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      {!readOnly && (
        <LanguageEditorToolbar
          onBold={handleBold}
          onItalic={handleItalic}
          onUnderline={handleUnderline}
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
        />
      )}

      {validationResult && (
        <Box
          sx={{
            px: 2,
            py: 1,
            borderBottom: 1,
            borderColor: 'divider',
            backgroundColor: validationResult.valid ? 'success.light' : 'error.light',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1,
          }}
        >
          <Box sx={{ flex: 1 }}>
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
                  <Typography key={index} variant="body2" color="error.dark" sx={{ ml: 1 }}>
                    • {error.message}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
          <IconButton size="small" onClick={handleClearValidation} sx={{ mt: -0.5 }}>
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
        sx={{
          p: 2,
          minHeight,
          outline: 'none',
          cursor: readOnly ? 'default' : 'text',
          '&:empty::before': {
            content: 'attr(data-placeholder)',
            color: 'text.secondary',
            fontStyle: 'italic',
          },
          '& b, & strong': {
            fontWeight: 700,
          },
          '& i, & em': {
            fontStyle: 'italic',
          },
          '& u': {
            textDecoration: 'underline',
          },
        }}
      />

      {!readOnly && (
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
