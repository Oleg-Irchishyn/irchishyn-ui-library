import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

import { LANGUAGE_EDITOR_LABELS } from '../constants';
import type { DataType } from '../types';

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
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Value</InputLabel>
        <Select value={value} label="Value" onChange={(e) => onChange(e.target.value)}>
          <MenuItem value="true">true</MenuItem>
          <MenuItem value="false">false</MenuItem>
        </Select>
      </FormControl>
    );
  }
  const inputType = dataType === 'number' ? 'number' : dataType === 'date' ? 'date' : 'text';
  return (
    <TextField
      size="small"
      type={inputType}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      sx={{ minWidth: 140 }}
      inputProps={dataType === 'number' ? { inputMode: 'numeric' } : undefined}
    />
  );
}
