import { Box, Button, Divider, IconButton, Tooltip } from '@mui/material';
import { Bold, CheckCircle, Code, Hash, Italic, Underline } from 'lucide-react';

import { LANGUAGE_EDITOR_LABELS } from '../constants';
import type { LanguageEditorToolbarProps } from '../types';
import { FieldInsertDropdown } from './FieldInsertDropdown';

export function LanguageEditorToolbar({
  onBold,
  onItalic,
  onUnderline,
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
}: LanguageEditorToolbarProps) {
  const getValidateButtonColor = () => {
    if (!validationResult) return 'inherit';
    return validationResult.valid ? 'success' : 'error';
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        p: 1,
        borderBottom: 1,
        borderColor: 'divider',
        backgroundColor: 'grey.50',
        flexWrap: 'wrap',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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

      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

      <Button
        size="small"
        variant="outlined"
        startIcon={<Hash size={16} />}
        onClick={onInsertFieldClick}
        disabled={disabled}
        sx={{ textTransform: 'none', fontSize: 13 }}
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

      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

      <Button
        size="small"
        variant="outlined"
        startIcon={<Code size={16} />}
        onClick={onConditionalClick}
        disabled={disabled}
        sx={{ textTransform: 'none', fontSize: 13 }}
      >
        {LANGUAGE_EDITOR_LABELS.TOOLBAR_CONDITIONAL}
      </Button>

      <Box sx={{ flex: 1 }} />

      <Tooltip title={LANGUAGE_EDITOR_LABELS.TOOLBAR_VALIDATE}>
        <span>
          <Button
            size="small"
            variant="outlined"
            color={getValidateButtonColor()}
            startIcon={<CheckCircle size={16} />}
            onClick={onValidateClick}
            disabled={disabled}
            sx={{ textTransform: 'none', fontSize: 13 }}
          >
            {LANGUAGE_EDITOR_LABELS.TOOLBAR_VALIDATE}
          </Button>
        </span>
      </Tooltip>
    </Box>
  );
}
