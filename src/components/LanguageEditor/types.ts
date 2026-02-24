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
