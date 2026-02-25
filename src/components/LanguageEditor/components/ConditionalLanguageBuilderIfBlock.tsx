import { Box, TextField } from '@mui/material';

import { info } from '@gen2fund/platform.style';

import { LANGUAGE_EDITOR_LABELS } from '../constants';
import type { ConditionClause, FieldDefinition } from '../types';
import { ConditionalLanguageBuilderClauseRow } from './ConditionalLanguageBuilderClauseRow';

export interface ConditionalLanguageBuilderIfBlockProps {
  clause: ConditionClause;
  onClauseChange: (clause: ConditionClause) => void;
  fieldConfig: FieldDefinition[];
}

export function ConditionalLanguageBuilderIfBlock({
  clause,
  onClauseChange,
  fieldConfig,
}: ConditionalLanguageBuilderIfBlockProps) {
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
          bgcolor: info.light,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Box
          component="span"
          sx={{
            px: 1,
            py: 0.25,
            borderRadius: 0.5,
            bgcolor: info.dark,
            color: 'white',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {LANGUAGE_EDITOR_LABELS.CLB_IF_LABEL}
        </Box>
        <Box component="span" sx={{ fontSize: 14, fontWeight: 500 }}>
          {LANGUAGE_EDITOR_LABELS.CLB_IF_WHEN}
        </Box>
      </Box>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <ConditionalLanguageBuilderClauseRow
          clause={clause}
          onChange={onClauseChange}
          fieldConfig={fieldConfig}
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
