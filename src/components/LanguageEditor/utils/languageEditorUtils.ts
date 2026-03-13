import { warning } from '@gen2fund/platform.style';

import type {
  ConditionClause,
  DataType,
  FieldDefinition,
  ValidationError,
  ValidationResult,
} from '../types';
import {
  getOperatorsForDataType,
  isInRangeOperator,
  isValueLessOperator,
  normalizeOperatorFromEditor,
} from '../constants';

/** Token text color is set via CSS var --language-editor-token-text (theme text.primary) on the editor container */
const CONDITIONAL_TOKEN_STYLE = `color: var(--language-editor-token-text, ${warning.dark}); background-color: ${warning.light}; padding: 1px 4px; border-radius: 3px; font-family: monospace; font-size: 0.85em;`;
/** Same gold-ish highlight as conditional tokens (warning) */
const FIELD_BADGE_STYLE = `color: var(--language-editor-token-text, ${warning.dark}); background-color: ${warning.light}; padding: 1px 4px; border-radius: 3px; font-style: italic; font-size: 0.9em;`;

function htmlEncode(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function htmlDecode(text: string): string {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

/**
 * Formats plain text content with styled tokens for conditional syntax and field references.
 * Conditional tokens ({{IF...}}, {{ELSE IF...}}, {{ELSE}}, {{ENDIF}}) are styled with orange background.
 * Field references («fieldName») are styled with gold background.
 */
export function formatConditionalSyntax(content: string): string {
  let formatted = htmlEncode(content);

  formatted = formatted.replace(/\n/g, '<br>');

  formatted = formatted.replace(
    /(\{\{IF\s+[^}]+\}\})/gi,
    `<span contenteditable="false" style="${CONDITIONAL_TOKEN_STYLE}" data-condition="if">$1</span>`,
  );

  formatted = formatted.replace(
    /(\{\{ELSE\s*IF\s+[^}]+\}\})/gi,
    `<span contenteditable="false" style="${CONDITIONAL_TOKEN_STYLE}" data-condition="elseif">$1</span>`,
  );

  formatted = formatted.replace(
    /(\{\{ELSE\}\})/gi,
    `<span contenteditable="false" style="${CONDITIONAL_TOKEN_STYLE}" data-condition="else">$1</span>`,
  );

  formatted = formatted.replace(
    /(\{\{ENDIF\}\})/gi,
    `<span contenteditable="false" style="${CONDITIONAL_TOKEN_STYLE}" data-condition="endif">$1</span>`,
  );

  formatted = formatted.replace(
    /(«[^»]+»)/g,
    `<span contenteditable="false" style="${FIELD_BADGE_STYLE}" data-field="true">$1</span>`,
  );

  return formatted;
}

/**
 * Strips HTML formatting from editor content to get plain text with tokens.
 * Removes styled spans but preserves the token text itself.
 */
export function stripConditionalFormatting(html: string): string {
  let plain = html;

  plain = plain.replace(/<span[^>]*data-condition="[^"]*"[^>]*>([\s\S]*?)<\/span>/gi, '$1');
  plain = plain.replace(/<span[^>]*data-field="[^"]*"[^>]*>([\s\S]*?)<\/span>/gi, '$1');
  plain = plain.replace(/<\/?span[^>]*>/gi, '');
  plain = plain.replace(/<br\s*\/?>/gi, '\n');
  plain = plain.replace(/<\/div>\s*<div[^>]*>/gi, '\n');
  plain = plain.replace(/<\/?div[^>]*>/gi, '');
  plain = plain.replace(/<[^>]+>/g, '');
  plain = htmlDecode(plain);

  return plain;
}

/**
 * Extracts field names from field reference tokens («fieldName») in content.
 */
export function extractFieldReferences(content: string): string[] {
  const matches = content.match(/«([^»]+)»/g) || [];
  return matches.map((m) => m.slice(1, -1));
}

/**
 * Parses IF/ELSE IF conditions from content and returns field name and operator for each.
 */
function parseConditions(
  content: string,
): Array<{ prefix: string; fieldName: string; operator: string }> {
  const results: Array<{ prefix: string; fieldName: string; operator: string }> = [];

  const ifRegex = /\{\{IF\s+([^\s}]+)\s+([^\s}]+)(?:\s+[^}]*)?\}\}/gi;
  let match;
  while ((match = ifRegex.exec(content)) !== null) {
    results.push({ prefix: 'IF', fieldName: match[1], operator: match[2] });
  }

  const elseIfRegex = /\{\{ELSE\s*IF\s+([^\s}]+)\s+([^\s}]+)(?:\s+[^}]*)?\}\}/gi;
  while ((match = elseIfRegex.exec(content)) !== null) {
    results.push({ prefix: 'ELSE IF', fieldName: match[1], operator: match[2] });
  }

  return results;
}

/**
 * Gets the dataType for a field by name from the field config.
 */
