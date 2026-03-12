import { Box, Button } from '@mui/material';
import { X } from 'lucide-react';

import { LANGUAGE_EDITOR_LABELS } from '../constants';
import type { ConditionClause, FieldDefinition } from '../types';
import { ConditionalLanguageBuilderClauseRow } from './ConditionalLanguageBuilderClauseRow';
import { LanguageEditor } from './LanguageEditor';
import {
  languageEditorContentLabelStyles,
  languageEditorElseIfBlockHeaderStyles,
  languageEditorElseIfHeaderLeftStyles,
  languageEditorElseIfTagStyles,
  languageEditorIfElseBlockRootStyles,
  languageEditorIfElseBodyStyles,
  languageEditorIfElseHeaderTextStyles,
} from './styles';

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
    <Box sx={languageEditorIfElseBlockRootStyles}>
      <Box sx={languageEditorElseIfBlockHeaderStyles}>
        <Box sx={languageEditorElseIfHeaderLeftStyles}>
          <Box component="span" sx={languageEditorElseIfTagStyles}>
            {LANGUAGE_EDITOR_LABELS.CLB_ELSE_IF_LABEL}
          </Box>
          <Box component="span" sx={languageEditorIfElseHeaderTextStyles}>
            {LANGUAGE_EDITOR_LABELS.CLB_ELSE_IF_WHEN}
          </Box>
        </Box>
        <Button size="small" onClick={onRemove} aria-label="Remove else if">
          <X size={18} />
        </Button>
      </Box>
      <Box sx={languageEditorIfElseBodyStyles}>
        <ConditionalLanguageBuilderClauseRow
          clause={clause}
          onChange={onClauseChange}
          fieldConfig={fieldConfig}
        />
        <Box>
          <Box component="label" sx={languageEditorContentLabelStyles}>
            {LANGUAGE_EDITOR_LABELS.CLB_CONTENT_LABEL}
          </Box>
          <LanguageEditor
            fieldConfig={fieldConfig}
            content={clause.content}
            onChange={(content) => onClauseChange({ ...clause, content })}
            placeholder={LANGUAGE_EDITOR_LABELS.CLB_CONTENT_PLACEHOLDER}
            minHeight="120px"
            embedded
          />
        </Box>
      </Box>
    </Box>
  );
}
