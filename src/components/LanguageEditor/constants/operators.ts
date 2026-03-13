import type { DataType } from '../types';

export interface OperatorOption {
  key: string;
  label: string;
}

/** Operators that do not require a value input (Is Empty, Is Not Empty; for boolean: Is True / Is False) */
export const VALUE_LESS_OPERATOR_KEYS = [
  'IS_EMPTY',
  'IS_NOT_EMPTY',
  'IS_TRUE',
  'IS_FALSE',
] as const;

/** Operator key for "Between" — requires two value inputs */
export const IN_RANGE_OPERATOR_KEY = 'IS_BETWEEN';

/** Dimension (text) fields: equals, does not equal, contains, does not contain, starts with, is empty, is not empty */
const DIMENSION_OPERATORS: OperatorOption[] = [
  { key: 'EQUALS', label: 'equals' },
  { key: 'DOES_NOT_EQUAL', label: 'does not equal' },
  { key: 'CONTAINS', label: 'contains' },
  { key: 'DOES_NOT_CONTAIN', label: 'does not contain' },
  { key: 'STARTS_WITH', label: 'starts with' },
  { key: 'IS_EMPTY', label: 'is empty' },
  { key: 'IS_NOT_EMPTY', label: 'is not empty' },
];

/** Measure (number) fields: equals, does not equal, greater than, less than, >=, <=, between, is empty, is not empty */
const MEASURE_OPERATORS: OperatorOption[] = [
  { key: 'EQUALS', label: 'equals' },
  { key: 'DOES_NOT_EQUAL', label: 'does not equal' },
  { key: 'IS_GREATER_THAN', label: 'greater than' },
  { key: 'IS_LESS_THAN', label: 'less than' },
  { key: 'IS_GREATER_THAN_OR_EQUAL', label: 'greater than or equal' },
  { key: 'IS_LESS_THAN_OR_EQUAL', label: 'less than or equal' },
  { key: 'IS_BETWEEN', label: 'is between' },
  { key: 'IS_EMPTY', label: 'is empty' },
  { key: 'IS_NOT_EMPTY', label: 'is not empty' },
];

/** Date fields: same operator keys as measure, with date-appropriate labels */
const DATE_OPERATORS: OperatorOption[] = [
  { key: 'EQUALS', label: 'equals' },
  { key: 'DOES_NOT_EQUAL', label: 'does not equal' },
  { key: 'IS_GREATER_THAN', label: 'after' },
  { key: 'IS_LESS_THAN', label: 'before' },
  { key: 'IS_GREATER_THAN_OR_EQUAL', label: 'on or after' },
  { key: 'IS_LESS_THAN_OR_EQUAL', label: 'on or before' },
  { key: 'IS_BETWEEN', label: 'is between' },
  { key: 'IS_EMPTY', label: 'is empty' },
  { key: 'IS_NOT_EMPTY', label: 'is not empty' },
];

/** Boolean fields: is true, is false */
const BOOLEAN_OPERATORS: OperatorOption[] = [
  { key: 'IS_TRUE', label: 'is true' },
  { key: 'IS_FALSE', label: 'is false' },
];

export function getOperatorsForDataType(dataType: DataType): OperatorOption[] {
  switch (dataType) {
    case 'text':
      return DIMENSION_OPERATORS;
    case 'number':
      return MEASURE_OPERATORS;
    case 'date':
      return DATE_OPERATORS;
    case 'boolean':
      return BOOLEAN_OPERATORS;
    default:
      return DIMENSION_OPERATORS;
  }
}

export function isValueLessOperator(key: string): boolean {
  return (VALUE_LESS_OPERATOR_KEYS as readonly string[]).includes(key);
}

export function isInRangeOperator(key: string): boolean {
  return key === IN_RANGE_OPERATOR_KEY;
}

/**
 * Map from operator key to symbol shown in the editor for measure/date comparison operators.
 * Other operators (e.g. EQUALS for text, STARTS_WITH) stay as uppercase keys in the editor.
 */
const OPERATOR_KEY_TO_EDITOR_SYMBOL: Record<string, string> = {
  EQUALS: '=',
  DOES_NOT_EQUAL: '!=',
  IS_GREATER_THAN: '>',
  IS_LESS_THAN: '<',
  IS_GREATER_THAN_OR_EQUAL: '>=',
  IS_LESS_THAN_OR_EQUAL: '<=',
};

/**
 * Reverse map: editor token (symbol or key) → operator key for validation.
 */
const EDITOR_SYMBOL_TO_OPERATOR_KEY: Record<string, string> = {
  '=': 'EQUALS',
  '!=': 'DOES_NOT_EQUAL',
  '>': 'IS_GREATER_THAN',
  '<': 'IS_LESS_THAN',
  '>=': 'IS_GREATER_THAN_OR_EQUAL',
  '<=': 'IS_LESS_THAN_OR_EQUAL',
};

/**
 * Returns the form of the operator as it appears in the editor:
 * math symbols (e.g. ">", "<=") for comparison operators, otherwise the uppercase key (e.g. STARTS_WITH).
 */
export function getOperatorDisplayInEditor(operatorKey: string): string {
  return OPERATOR_KEY_TO_EDITOR_SYMBOL[operatorKey] ?? operatorKey;
}

/**
 * Normalizes an operator token from editor content to the operator key for validation.
 * Accepts both math symbols (e.g. ">", "<=") and uppercase keys (e.g. IS_GREATER_THAN).
 */
export function normalizeOperatorFromEditor(operatorToken: string): string {
  return EDITOR_SYMBOL_TO_OPERATOR_KEY[operatorToken] ?? operatorToken;
}
