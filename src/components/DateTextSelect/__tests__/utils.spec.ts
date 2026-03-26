import { describe, expect, it } from 'vitest';

import { getDateValidationMessage } from '../utils';

describe('DateTextSelect utils', () => {
  it('returns invalid date message', () => {
    expect(getDateValidationMessage('invalidDate', false)).toBe('Enter a valid date (MM/DD/YYYY)');
  });

  it('returns required message when required and no parse error', () => {
    expect(getDateValidationMessage(null, true)).toBe('Date is required');
  });

  it('returns min and max date messages', () => {
    const minDate = new Date('2026-01-01T12:00:00.000Z');
    const maxDate = new Date('2026-12-31T12:00:00.000Z');

    expect(getDateValidationMessage('minDate', false, minDate, maxDate)).toContain('01/01/2026');
    expect(getDateValidationMessage('maxDate', false, minDate, maxDate)).toContain('12/31/2026');
  });

  it('returns undefined when no error state', () => {
    expect(getDateValidationMessage(null, false)).toBeUndefined();
  });

  it('returns custom format hint for invalid date with non-default format', () => {
    expect(getDateValidationMessage('invalidDate', false, undefined, undefined, 'dd/MM/yyyy')).toBe(
      'Enter a valid date (DD/MM/YYYY)',
    );
  });
});
