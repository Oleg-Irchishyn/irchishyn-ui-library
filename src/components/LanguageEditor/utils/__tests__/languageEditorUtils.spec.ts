import { describe, expect, it } from 'vitest';

import {
  extractFieldReferences,
  formatConditionalSyntax,
  formatFieldReference,
  stripConditionalFormatting,
  validateContent,
} from '../languageEditorUtils';
import type { FieldDefinition } from '../../types';

const fieldConfig: FieldDefinition[] = [
  { name: 'Region', displayName: 'Region', type: 'Dimension', dataType: 'text' },
  { name: 'Amount', displayName: 'Amount', type: 'Measure', dataType: 'number' },
];

describe('languageEditorUtils', () => {
  it('formats and strips conditional content without losing tokens', () => {
    const content = '{{IF Region equals EMEA}}Hello «Region»{{ELSE}}Fallback{{ENDIF}}';

    const formatted = formatConditionalSyntax(content);
    const stripped = stripConditionalFormatting(formatted);

    expect(formatted).toContain('data-condition="if"');
    expect(formatted).toContain('data-field="true"');
    expect(stripped).toBe(content);
  });

  it('extracts field references and formats a field token', () => {
    expect(extractFieldReferences('A «Region» and «Amount» token')).toEqual(['Region', 'Amount']);
    expect(formatFieldReference('Status')).toBe('«Status»');
  });

  it('validates correct content successfully', () => {
    const validContent =
      '{{IF Region contains EMEA}}Current: «Region»{{ELSE IF Amount greaterThan 100}}High{{ELSE}}Other{{ENDIF}}';

    const result = validateContent(validContent, fieldConfig);

    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  it('returns validation errors for invalid fields/operators and mismatched IF/ENDIF', () => {
    const invalidContent =
      '{{IF UnknownField equals yes}}X{{ELSE IF Amount contains 5}}Y{{ENDIF}}{{ENDIF}}';

    const result = validateContent(invalidContent, fieldConfig);
    const messages = result.errors?.map((e) => e.message) ?? [];

    expect(result.valid).toBe(false);
    expect(messages.some((m) => m.includes('Field "UnknownField" does not exist'))).toBe(true);
    expect(
      messages.some((m) =>
        m.includes('Operator "contains" is not valid for number field "Amount"'),
      ),
    ).toBe(true);
    expect(messages.some((m) => m.includes('Mismatched IF/ENDIF'))).toBe(true);
  });
});
