import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { X } from 'lucide-react';

import {
  getOperatorsForDataType,
  isInRangeOperator,
  isValueLessOperator,
  LANGUAGE_EDITOR_LABELS,
} from '../constants';
import type { ConditionClause, DataType, FieldDefinition } from '../types';
import { ConditionalLanguageBuilderValueInput } from './ConditionalLanguageBuilderValueInput';

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
    const nextField = getFieldByName(fieldConfig, fieldName);
    const nextOps = nextField ? getOperatorsForDataType(nextField.dataType) : [];
    const firstOp = nextOps[0]?.key ?? 'equals';
    onChange({
      ...clause,
      fieldName,
      operatorKey: firstOp,
      value: '',
      value2: undefined,
    });
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-start' }}>
      <FormControl size="small" sx={{ minWidth: 180 }}>
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
              {f.displayName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Operator</InputLabel>
        <Select
          value={clause.operatorKey}
          label="Operator"
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
        <ConditionalLanguageBuilderValueInput
          dataType={dataType}
          value={clause.value}
          onChange={(v) => onChange({ ...clause, value: v })}
        />
      )}
      {inRange && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ConditionalLanguageBuilderValueInput
            dataType={dataType}
            value={clause.value}
            onChange={(v) => onChange({ ...clause, value: v })}
            placeholder={LANGUAGE_EDITOR_LABELS.CLB_VALUE_MIN}
          />
          <Box component="span" sx={{ fontSize: 12, color: 'text.secondary' }}>
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
        <Button size="small" onClick={onRemove} sx={{ minWidth: 36 }} aria-label="Remove condition">
          <X size={18} />
        </Button>
      )}
    </Box>
  );
}
