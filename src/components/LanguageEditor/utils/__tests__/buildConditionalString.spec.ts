import { describe, expect, it } from 'vitest';

import { buildConditionalString } from '../buildConditionalString';
import type { ConditionClause } from '../../types';

describe('buildConditionalString', () => {
  it('builds IF + ELSE + ENDIF structure', () => {
    const ifClause: ConditionClause = {
      fieldName: 'Region',
      operatorKey: 'equals',
      value: 'EMEA',
      content: 'Region content',
    };

    const result = buildConditionalString(ifClause, [], 'Fallback content', true);

    expect(result).toBe('{{IF Region equals EMEA}}Region content{{ELSE}}Fallback content{{ENDIF}}');
  });

  it('omits ELSE part when includeElse is false', () => {
    const ifClause: ConditionClause = {
      fieldName: 'Region',
      operatorKey: 'equals',
      value: 'EMEA',
      content: 'Region content',
    };

    const result = buildConditionalString(ifClause, [], 'Fallback content', false);

    expect(result).toBe('{{IF Region equals EMEA}}Region content{{ENDIF}}');
  });

  it('builds ELSE IF clauses and supports inRange + value-less operators', () => {
    const ifClause: ConditionClause = {
      fieldName: 'Amount',
      operatorKey: 'blank',
      value: '',
      content: 'If blank',
    };
    const elseIfClauses: ConditionClause[] = [
      {
        fieldName: 'Amount',
        operatorKey: 'inRange',
        value: '10',
        value2: '20',
        content: 'Between 10 and 20',
      },
      {
        fieldName: 'Status',
        operatorKey: 'equals',
        value: 'Open',
        content: 'Open status',
      },
    ];

    const result = buildConditionalString(ifClause, elseIfClauses, 'Everything else', true);

    expect(result).toBe(
      '{{IF Amount blank}}If blank{{ELSE IF Amount inRange 10,20}}Between 10 and 20{{ELSE IF Status equals Open}}Open status{{ELSE}}Everything else{{ENDIF}}',
    );
  });

  it('outputs equals true/false for boolean isTrue and isFalse operators', () => {
    const ifClause: ConditionClause = {
      fieldName: 'IS_CAPITAL_CALL',
      operatorKey: 'isTrue',
      value: '',
      content: 'Capital call content',
    };
    const result = buildConditionalString(ifClause, [], 'Else content', true);
    expect(result).toBe(
      '{{IF IS_CAPITAL_CALL equals true}}Capital call content{{ELSE}}Else content{{ENDIF}}',
    );

    const ifClauseFalse: ConditionClause = {
      fieldName: 'IS_CAPITAL_CALL',
      operatorKey: 'isFalse',
      value: '',
      content: 'Distribution content',
    };
    const resultFalse = buildConditionalString(ifClauseFalse, [], '', false);
    expect(resultFalse).toBe('{{IF IS_CAPITAL_CALL equals false}}Distribution content{{ENDIF}}');
  });
});
