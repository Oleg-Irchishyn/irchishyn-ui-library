import { Box } from '@mui/material';

import { LANGUAGE_EDITOR_LABELS } from '../constants';
import type { ConditionClause, FieldDefinition } from '../types';
import { ConditionalLanguageBuilderClauseRow } from './ConditionalLanguageBuilderClauseRow';
import { LanguageEditor } from './LanguageEditor';
import {
  languageEditorContentLabelStyles,
  languageEditorIfBlockHeaderStyles,
  languageEditorIfElseBlockRootStyles,
  languageEditorIfElseBodyStyles,
  languageEditorIfElseHeaderTextStyles,
  languageEditorIfTagStyles,
} from './styles';

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
    <Box sx={languageEditorIfElseBlockRootStyles}>
      <Box sx={languageEditorIfBlockHeaderStyles}>
        <Box component="span" sx={languageEditorIfTagStyles}>
          {LANGUAGE_EDITOR_LABELS.CLB_IF_LABEL}
        </Box>
        <Box component="span" sx={languageEditorIfElseHeaderTextStyles}>
          {LANGUAGE_EDITOR_LABELS.CLB_IF_WHEN}
        </Box>
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
