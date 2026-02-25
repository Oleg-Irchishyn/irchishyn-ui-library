import { Box, Button, TextField } from '@mui/material';
import { X } from 'lucide-react';

import { primary } from '@gen2fund/platform.style';

import { LANGUAGE_EDITOR_LABELS } from '../constants';
import type { ConditionClause, FieldDefinition } from '../types';
import { ConditionalLanguageBuilderClauseRow } from './ConditionalLanguageBuilderClauseRow';

export interface ConditionalLanguageBuilderElseIfBlockProps {
  clause: ConditionClause;
  onClauseChange: (clause: ConditionClause) => void;
  fieldConfig: FieldDefinition[];
  onRemove: () => void;
}

export function ConditionalLanguageBuilderElseIfBlock({
  clause,
  onClauseChange,
  fieldConfig,
  onRemove,
}: ConditionalLanguageBuilderElseIfBlockProps) {
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
          bgcolor: primary.light,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            component="span"
            sx={{
              px: 1,
              py: 0.25,
              borderRadius: 0.5,
              bgcolor: primary.dark,
              color: 'white',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {LANGUAGE_EDITOR_LABELS.CLB_ELSE_IF_LABEL}
          </Box>
          <Box component="span" sx={{ fontSize: 14, fontWeight: 500 }}>
            {LANGUAGE_EDITOR_LABELS.CLB_ELSE_IF_WHEN}
          </Box>
        </Box>
        <Button size="small" onClick={onRemove} aria-label="Remove else if">
          <X size={18} />
        </Button>
      </Box>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <ConditionalLanguageBuilderClauseRow
          clause={clause}
          onChange={onClauseChange}
          fieldConfig={fieldConfig}
          onRemove={onRemove}
          showRemove
        />
        <Box>
          <Box
            component="label"
            sx={{ fontSize: 12, color: 'text.secondary', display: 'block', mb: 0.5 }}
          >
            {LANGUAGE_EDITOR_LABELS.CLB_CONTENT_LABEL}
          </Box>
          <TextField
            fullWidth
            multiline
            minRows={2}
            value={clause.content}
            onChange={(e) => onClauseChange({ ...clause, content: e.target.value })}
            placeholder={LANGUAGE_EDITOR_LABELS.CLB_CONTENT_PLACEHOLDER}
            size="small"
          />
        </Box>
      </Box>
    </Box>
  );
}