function getFieldDataType(fieldName: string, fieldConfig: FieldDefinition[]): DataType | null {
  const field = fieldConfig.find((f) => f.name === fieldName);
  return field?.dataType ?? null;
}

/**
 * Validates editor content against the field configuration.
 * Checks for:
 * - Balanced IF/ENDIF pairs
 * - Valid operators for each field's dataType
 * - All field references exist in fieldConfig
 */
export function validateContent(content: string, fieldConfig: FieldDefinition[]): ValidationResult {
  const errors: ValidationError[] = [];
  const validFieldNames = fieldConfig.map((f) => f.name);

  const fieldRefs = extractFieldReferences(content);
  fieldRefs.forEach((fieldRef) => {
    if (!validFieldNames.includes(fieldRef)) {
      errors.push({
        message: `Field reference "«${fieldRef}»" does not exist in field configuration`,
      });
    }
  });

  const conditions = parseConditions(content);
  conditions.forEach(({ prefix, fieldName, operator }) => {
    if (!validFieldNames.includes(fieldName)) {
      errors.push({ message: `${prefix} condition: Field "${fieldName}" does not exist` });
    } else {
      const dataType = getFieldDataType(fieldName, fieldConfig);
      if (dataType) {
        const validOperators = getOperatorsForDataType(dataType);
        const operatorKey = normalizeOperatorFromEditor(operator);
        const isValidOperator = validOperators.some((op) => op.key === operatorKey);
        if (!isValidOperator) {
          errors.push({
            message: `${prefix} condition: Operator "${operator}" is not valid for ${dataType} field "${fieldName}"`,
          });
        }
      }
    }
  });

  const ifCount = (content.match(/\{\{IF\s/gi) || []).length;
  const endifCount = (content.match(/\{\{ENDIF\}\}/gi) || []).length;
  if (ifCount !== endifCount) {
    errors.push({
      message: `Mismatched IF/ENDIF: Found ${ifCount} IF statement(s) but ${endifCount} ENDIF statement(s)`,
    });
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Formats a field name as a field reference token with guillemets.
 */
export function formatFieldReference(fieldName: string): string {
  return `«${fieldName}»`;
}

/**
 * Validates the Conditional Language Builder state (like POC validateConditions).
 * Reports errors for empty/invalid field, operator, value, and invalid field refs in content.
 */
export function validateConditionalBuilder(
  ifClause: ConditionClause,
  elseIfClauses: ConditionClause[],
  includeElse: boolean,
  elseContent: string,
  fieldConfig: FieldDefinition[],
): ValidationResult {
  const errors: ValidationError[] = [];
  const validFieldNames = fieldConfig.map((f) => f.name);

  const validateClause = (clause: ConditionClause, blockName: string) => {
    if (!clause.fieldName?.trim()) {
      errors.push({ message: `${blockName}: No field selected` });
      return;
    }
    if (!validFieldNames.includes(clause.fieldName)) {
      errors.push({
        message: `${blockName}: Field "${clause.fieldName}" does not exist in field configuration`,
      });
      return;
    }
    const dataType = getFieldDataType(clause.fieldName, fieldConfig);
    if (dataType) {
      const validOperators = getOperatorsForDataType(dataType);
      const isValidOperator = validOperators.some((op) => op.key === clause.operatorKey);
      if (!clause.operatorKey?.trim()) {
        errors.push({ message: `${blockName}: No operator selected` });
      } else if (!isValidOperator) {
        errors.push({
          message: `${blockName}: Operator "${clause.operatorKey}" is not valid for ${dataType} field "${clause.fieldName}"`,
        });
      }
    }

    if (!isValueLessOperator(clause.operatorKey)) {
      if (!clause.value?.trim()) {
        errors.push({
          message: `${blockName}: Value is required for operator "${clause.operatorKey}"`,
        });
      }
      if (isInRangeOperator(clause.operatorKey) && !(clause.value2 ?? '').trim()) {
        errors.push({
          message: `${blockName}: Second value (upper bound) is required for Between operator`,
        });
      }
    }

    const contentFieldRefs = extractFieldReferences(clause.content);
    contentFieldRefs.forEach((fieldRef) => {
      if (!validFieldNames.includes(fieldRef)) {
        errors.push({
          message: `${blockName} content: Field reference "«${fieldRef}»" does not exist`,
        });
      }
    });
  };

  validateClause(ifClause, 'IF condition');

  elseIfClauses.forEach((clause, index) => {
    validateClause(clause, `ELSE IF #${index + 1}`);
  });

  if (includeElse) {
    const elseFieldRefs = extractFieldReferences(elseContent);
    elseFieldRefs.forEach((fieldRef) => {
      if (!validFieldNames.includes(fieldRef)) {
        errors.push({
          message: `ELSE content: Field reference "«${fieldRef}»" does not exist`,
        });
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}
