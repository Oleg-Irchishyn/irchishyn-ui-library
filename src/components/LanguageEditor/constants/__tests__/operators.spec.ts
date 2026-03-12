import { describe, expect, it } from 'vitest';

import {
  IN_RANGE_OPERATOR_KEY,
  VALUE_LESS_OPERATOR_KEYS,
  getOperatorsForDataType,
  isInRangeOperator,
  isValueLessOperator,
} from '../operators';

describe('operators constants', () => {
  it('returns operators for all supported data types', () => {
    expect(getOperatorsForDataType('text').some((o) => o.key === 'contains')).toBe(true);
    expect(getOperatorsForDataType('number').some((o) => o.key === 'greaterThan')).toBe(true);
    expect(getOperatorsForDataType('date').some((o) => o.key === 'inRange')).toBe(true);
    expect(getOperatorsForDataType('boolean')).toEqual([
      { key: 'isTrue', label: 'is true' },
      { key: 'isFalse', label: 'is false' },
    ]);
  });

  it('falls back to text operators for unknown data type', () => {
    const fallback = getOperatorsForDataType('unknown' as never);
    expect(fallback.some((o) => o.key === 'contains')).toBe(true);
  });

  it('checks value-less and in-range operators', () => {
    expect(VALUE_LESS_OPERATOR_KEYS).toEqual(['blank', 'notBlank', 'isTrue', 'isFalse']);
    expect(IN_RANGE_OPERATOR_KEY).toBe('inRange');

    expect(isValueLessOperator('blank')).toBe(true);
    expect(isValueLessOperator('isTrue')).toBe(true);
    expect(isValueLessOperator('isFalse')).toBe(true);
    expect(isValueLessOperator('equals')).toBe(false);
    expect(isInRangeOperator('inRange')).toBe(true);
    expect(isInRangeOperator('greaterThan')).toBe(false);
  });
});
