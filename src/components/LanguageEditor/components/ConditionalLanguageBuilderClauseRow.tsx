import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { X } from 'lucide-react';

import {
  getOperatorsForDataType,
  isInRangeOperator,
  isValueLessOperator,
  LANGUAGE_EDITOR_LABELS,
} from '../constants';
import type { ConditionClause, DataType, FieldDefinition } from '../types';
import { ConditionalLanguageBuilderValueInput } from './ConditionalLanguageBuilderValueInput';
import {
  languageEditorClauseFormControlStyles,
  languageEditorClauseRangeAndStyles,
  languageEditorClauseRangeWrapStyles,
  languageEditorClauseRemoveButtonStyles,
  languageEditorClauseRowStyles,
  languageEditorClauseValueInputWrapperStyles,
} from './styles';

function getFieldByName(fieldConfig: FieldDefinition[], name: string): FieldDefinition | undefined {
  return fieldConfig.find((f) => f.name === name);
}

export interface ConditionalLanguageBuilderClauseRowProps {
  clause: ConditionClause;
  onChange: (clause: ConditionClause) => void;
  fieldConfig: FieldDefinition[];
  onRemove?: () => void;
  showRemove?: boolean;
}

export function ConditionalLanguageBuilderClauseRow({
  clause,
  onChange,
  fieldConfig,
  onRemove,
  showRemove,
}: ConditionalLanguageBuilderClauseRowProps) {
  const field = getFieldByName(fieldConfig, clause.fieldName);
  const dataType: DataType = field?.dataType ?? 'text';
  const operators = getOperatorsForDataType(dataType);
  const valueLess = isValueLessOperator(clause.operatorKey);
  const inRange = isInRangeOperator(clause.operatorKey);

  const handleFieldChange = (fieldName: string) => {
    onChange({
      ...clause,
      fieldName,
      operatorKey: '',
      value: '',
      value2: undefined,
    });
  };

  return (
    <Box sx={languageEditorClauseRowStyles}>
      <FormControl size="small" sx={languageEditorClauseFormControlStyles}>
        <InputLabel id={`field-${clause.fieldName}`}>
          {LANGUAGE_EDITOR_LABELS.CLB_SELECT_FIELD}
        </InputLabel>
        <Select
          labelId={`field-${clause.fieldName}`}
          value={clause.fieldName}
          label={LANGUAGE_EDITOR_LABELS.CLB_SELECT_FIELD}
          onChange={(e) => handleFieldChange(e.target.value)}
        >
          {fieldConfig.map((f) => (
            <MenuItem key={f.name} value={f.name}>
              {f.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={languageEditorClauseFormControlStyles}>
        <InputLabel id={`operator-${clause.fieldName}`}>
          {LANGUAGE_EDITOR_LABELS.CLB_SELECT_OPERATOR}
        </InputLabel>
        <Select
          labelId={`operator-${clause.fieldName}`}
          value={clause.operatorKey}
          label={LANGUAGE_EDITOR_LABELS.CLB_SELECT_OPERATOR}
          onChange={(e) => onChange({ ...clause, operatorKey: e.target.value })}
        >
          {operators.map((op) => (
            <MenuItem key={op.key} value={op.key}>
              {op.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {!valueLess && !inRange && (
        <Box sx={languageEditorClauseValueInputWrapperStyles}>
          <ConditionalLanguageBuilderValueInput
            dataType={dataType}
            value={clause.value}
            onChange={(v) => onChange({ ...clause, value: v })}
          />
        </Box>
      )}
      {inRange && (
        <Box
          sx={
            [
              languageEditorClauseRangeWrapStyles,
              languageEditorClauseValueInputWrapperStyles,
            ] as SxProps<Theme>
          }
        >
          <ConditionalLanguageBuilderValueInput
            dataType={dataType}
            value={clause.value}
            onChange={(v) => onChange({ ...clause, value: v })}
            placeholder={LANGUAGE_EDITOR_LABELS.CLB_VALUE_MIN}
          />
          <Box component="span" sx={languageEditorClauseRangeAndStyles}>
            {LANGUAGE_EDITOR_LABELS.CLB_AND}
          </Box>
          <ConditionalLanguageBuilderValueInput
            dataType={dataType}
            value={clause.value2 ?? ''}
            onChange={(v) => onChange({ ...clause, value2: v })}
            placeholder={LANGUAGE_EDITOR_LABELS.CLB_VALUE_MAX}
          />
        </Box>
      )}
      {showRemove && onRemove && (
        <Button
          size="small"
          onClick={onRemove}
          sx={languageEditorClauseRemoveButtonStyles}
          aria-label="Remove condition"
        >
          <X size={18} />
        </Button>
      )}
    </Box>
  );
}
