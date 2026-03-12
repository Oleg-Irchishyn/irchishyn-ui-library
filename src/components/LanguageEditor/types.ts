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

/** Props for the ELSE block in Conditional Language Builder */
export interface ConditionalLanguageBuilderElseBlockProps {
  includeElse: boolean;
  onIncludeElseChange: (value: boolean) => void;
  content: string;
  onContentChange: (content: string) => void;
  fieldConfig: FieldDefinition[];
}

export interface UseConditionalLanguageBuilderParams {
  fieldConfig: FieldDefinition[];
  onClose: () => void;
  onInsertConditional: (conditionalText: string) => void;
}

/** Validation error with message and optional position info */
export interface ValidationError {
  message: string;
  offset?: number;
  length?: number;
}

/** Result of content validation */
export interface ValidationResult {
  valid: boolean;
  errors?: ValidationError[];
}

/** Props for the LanguageEditor component */
export interface LanguageEditorProps {
  /** List of field definitions for field insertion and validation */
  fieldConfig: FieldDefinition[];
  /** Rich text content with embedded tokens (conditionals and field references) */
  content: string;
  /** Callback when content changes; payload is the plain text with tokens */
  onChange?: (content: string) => void;
  /** Callback when validation runs; payload is the validation result */
  onValidate?: (result: ValidationResult) => void;
  /** When true, editor is non-editable but token rendering is preserved */
  readOnly?: boolean;
  /** Placeholder text shown when content is empty */
  placeholder?: string;
  /** Minimum height of the editor area */
  minHeight?: string;
  /** When true, used inside Conditional Language Builder: no Conditional/Validate in toolbar, no nested builder */
  embedded?: boolean;
}

/** Props for the LanguageEditorToolbar component */
export interface LanguageEditorToolbarProps {
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onInsertFieldMouseDown: () => void;
  onInsertFieldClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onConditionalClick: () => void;
  onValidateClick: () => void;
  fieldDropdownAnchor: HTMLElement | null;
  fieldDropdownOpen: boolean;
  onFieldDropdownClose: () => void;
  onInsertField: (fieldName: string) => void;
  fieldConfig: FieldDefinition[];
  validationResult: ValidationResult | null;
  disabled?: boolean;
  /** When false, hide the Conditional button (e.g. when editor is inside the Conditional Builder) */
  showConditionalButton?: boolean;
  /** When false, hide the Validate button (e.g. when editor is inside the Conditional Builder) */
  showValidateButton?: boolean;
}
