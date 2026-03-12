import { describe, expect, it } from 'vitest';

import {
  extractFieldReferences,
  formatConditionalSyntax,
  formatFieldReference,
  stripConditionalFormatting,
  validateConditionalBuilder,
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

  describe('validateConditionalBuilder', () => {
    it('returns errors when IF has no field selected', () => {
      const result = validateConditionalBuilder(
        { fieldName: '', operatorKey: 'equals', value: '', content: 'x' },
        [],
        false,
        '',
        fieldConfig,
      );
      expect(result.valid).toBe(false);
      expect(result.errors?.some((e) => e.message.includes('No field selected'))).toBe(true);
    });

    it('returns errors when IF has no operator selected', () => {
      const result = validateConditionalBuilder(
        { fieldName: 'Region', operatorKey: '', value: 'x', content: 'c' },
        [],
        false,
        '',
        fieldConfig,
      );
      expect(result.valid).toBe(false);
      expect(result.errors?.some((e) => e.message.includes('No operator selected'))).toBe(true);
    });

    it('returns errors when value is required but empty', () => {
      const result = validateConditionalBuilder(
        { fieldName: 'Region', operatorKey: 'equals', value: '', content: 'c' },
        [],
        false,
        '',
        fieldConfig,
      );
      expect(result.valid).toBe(false);
      expect(result.errors?.some((e) => e.message.includes('Value is required'))).toBe(true);
    });

    it('returns valid when IF clause is complete', () => {
      const result = validateConditionalBuilder(
        {
          fieldName: 'Region',
          operatorKey: 'equals',
          value: 'EMEA',
          content: 'Show «Region»',
        },
        [],
        false,
        '',
        fieldConfig,
      );
      expect(result.valid).toBe(true);
      expect(result.errors).toBeUndefined();
    });
  });
});
