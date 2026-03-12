import { Box, Button, Divider, IconButton, Tooltip } from '@mui/material';
import { Bold, CheckCircle, Code, Hash, Italic, Underline } from 'lucide-react';

import { LANGUAGE_EDITOR_LABELS } from '../constants';
import type { LanguageEditorToolbarProps } from '../types';
import { FieldInsertDropdown } from './FieldInsertDropdown';
import {
  languageEditorToolbarActionButtonStyles,
  languageEditorToolbarButtonsGroupStyles,
  languageEditorToolbarDividerStyles,
  languageEditorToolbarSpacerStyles,
  languageEditorToolbarStyles,
} from './styles';

export function LanguageEditorToolbar({
  onBold,
  onItalic,
  onUnderline,
  onInsertFieldMouseDown,
  onInsertFieldClick,
  onConditionalClick,
  onValidateClick,
  fieldDropdownAnchor,
  fieldDropdownOpen,
  onFieldDropdownClose,
  onInsertField,
  fieldConfig,
  validationResult,
  disabled = false,
  showConditionalButton = true,
  showValidateButton = true,
}: LanguageEditorToolbarProps) {
  const getValidateButtonColor = () => {
    if (!validationResult) return 'inherit';
    return validationResult.valid ? 'success' : 'error';
  };

  return (
    <Box sx={languageEditorToolbarStyles}>
      <Box sx={languageEditorToolbarButtonsGroupStyles}>
        <Tooltip title={LANGUAGE_EDITOR_LABELS.TOOLBAR_BOLD}>
          <span>
            <IconButton size="small" onClick={onBold} disabled={disabled}>
              <Bold size={18} />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title={LANGUAGE_EDITOR_LABELS.TOOLBAR_ITALIC}>
          <span>
            <IconButton size="small" onClick={onItalic} disabled={disabled}>
              <Italic size={18} />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title={LANGUAGE_EDITOR_LABELS.TOOLBAR_UNDERLINE}>
          <span>
            <IconButton size="small" onClick={onUnderline} disabled={disabled}>
              <Underline size={18} />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      <Divider orientation="vertical" flexItem sx={languageEditorToolbarDividerStyles} />

      <Button
        size="small"
        variant="outlined"
        startIcon={<Hash size={16} />}
        onMouseDown={onInsertFieldMouseDown}
        onClick={onInsertFieldClick}
        disabled={disabled}
        sx={languageEditorToolbarActionButtonStyles}
      >
        {LANGUAGE_EDITOR_LABELS.TOOLBAR_INSERT_FIELD}
      </Button>

      <FieldInsertDropdown
        fieldConfig={fieldConfig}
        anchorEl={fieldDropdownAnchor}
        open={fieldDropdownOpen}
        onClose={onFieldDropdownClose}
        onInsertField={onInsertField}
      />

      {showConditionalButton && (
        <>
          <Divider orientation="vertical" flexItem sx={languageEditorToolbarDividerStyles} />
          <Button
            size="small"
            variant="outlined"
            startIcon={<Code size={16} />}
            onClick={onConditionalClick}
            disabled={disabled}
            sx={languageEditorToolbarActionButtonStyles}
          >
            {LANGUAGE_EDITOR_LABELS.TOOLBAR_CONDITIONAL}
          </Button>
        </>
      )}

      {showValidateButton && (
        <>
          <Box sx={languageEditorToolbarSpacerStyles} />
          <Tooltip title={LANGUAGE_EDITOR_LABELS.TOOLBAR_VALIDATE}>
            <span>
              <Button
                size="small"
                variant="outlined"
                color={getValidateButtonColor()}
                startIcon={<CheckCircle size={16} />}
                onClick={onValidateClick}
                disabled={disabled}
                sx={languageEditorToolbarActionButtonStyles}
              >
                {LANGUAGE_EDITOR_LABELS.TOOLBAR_VALIDATE}
              </Button>
            </span>
          </Tooltip>
        </>
      )}
    </Box>
  );
}
