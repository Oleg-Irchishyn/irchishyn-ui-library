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

    const result = buildConditionalString(ifClause, [], 'Fallback content');

    expect(result).toBe('{{IF Region equals EMEA}}Region content{{ELSE}}Fallback content{{ENDIF}}');
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

    const result = buildConditionalString(ifClause, elseIfClauses, 'Everything else');

    expect(result).toBe(
      '{{IF Amount blank}}If blank{{ELSE IF Amount inRange 10,20}}Between 10 and 20{{ELSE IF Status equals Open}}Open status{{ELSE}}Everything else{{ENDIF}}',
    );
  });
});
