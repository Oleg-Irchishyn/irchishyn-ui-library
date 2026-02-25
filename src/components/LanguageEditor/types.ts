export type FieldType = 'Dimension' | 'Measure' | 'Boolean';

export type DataType = 'text' | 'number' | 'date' | 'boolean';

export interface FieldDefinition {
  name: string;
  displayName: string;
  type: FieldType;
  dataType: DataType;
  group?: string;
  description?: string;
}

export interface FieldInsertDropdownProps {
  fieldConfig: FieldDefinition[];
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onInsertField: (fieldName: string) => void;
  open: boolean;
  id?: string;
}

/** Single condition clause (IF or ELSE IF): field, operator, value(s), and content to show when condition matches */
export interface ConditionClause {
  fieldName: string;
  operatorKey: string;
  value: string;
  value2?: string;
  content: string;
}

export interface ConditionalLanguageBuilderProps {
  open: boolean;
  onClose: () => void;
  fieldConfig: FieldDefinition[];
  onInsertConditional: (conditionalText: string) => void;
}

export interface UseConditionalLanguageBuilderParams {
  fieldConfig: FieldDefinition[];
  onClose: () => void;
  onInsertConditional: (conditionalText: string) => void;
}
