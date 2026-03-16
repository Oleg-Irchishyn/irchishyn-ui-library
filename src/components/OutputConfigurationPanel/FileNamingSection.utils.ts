import type { FileNamingToken, FileNamingVariable } from './types';

/**
 * Returns the display label for a file naming token (variable label or static value; space shown as "Space").
 */
export function getTokenDisplayLabel(
  token: FileNamingToken,
  availableVariables: FileNamingVariable[],
): string {
  if (token.type === 'static') {
    return token.value === ' ' ? 'Space' : token.value;
  }
  const variable = availableVariables.find((v) => v.value === token.value);
  return variable?.label ?? token.value;
}
