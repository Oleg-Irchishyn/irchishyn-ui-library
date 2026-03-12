import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

import { LANGUAGE_EDITOR_LABELS } from '../constants';
import type { DataType } from '../types';
import {
  languageEditorClauseBooleanValueControlStyles,
  languageEditorClauseTextValueInputStyles,
} from './styles';

export interface ConditionalLanguageBuilderValueInputProps {
  dataType: DataType;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function ConditionalLanguageBuilderValueInput({
  dataType,
  value,
  onChange,
  placeholder = LANGUAGE_EDITOR_LABELS.CLB_VALUE_PLACEHOLDER,
}: ConditionalLanguageBuilderValueInputProps) {
  if (dataType === 'boolean') {
    return (
      <FormControl size="small" sx={languageEditorClauseBooleanValueControlStyles} fullWidth>
        <InputLabel>{LANGUAGE_EDITOR_LABELS.CLB_VALUE_LABEL}</InputLabel>
        <Select
          value={value}
          label={LANGUAGE_EDITOR_LABELS.CLB_VALUE_LABEL}
          onChange={(e) => onChange(e.target.value)}
        >
          <MenuItem value="true">true</MenuItem>
          <MenuItem value="false">false</MenuItem>
        </Select>
      </FormControl>
    );
  }
  const inputType = dataType === 'number' ? 'number' : dataType === 'date' ? 'date' : 'text';
  const isDate = dataType === 'date';
  return (
    <TextField
      fullWidth
      size="small"
      type={inputType}
      label={isDate ? undefined : LANGUAGE_EDITOR_LABELS.CLB_VALUE_LABEL}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={isDate ? undefined : placeholder}
      sx={languageEditorClauseTextValueInputStyles}
      inputProps={dataType === 'number' ? { inputMode: 'numeric' } : undefined}
    />
  );
}
