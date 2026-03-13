import { describe, expect, it } from 'vitest';

import { buildConditionalString } from '../buildConditionalString';
import type { ConditionClause } from '../../types';

describe('buildConditionalString', () => {
  it('builds IF + ELSE + ENDIF; dimension operators as key, measure comparison as math symbols', () => {
    const ifClause: ConditionClause = {
      fieldName: 'Region',
      operatorKey: 'EQUALS',
      value: 'EMEA',
      content: 'Region content',
    };

    const result = buildConditionalString(ifClause, [], 'Fallback content', true);

    expect(result).toBe('{{IF Region = EMEA}}Region content{{ELSE}}Fallback content{{ENDIF}}');
  });

  it('omits ELSE part when includeElse is false', () => {
    const ifClause: ConditionClause = {
      fieldName: 'Region',
      operatorKey: 'EQUALS',
      value: 'EMEA',
      content: 'Region content',
    };

    const result = buildConditionalString(ifClause, [], 'Fallback content', false);

    expect(result).toBe('{{IF Region = EMEA}}Region content{{ENDIF}}');
  });

  it('builds ELSE IF clauses and supports IS_BETWEEN + value-less operators', () => {
    const ifClause: ConditionClause = {
      fieldName: 'Amount',
      operatorKey: 'IS_EMPTY',
      value: '',
      content: 'If empty',
    };
    const elseIfClauses: ConditionClause[] = [
      {
        fieldName: 'Amount',
        operatorKey: 'IS_BETWEEN',
        value: '10',
        value2: '20',
        content: 'Between 10 and 20',
      },
      {
        fieldName: 'Status',
        operatorKey: 'EQUALS',
        value: 'Open',
        content: 'Open status',
      },
    ];

    const result = buildConditionalString(ifClause, elseIfClauses, 'Everything else', true);

    expect(result).toBe(
      '{{IF Amount IS_EMPTY}}If empty{{ELSE IF Amount IS_BETWEEN 10,20}}Between 10 and 20{{ELSE IF Status = Open}}Open status{{ELSE}}Everything else{{ENDIF}}',
    );
  });

  it('emits math symbols for measure comparison operators in editor', () => {
    const ifClause: ConditionClause = {
      fieldName: 'Amount',
      operatorKey: 'IS_GREATER_THAN',
      value: '100',
      content: 'High',
    };
    expect(buildConditionalString(ifClause, [], '', false)).toBe(
      '{{IF Amount > 100}}High{{ENDIF}}',
    );
    const lessOrEqual: ConditionClause = {
      fieldName: 'Amount',
      operatorKey: 'IS_LESS_THAN_OR_EQUAL',
      value: '50',
      content: 'Low',
    };
    expect(buildConditionalString(lessOrEqual, [], '', false)).toBe(
      '{{IF Amount <= 50}}Low{{ENDIF}}',
    );
  });

  it('outputs IS_TRUE and IS_FALSE for boolean operators (no value in condition)', () => {
    const ifClause: ConditionClause = {
      fieldName: 'IS_CAPITAL_CALL',
      operatorKey: 'IS_TRUE',
      value: '',
      content: 'Capital call content',
    };
    const result = buildConditionalString(ifClause, [], 'Else content', true);
    expect(result).toBe(
      '{{IF IS_CAPITAL_CALL IS_TRUE}}Capital call content{{ELSE}}Else content{{ENDIF}}',
    );

    const ifClauseFalse: ConditionClause = {
      fieldName: 'IS_CAPITAL_CALL',
      operatorKey: 'IS_FALSE',
      value: '',
      content: 'Distribution content',
    };
    const resultFalse = buildConditionalString(ifClauseFalse, [], '', false);
    expect(resultFalse).toBe('{{IF IS_CAPITAL_CALL IS_FALSE}}Distribution content{{ENDIF}}');
  });
});
