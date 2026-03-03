export { HistoryAuditTrail } from './components/HistoryAuditTrail';
export type {
  HistoryAuditTrailProps,
  HistoryAuditTrailEvent,
  HistoryAuditEventType,
  HistoryAuditTrailRenderMode,
} from './components/HistoryAuditTrail';
export { HISTORY_AUDIT_ADDITIONAL_DETAIL_KEYS } from './components/HistoryAuditTrail';

export {
  LanguageEditor,
  LanguageEditorToolbar,
  FieldInsertDropdown,
  ConditionalLanguageBuilder,
} from './components/LanguageEditor';
export type {
  LanguageEditorProps,
  LanguageEditorToolbarProps,
  FieldDefinition,
  FieldInsertDropdownProps,
  FieldType,
  DataType,
  ConditionClause,
  ConditionalLanguageBuilderProps,
  UseConditionalLanguageBuilderParams,
  ValidationResult,
  ValidationError,
} from './components/LanguageEditor';
export { useConditionalLanguageBuilder, useLanguageEditor } from './components/LanguageEditor';
export {
  formatConditionalSyntax,
  stripConditionalFormatting,
  validateContent,
  formatFieldReference,
} from './components/LanguageEditor';

export { default as App } from './App';
export type { AppProps } from './App';

export { createAppTheme } from './theme';
export { Gen2ThemeProvider } from './providers';
export type { Gen2ThemeProviderProps } from './providers';

export { Badge } from './components/Badge';
export type { BadgeProps, BadgeVariant, BadgeSize } from './components/Badge';
export type { BadgeColorPreset } from './types';
export { BADGE_VARIANTS, BADGE_SIZES, BADGE_COLOR_PRESETS } from './components/Badge';
