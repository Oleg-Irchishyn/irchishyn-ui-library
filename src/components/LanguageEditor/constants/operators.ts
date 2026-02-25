import type { DataType } from '../types';

export interface OperatorOption {
  key: string;
  label: string;
}

/** Operators that do not require a value input (Blank, Not Blank, and for boolean only Equals with true/false) */
export const VALUE_LESS_OPERATOR_KEYS = ['blank', 'notBlank'] as const;

/** Operator key for "Between" — requires two value inputs */
export const IN_RANGE_OPERATOR_KEY = 'inRange';

const TEXT_OPERATORS: OperatorOption[] = [
  { key: 'contains', label: 'Contains' },
  { key: 'notContain', label: 'Does not contain' },
  { key: 'equals', label: 'Equals' },
  { key: 'notEqual', label: 'Does not equal' },
  { key: 'startsWith', label: 'Begins with' },
  { key: 'endsWith', label: 'Ends with' },
  { key: 'blank', label: 'Blank' },
  { key: 'notBlank', label: 'Not Blank' },
];

const NUMBER_OPERATORS: OperatorOption[] = [
  { key: 'equals', label: 'Equals' },
  { key: 'notEqual', label: 'Does not equal' },
  { key: 'greaterThan', label: 'Greater than' },
  { key: 'greaterThanOrEqual', label: 'Greater than or equal to' },
  { key: 'lessThan', label: 'Less than' },
  { key: 'lessThanOrEqual', label: 'Less than or equal' },
  { key: 'inRange', label: 'Between' },
  { key: 'blank', label: 'Blank' },
  { key: 'notBlank', label: 'Not Blank' },
];

const DATE_OPERATORS: OperatorOption[] = [
  { key: 'equals', label: 'Equals' },
  { key: 'notEqual', label: 'Does not equal' },
  { key: 'lessThan', label: 'before' },
  { key: 'greaterThan', label: 'after' },
  { key: 'inRange', label: 'Between' },
  { key: 'blank', label: 'Blank' },
  { key: 'notBlank', label: 'Not blank' },
];

const BOOLEAN_OPERATORS: OperatorOption[] = [{ key: 'equals', label: 'Equals' }];

export function getOperatorsForDataType(dataType: DataType): OperatorOption[] {
  switch (dataType) {
    case 'text':
      return TEXT_OPERATORS;
    case 'number':
      return NUMBER_OPERATORS;
    case 'date':
      return DATE_OPERATORS;
    case 'boolean':
      return BOOLEAN_OPERATORS;
    default:
      return TEXT_OPERATORS;
  }
}

export function isValueLessOperator(key: string): boolean {
  return (VALUE_LESS_OPERATOR_KEYS as readonly string[]).includes(key);
}

export function isInRangeOperator(key: string): boolean {
  return key === IN_RANGE_OPERATOR_KEY;
}
