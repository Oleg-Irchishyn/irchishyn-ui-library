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
    const content = '{{IF Region EQUALS EMEA}}Hello «Region»{{ELSE}}Fallback{{ENDIF}}';

    const formatted = formatConditionalSyntax(content);
    const stripped = stripConditionalFormatting(formatted);

    expect(formatted).toContain('data-condition="if"');
    expect(formatted).toContain('data-field="true"');
    expect(stripped).toBe(content);
  });

  it('strips div/br html and decodes html entities', () => {
    const html =
      '<div>&lt;b&gt;Hello&lt;/b&gt;</div><div><span data-field="true">«Region»</span><br/>X &amp; Y</div>';
    const stripped = stripConditionalFormatting(html);
    expect(stripped).toBe('<b>Hello</b>\n«Region»\nX & Y');
  });

  it('extracts field references and formats a field token', () => {
    expect(extractFieldReferences('A «Region» and «Amount» token')).toEqual(['Region', 'Amount']);
    expect(formatFieldReference('Status')).toBe('«Status»');
  });

  it('validates correct content successfully', () => {
    const validContent =
      '{{IF Region CONTAINS EMEA}}Current: «Region»{{ELSE IF Amount IS_GREATER_THAN 100}}High{{ELSE}}Other{{ENDIF}}';

    const result = validateContent(validContent, fieldConfig);

    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  it('validates content with math symbols for measure operators (>, <, =, >=, <=, !=)', () => {
    const contentWithSymbols =
      '{{IF Amount > 100}}High{{ELSE IF Amount <= 50}}Low{{ELSE IF Region = EMEA}}EMEA{{ENDIF}}';
    const result = validateContent(contentWithSymbols, fieldConfig);
    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  it('returns validation errors for invalid fields/operators and mismatched IF/ENDIF', () => {
    const invalidContent =
      '{{IF UnknownField EQUALS yes}}X{{ELSE IF Amount CONTAINS 5}}Y{{ENDIF}}{{ENDIF}}';

    const result = validateContent(invalidContent, fieldConfig);
    const messages = result.errors?.map((e) => e.message) ?? [];

    expect(result.valid).toBe(false);
    expect(messages.some((m) => m.includes('Field "UnknownField" does not exist'))).toBe(true);
    expect(
      messages.some((m) =>
        m.includes('Operator "CONTAINS" is not valid for number field "Amount"'),
      ),
    ).toBe(true);
    expect(messages.some((m) => m.includes('Mismatched IF/ENDIF'))).toBe(true);
  });

  it('returns validation errors for missing field references in content body', () => {
    const invalidContent = '{{IF Region EQUALS EMEA}}Unknown «MissingField»{{ENDIF}}';
    const result = validateContent(invalidContent, fieldConfig);
    const messages = result.errors?.map((e) => e.message) ?? [];

    expect(result.valid).toBe(false);
    expect(
      messages.some((m) =>
        m.includes('Field reference "«MissingField»" does not exist in field configuration'),
      ),
    ).toBe(true);
  });

  describe('validateConditionalBuilder', () => {
    it('returns errors when IF has no field selected', () => {
      const result = validateConditionalBuilder(
        { fieldName: '', operatorKey: 'EQUALS', value: '', content: 'x' },
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
        { fieldName: 'Region', operatorKey: 'EQUALS', value: '', content: 'c' },
        [],
        false,
        '',
        fieldConfig,
      );
      expect(result.valid).toBe(false);
      expect(result.errors?.some((e) => e.message.includes('Value is required'))).toBe(true);
    });

    it('returns errors when selected field does not exist', () => {
      const result = validateConditionalBuilder(
        { fieldName: 'Unknown', operatorKey: 'EQUALS', value: 'x', content: 'c' },
        [],
        false,
        '',
        fieldConfig,
      );
      expect(result.valid).toBe(false);
      expect(
        result.errors?.some((e) =>
          e.message.includes('Field "Unknown" does not exist in field configuration'),
        ),
      ).toBe(true);
    });

    it('returns errors when operator is invalid for selected field data type', () => {
      const result = validateConditionalBuilder(
        { fieldName: 'Amount', operatorKey: 'CONTAINS', value: '100', content: 'c' },
        [],
        false,
        '',
        fieldConfig,
      );
      expect(result.valid).toBe(false);
      expect(
        result.errors?.some((e) =>
          e.message.includes('Operator "CONTAINS" is not valid for number field "Amount"'),
        ),
      ).toBe(true);
    });

    it('returns valid when IF clause is complete', () => {
      const result = validateConditionalBuilder(
        {
          fieldName: 'Region',
          operatorKey: 'EQUALS',
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

    it('returns errors for invalid ELSE IF, between without second value, and invalid ELSE references', () => {
      const result = validateConditionalBuilder(
        {
          fieldName: 'Region',
          operatorKey: 'CONTAINS',
          value: 'EMEA',
          content: 'IF «Region»',
        },
        [
          {
            fieldName: 'Amount',
            operatorKey: 'IS_BETWEEN',
            value: '10',
            value2: '',
            content: 'ELSE IF «MissingField»',
          },
        ],
        true,
        'ELSE «UnknownElseField»',
        fieldConfig,
      );

      const messages = result.errors?.map((e) => e.message) ?? [];
      expect(result.valid).toBe(false);
      expect(messages.some((m) => m.includes('Second value (upper bound) is required'))).toBe(true);
      expect(
        messages.some((m) => m.includes('ELSE IF #1 content: Field reference "«MissingField»"')),
      ).toBe(true);
      expect(
        messages.some((m) => m.includes('ELSE content: Field reference "«UnknownElseField»"')),
      ).toBe(true);
    });
  });
});
