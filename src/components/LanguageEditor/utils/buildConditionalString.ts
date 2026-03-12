import type { ConditionClause } from '../types';
import { isValueLessOperator } from '../constants';

/**
 * Builds the conditional block string from IF clause, optional ELSE IF clauses, and optional ELSE content.
 * Format: {{IF fieldName operatorKey value}}content{{ELSE IF ...}}content{{ELSE}}content{{ENDIF}}
 * Value-less operators (blank, notBlank) omit the value part.
 * When includeElse is false, the {{ELSE}}... part is omitted.
 */
export function buildConditionalString(
  ifClause: ConditionClause,
  elseIfClauses: ConditionClause[],
  elseContent: string,
  includeElse: boolean,
): string {
  const ifPart = formatCondition('IF', ifClause);
  const elseIfParts = elseIfClauses.map((c) => formatCondition('ELSE IF', c));
  const elsePart = includeElse ? `{{ELSE}}${elseContent}` : '';
  return ifPart + elseIfParts.join('') + elsePart + '{{ENDIF}}';
}

function formatCondition(prefix: 'IF' | 'ELSE IF', clause: ConditionClause): string {
  const { fieldName, operatorKey, value, value2, content } = clause;
  const valueLess = isValueLessOperator(operatorKey);
  let condition: string;
  if (operatorKey === 'isTrue') {
    condition = `{{${prefix} ${fieldName} equals true}}`;
  } else if (operatorKey === 'isFalse') {
    condition = `{{${prefix} ${fieldName} equals false}}`;
  } else {
    const valuePart = valueLess
      ? ''
      : operatorKey === 'inRange' && value2 !== undefined && value2 !== ''
        ? ` ${value},${value2}`
        : ` ${value}`;
    condition = `{{${prefix} ${fieldName} ${operatorKey}${valuePart}}}`;
  }
  return `${condition}${content}`;
}
