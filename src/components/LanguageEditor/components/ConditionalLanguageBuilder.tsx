import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import { CheckCircle, Code, Plus, X } from 'lucide-react';

import { LANGUAGE_EDITOR_LABELS } from '../constants';
import type { ConditionalLanguageBuilderProps } from '../types';
import { useConditionalLanguageBuilder } from '../useConditionalLanguageBuilder';
import { ConditionalLanguageBuilderElseBlock } from './ConditionalLanguageBuilderElseBlock';
import { ConditionalLanguageBuilderElseIfBlock } from './ConditionalLanguageBuilderElseIfBlock';
import { ConditionalLanguageBuilderIfBlock } from './ConditionalLanguageBuilderIfBlock';
import {
  getLanguageEditorValidationBannerStyles,
  languageEditorDialogActionsStyles,
  languageEditorDialogContentStyles,
  languageEditorDialogDescriptionStyles,
  languageEditorDialogHeaderSectionStyles,
  languageEditorDialogPaperStyles,
  languageEditorDialogScrollAreaStyles,
  languageEditorDialogTitleStyles,
  languageEditorDialogValidationSectionStyles,
  languageEditorValidationCloseButtonStyles,
  languageEditorValidationContentStyles,
  languageEditorValidationErrorItemStyles,
} from './styles';

export function ConditionalLanguageBuilder({
  open,
  onClose,
  fieldConfig,
  onInsertConditional,
}: ConditionalLanguageBuilderProps) {
  const {
    ifClause,
    setIfClause,
    elseIfClauses,
    includeElse,
    setIncludeElse,
    elseContent,
    setElseContent,
    handleClose,
    handleInsert,
    addElseIf,
    removeElseIf,
    updateElseIf,
    canInsert,
    validationResult,
    handleValidateClick,
    handleClearValidation,
  } = useConditionalLanguageBuilder({
    fieldConfig,
    onClose,
    onInsertConditional,
  });

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: languageEditorDialogPaperStyles }}
      scroll="paper"
    >
      {/* POC: DialogHeader flex-shrink-0 — title + description */}
      <Box sx={languageEditorDialogHeaderSectionStyles}>
        <DialogTitle sx={{ ...languageEditorDialogTitleStyles, p: 0, pb: 1 }}>
          <Code size={22} />
          {LANGUAGE_EDITOR_LABELS.CLB_TITLE}
        </DialogTitle>
        <Typography component="p" sx={languageEditorDialogDescriptionStyles}>
          {LANGUAGE_EDITOR_LABELS.CLB_DESCRIPTION}
        </Typography>
      </Box>

      {/* POC: single flex column — scroll region (flex-1 min-h-0) then validation (flex-shrink-0) */}
      <DialogContent sx={languageEditorDialogContentStyles}>
        {/* POC: div.flex-1.overflow-y-auto.pr-4.min-h-0 — only blocks scroll */}
        <Box sx={languageEditorDialogScrollAreaStyles}>
          <ConditionalLanguageBuilderIfBlock
            clause={ifClause}
            onClauseChange={setIfClause}
            fieldConfig={fieldConfig}
          />

          {elseIfClauses.map((clause, index) => (
            <ConditionalLanguageBuilderElseIfBlock
              key={index}
              clause={clause}
              onClauseChange={(c) => updateElseIf(index, c)}
              fieldConfig={fieldConfig}
              onRemove={() => removeElseIf(index)}
            />
          ))}

          <Button startIcon={<Plus size={18} />} variant="outlined" onClick={addElseIf} fullWidth>
            {LANGUAGE_EDITOR_LABELS.CLB_ADD_ELSE_IF}
          </Button>

          <ConditionalLanguageBuilderElseBlock
            includeElse={includeElse}
            onIncludeElseChange={setIncludeElse}
            content={elseContent}
            onContentChange={setElseContent}
            fieldConfig={fieldConfig}
          />
        </Box>

        {/* POC: validation after scroll div, before footer */}
        {validationResult && (
          <Box sx={languageEditorDialogValidationSectionStyles}>
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
                aria-label="Clear validation"
              >
                <X size={16} />
              </IconButton>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          ...languageEditorDialogActionsStyles,
          justifyContent: 'space-between',
          flexShrink: 0,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Button
          size="small"
          variant="outlined"
          startIcon={<CheckCircle size={18} />}
          onClick={handleValidateClick}
        >
          {LANGUAGE_EDITOR_LABELS.TOOLBAR_VALIDATE}
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={handleClose}>{LANGUAGE_EDITOR_LABELS.CLB_CANCEL}</Button>
          <Button variant="contained" onClick={handleInsert} disabled={!canInsert}>
            {LANGUAGE_EDITOR_LABELS.CLB_INSERT}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
