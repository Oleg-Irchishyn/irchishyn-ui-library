import type { ConditionClause } from '../types';
import { isValueLessOperator } from '../constants';

/**
 * Builds the conditional block string from IF clause, optional ELSE IF clauses, and optional ELSE content.
 * Format: {{IF fieldName operatorKey value}}content{{ELSE IF ...}}content{{ELSE}}content{{ENDIF}}
 * Value-less operators (blank, notBlank) omit the value part.
 */
export function buildConditionalString(
  ifClause: ConditionClause,
  elseIfClauses: ConditionClause[],
  elseContent: string,
): string {
  const ifPart = formatCondition('IF', ifClause);
  const elseIfParts = elseIfClauses.map((c) => formatCondition('ELSE IF', c));
  return ifPart + elseIfParts.join('') + `{{ELSE}}${elseContent}{{ENDIF}}`;
}

function formatCondition(prefix: 'IF' | 'ELSE IF', clause: ConditionClause): string {
  const { fieldName, operatorKey, value, value2, content } = clause;
  const valueLess = isValueLessOperator(operatorKey);
  const valuePart = valueLess
    ? ''
    : operatorKey === 'inRange' && value2 !== undefined && value2 !== ''
      ? ` ${value},${value2}`
      : ` ${value}`;
  const condition = `{{${prefix} ${fieldName} ${operatorKey}${valuePart}}}`;
  return `${condition}${content}`;
}
