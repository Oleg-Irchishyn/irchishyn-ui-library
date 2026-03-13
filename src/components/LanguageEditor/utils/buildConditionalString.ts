import type { ConditionClause } from '../types';
import { getOperatorDisplayInEditor, isInRangeOperator, isValueLessOperator } from '../constants';

/**
 * Builds the conditional block string from IF clause, optional ELSE IF clauses, and optional ELSE content.
 * Format: {{IF fieldName operator value}}content{{ELSE IF ...}}content{{ELSE}}content{{ENDIF}}
 * Comparison operators appear as math symbols (e.g. ">", "<=", "="); others as uppercase keys (e.g. STARTS_WITH, IS_EMPTY).
 * Value-less operators (IS_EMPTY, IS_NOT_EMPTY, IS_TRUE, IS_FALSE) omit the value part.
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
  const inRange = isInRangeOperator(operatorKey);
  const valuePart = valueLess
    ? ''
    : inRange && value2 !== undefined && value2 !== ''
      ? ` ${value},${value2}`
      : ` ${value}`;
  const operatorInEditor = getOperatorDisplayInEditor(operatorKey);
  const condition = `{{${prefix} ${fieldName} ${operatorInEditor}${valuePart}}}`;
  return `${condition}${content}`;
}
