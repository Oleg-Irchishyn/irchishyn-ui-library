import { describe, expect, it } from 'vitest';

import { DEFAULT_FILE_NAMING_VARIABLES, FILE_NAMING_VAR_FUND_GROUP } from '../constants';
import { getTokenDisplayLabel } from '../FileNamingSection.utils';
import type { FileNamingToken, FileNamingVariable } from '../types';

describe('getTokenDisplayLabel', () => {
  it('returns "Space" for a static token with value " "', () => {
    const token: FileNamingToken = { type: 'static', value: ' ' };
    expect(getTokenDisplayLabel(token, DEFAULT_FILE_NAMING_VARIABLES)).toBe('Space');
  });

  it('returns the literal value for a static token (e.g. underscore)', () => {
    const token: FileNamingToken = { type: 'static', value: '_' };
    expect(getTokenDisplayLabel(token, DEFAULT_FILE_NAMING_VARIABLES)).toBe('_');
  });

  it('returns the literal value for a static token with custom text', () => {
    const token: FileNamingToken = { type: 'static', value: '-CC-' };
    expect(getTokenDisplayLabel(token, [])).toBe('-CC-');
  });

  it('returns the variable label when the variable exists in availableVariables', () => {
    const token: FileNamingToken = { type: 'variable', value: FILE_NAMING_VAR_FUND_GROUP };
    expect(getTokenDisplayLabel(token, DEFAULT_FILE_NAMING_VARIABLES)).toBe('Fund Group');
  });

  it('returns the token value when the variable is not in availableVariables', () => {
    const token: FileNamingToken = { type: 'variable', value: 'unknownVar' };
    const variables: FileNamingVariable[] = [
      { label: 'Fund Group', value: FILE_NAMING_VAR_FUND_GROUP },
    ];
    expect(getTokenDisplayLabel(token, variables)).toBe('unknownVar');
  });

  it('returns the token value when availableVariables is empty', () => {
    const token: FileNamingToken = { type: 'variable', value: 'eventType' };
    expect(getTokenDisplayLabel(token, [])).toBe('eventType');
  });

  it('returns the variable label for Event Type when present in list', () => {
    const token: FileNamingToken = { type: 'variable', value: 'eventType' };
    const variables: FileNamingVariable[] = [{ label: 'Event Type', value: 'eventType' }];
    expect(getTokenDisplayLabel(token, variables)).toBe('Event Type');
  });
});
