import { describe, expect, it } from 'vitest';

import {
  IN_RANGE_OPERATOR_KEY,
  VALUE_LESS_OPERATOR_KEYS,
  getOperatorsForDataType,
  getOperatorDisplayInEditor,
  isInRangeOperator,
  isValueLessOperator,
  normalizeOperatorFromEditor,
} from '../operators';

describe('operators constants', () => {
  it('returns operators for all supported data types (Dimension/Measure/Boolean)', () => {
    expect(getOperatorsForDataType('text').some((o) => o.key === 'CONTAINS')).toBe(true);
    expect(getOperatorsForDataType('text').some((o) => o.key === 'STARTS_WITH')).toBe(true);
    expect(getOperatorsForDataType('number').some((o) => o.key === 'IS_GREATER_THAN')).toBe(true);
    expect(getOperatorsForDataType('date').some((o) => o.key === 'IS_BETWEEN')).toBe(true);
    expect(getOperatorsForDataType('boolean')).toEqual([
      { key: 'IS_TRUE', label: 'is true' },
      { key: 'IS_FALSE', label: 'is false' },
    ]);
  });

  it('uses lowercase labels in dropdown for dimension and measure', () => {
    const textOps = getOperatorsForDataType('text');
    expect(textOps.find((o) => o.key === 'STARTS_WITH')?.label).toBe('starts with');
    expect(textOps.find((o) => o.key === 'EQUALS')?.label).toBe('equals');
    const numberOps = getOperatorsForDataType('number');
    expect(numberOps.find((o) => o.key === 'IS_GREATER_THAN')?.label).toBe('greater than');
  });

  it('falls back to dimension (text) operators for unknown data type', () => {
    const fallback = getOperatorsForDataType('unknown' as never);
    expect(fallback.some((o) => o.key === 'CONTAINS')).toBe(true);
  });

  it('checks value-less and in-range operators', () => {
    expect(VALUE_LESS_OPERATOR_KEYS).toEqual(['IS_EMPTY', 'IS_NOT_EMPTY', 'IS_TRUE', 'IS_FALSE']);
    expect(IN_RANGE_OPERATOR_KEY).toBe('IS_BETWEEN');

    expect(isValueLessOperator('IS_EMPTY')).toBe(true);
    expect(isValueLessOperator('IS_TRUE')).toBe(true);
    expect(isValueLessOperator('IS_FALSE')).toBe(true);
    expect(isValueLessOperator('EQUALS')).toBe(false);
    expect(isInRangeOperator('IS_BETWEEN')).toBe(true);
    expect(isInRangeOperator('IS_GREATER_THAN')).toBe(false);
  });

  it('getOperatorDisplayInEditor returns math symbols for comparison operators', () => {
    expect(getOperatorDisplayInEditor('IS_GREATER_THAN')).toBe('>');
    expect(getOperatorDisplayInEditor('IS_LESS_THAN')).toBe('<');
    expect(getOperatorDisplayInEditor('IS_GREATER_THAN_OR_EQUAL')).toBe('>=');
    expect(getOperatorDisplayInEditor('IS_LESS_THAN_OR_EQUAL')).toBe('<=');
    expect(getOperatorDisplayInEditor('EQUALS')).toBe('=');
    expect(getOperatorDisplayInEditor('DOES_NOT_EQUAL')).toBe('!=');
    expect(getOperatorDisplayInEditor('STARTS_WITH')).toBe('STARTS_WITH');
    expect(getOperatorDisplayInEditor('IS_EMPTY')).toBe('IS_EMPTY');
  });

  it('normalizeOperatorFromEditor maps symbols and keys to operator key', () => {
    expect(normalizeOperatorFromEditor('>')).toBe('IS_GREATER_THAN');
    expect(normalizeOperatorFromEditor('<=')).toBe('IS_LESS_THAN_OR_EQUAL');
    expect(normalizeOperatorFromEditor('=')).toBe('EQUALS');
    expect(normalizeOperatorFromEditor('CONTAINS')).toBe('CONTAINS');
  });
});
