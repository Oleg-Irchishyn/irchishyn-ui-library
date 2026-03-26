import { Box, Button, Link, Popover, Tab, Tabs, TextField, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import { FileEdit, FileInput, Plus, RotateCcw } from 'lucide-react';

import { ActionButton } from '../ActionButton';
import { Badge } from '../Badge';
import {
  ADD_BUTTON_LABEL,
  ADD_SEGMENT_STATIC_LABEL,
  ADD_SEGMENT_STATIC_PLACEHOLDER,
  ADD_SEGMENT_SUBTITLE,
  ADD_SEGMENT_TAB_STATIC,
  ADD_SEGMENT_TAB_VARIABLE,
  ADD_SEGMENT_TITLE,
  ADD_STATIC_BUTTON_LABEL,
  FILE_NAMING_POPOVER_VARIABLE_LIST_HEIGHT,
  FILE_NAMING_SECTION_ICON_SIZE,
  FILE_NAMING_SECTION_TITLE,
  FILE_NAMING_SUBTITLE_CONSOLIDATED,
  FILE_NAMING_TOKEN_ICON_SIZE,
  FILE_NAME_STRUCTURE_LABEL,
  PREVIEW_LABEL,
  RESET_LABEL,
} from './constants';
import {
  getFileNamingSectionStyles,
  getFileNamingSectionHeadingRowStyles,
  getFileNamingSectionHeadingStyles,
  getFileNamingSectionSubtitleStyles,
  getFileNamingSectionIconStyles,
  getFileNamingPreviewBoxStyles,
  getFileNamingPreviewTextStyles,
  getFileNamingStructureLabelRowStyles,
  getFileNamingStructureLabelStyles,
  getFileNamingStructureBoxStyles,
  getFileNamingTokensRowStyles,
  getFileNamingVariableTagStyles,
  getFileNamingStaticTagStyles,
  getFileNamingResetLinkStyles,
} from './FileNamingSection.styles';
import { getTokenDisplayLabel } from './FileNamingSection.utils';
import type { AddSegmentTab, FileNamingSectionProps, FileNamingVariable } from './types';

export function FileNamingSection({
  tokens,
  availableVariables,
  onTokensChange,
  onReset,
  previewFileNames,
  subtitle,
  variableExamples = {},
  sx,
}: FileNamingSectionProps) {
  const [addAnchorEl, setAddAnchorEl] = useState<null | HTMLElement>(null);
  const [addSegmentTab, setAddSegmentTab] = useState<AddSegmentTab>(ADD_SEGMENT_TAB_VARIABLE);
  const [newStaticText, setNewStaticText] = useState('');
  const addButtonRef = useRef<HTMLSpanElement>(null);

  const handleAddClick = () => {
    if (addButtonRef.current) {
      setAddAnchorEl(addButtonRef.current);
    }
    setAddSegmentTab(ADD_SEGMENT_TAB_VARIABLE);
    setNewStaticText('');
  };

  const handleAddClose = () => {
    setAddAnchorEl(null);
    setNewStaticText('');
  };

  const handleRemoveToken = (index: number) => {
    const next = tokens.filter((_, i) => i !== index);
    onTokensChange(next);
  };

  const handleAddVariable = (variable: FileNamingVariable) => {
    onTokensChange([...tokens, { type: 'variable', value: variable.value }]);
    handleAddClose();
  };

  const handleAddStatic = (value: string) => {
    onTokensChange([...tokens, { type: 'static', value }]);
    handleAddClose();
  };

  const handleAddStaticFromInput = () => {
    if (newStaticText.trim()) {
      handleAddStatic(newStaticText.trim());
      setNewStaticText('');
    }
  };

  return (
    <Box
      component="section"
      data-testid="file-naming-section"
      aria-labelledby="file-naming-heading"
      sx={[getFileNamingSectionStyles(), ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
    >
      <Box component="div" sx={getFileNamingSectionHeadingRowStyles()}>
        <Box component="span" sx={getFileNamingSectionIconStyles()} aria-hidden>
          <FileEdit size={FILE_NAMING_SECTION_ICON_SIZE} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <Typography
            id="file-naming-heading"
            component="h3"
            variant="subtitle1"
            sx={getFileNamingSectionHeadingStyles()}
          >
            {FILE_NAMING_SECTION_TITLE}
          </Typography>
          <Typography component="span" sx={getFileNamingSectionSubtitleStyles()}>
            {subtitle ?? FILE_NAMING_SUBTITLE_CONSOLIDATED}
          </Typography>
        </Box>
      </Box>

      <Typography
        component="span"
        variant="caption"
        sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}
      >
        {PREVIEW_LABEL}
      </Typography>
      <Box sx={getFileNamingPreviewBoxStyles()} data-testid="file-naming-preview-box">
        <Typography
          component="span"
          variant="body2"
          sx={getFileNamingPreviewTextStyles()}
          data-testid="file-naming-preview"
        >
          {previewFileNames.length > 0 ? previewFileNames.join(', ') : '—'}
        </Typography>
      </Box>

      <Box sx={getFileNamingStructureLabelRowStyles()}>
        <Typography component="span" variant="body2" sx={getFileNamingStructureLabelStyles()}>
          {FILE_NAME_STRUCTURE_LABEL}
        </Typography>
        <Link
          component="button"
          type="button"
          variant="body2"
          onClick={onReset}
          sx={getFileNamingResetLinkStyles()}
          data-testid="file-naming-reset"
          aria-label={RESET_LABEL}
        >
          <RotateCcw size={14} aria-hidden />
          {RESET_LABEL}
        </Link>
      </Box>
      <Box sx={getFileNamingStructureBoxStyles()} data-testid="file-naming-structure-box">
        <Box sx={getFileNamingTokensRowStyles()}>
          {tokens.map((token, index) => (
            <Badge
              key={`${token.type}-${token.value}-${index}`}
              label={getTokenDisplayLabel(token, availableVariables)}
              size="small"
              variant={token.type === 'variable' ? 'filled' : 'outlined'}
              color={token.type === 'variable' ? 'info' : 'default'}
              icon={
                token.type === 'variable' ? (
                  <FileInput size={FILE_NAMING_TOKEN_ICON_SIZE} aria-hidden />
                ) : undefined
              }
              onDelete={() => handleRemoveToken(index)}
              data-testid={`file-naming-token-${index}`}
              sx={
                token.type === 'variable'
                  ? getFileNamingVariableTagStyles()
                  : getFileNamingStaticTagStyles()
              }
            />
          ))}
          <span
            ref={addButtonRef}
            onClick={handleAddClick}
            data-testid="file-naming-add-button"
            aria-haspopup="dialog"
            aria-expanded={Boolean(addAnchorEl)}
            style={{ display: 'inline-flex' }}
          >
            <ActionButton
              variant="secondary"
              label={ADD_BUTTON_LABEL}
              icon={<Plus size={14} aria-hidden />}
              size="small"
            />
          </span>
        </Box>
      </Box>

      <Popover
        open={Boolean(addAnchorEl)}
        anchorEl={addAnchorEl}
        onClose={handleAddClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: { width: 320, maxWidth: 'calc(100vw - 24px)', p: 0 },
          },
        }}
      >
        <Box
          sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}
          data-testid="file-naming-add-popover"
        >
          <Typography variant="subtitle2" component="div" sx={{ fontWeight: 600 }}>
            {ADD_SEGMENT_TITLE}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {ADD_SEGMENT_SUBTITLE}
          </Typography>
        </Box>
        <Box sx={{ p: 1.5 }}>
          <Tabs
            value={addSegmentTab}
            onChange={(_, v) => setAddSegmentTab(v as AddSegmentTab)}
            sx={{
              minHeight: 36,
              '& .MuiTab-root': {
                minHeight: 36,
                py: 0,
                textTransform: 'none',
                fontSize: '0.75rem',
              },
            }}
          >
            <Tab
              value={ADD_SEGMENT_TAB_VARIABLE}
              label="Variable"
              data-testid="add-segment-tab-variable"
            />
            <Tab
              value={ADD_SEGMENT_TAB_STATIC}
              label="Static Text"
              data-testid="add-segment-tab-static"
            />
          </Tabs>

          {addSegmentTab === ADD_SEGMENT_TAB_VARIABLE && (
            <Box
              sx={{
                mt: 1.5,
                maxHeight: FILE_NAMING_POPOVER_VARIABLE_LIST_HEIGHT,
                overflow: 'auto',
              }}
              data-testid="add-segment-variable-list"
            >
              {availableVariables.map((variable) => {
                const example = variableExamples[variable.value] ?? variable.value;
                return (
                  <Box
                    key={variable.value}
                    component="button"
                    type="button"
                    onClick={() => handleAddVariable(variable)}
                    data-testid={`file-naming-add-variable-${variable.value}`}
                    sx={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      px: 1.5,
                      py: 1.25,
                      border: 0,
                      borderRadius: 1,
                      cursor: 'pointer',
                      bgcolor: 'transparent',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {variable.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Example: {example}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          )}

          {addSegmentTab === ADD_SEGMENT_TAB_STATIC && (
            <Box sx={{ mt: 1.5 }} data-testid="add-segment-static-content">
              <Typography
                variant="caption"
                color="text.secondary"
                component="label"
                sx={{ display: 'block', mb: 0.5 }}
              >
                {ADD_SEGMENT_STATIC_LABEL}
              </Typography>
              <TextField
                size="small"
                fullWidth
                placeholder={ADD_SEGMENT_STATIC_PLACEHOLDER}
                value={newStaticText}
                onChange={(e) => setNewStaticText(e.target.value)}
                inputProps={{ 'data-testid': 'file-naming-static-input' }}
                sx={{ mb: 1.5 }}
              />
              <Button
                size="small"
                variant="contained"
                fullWidth
                disabled={!newStaticText.trim()}
                onClick={handleAddStaticFromInput}
                data-testid="add-segment-add-static"
              >
                {ADD_STATIC_BUTTON_LABEL}
              </Button>
            </Box>
          )}
        </Box>
      </Popover>
    </Box>
  );
}
