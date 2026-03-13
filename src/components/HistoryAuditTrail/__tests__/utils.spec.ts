import { describe, expect, it } from 'vitest';

import {
  createHistoryAuditAgGridTheme,
  detailLabelForKey,
  extractTriggeredBy,
  formatHistoryAuditRelativeTime,
  formatHistoryAuditTimestamp,
  getHistoryAuditAvatarStyle,
  getHistoryAuditRowHeight,
  isNonEmptyString,
  isTriggeredByKey,
  normalizeDetailKey,
  sortContextualDetails,
  titleCaseFromKey,
} from '../utils';
import { HISTORY_AUDIT_EVENT_TYPES } from '../constants';

describe('HistoryAudit utils', () => {
  it('formats timestamp and falls back for invalid date', () => {
    expect(formatHistoryAuditTimestamp('invalid-date')).toBe('invalid-date');
    const formatted = formatHistoryAuditTimestamp('2026-01-01T00:00:00.000Z');
    expect(typeof formatted).toBe('string');
    expect(formatted.length).toBeGreaterThan(0);
  });

  it('formats relative time by minute/hour/day and handles invalid date', () => {
    const now = new Date('2026-01-02T00:00:00.000Z');
    expect(formatHistoryAuditRelativeTime('2026-01-01T23:45:00.000Z', now)).toContain('minute');
    expect(formatHistoryAuditRelativeTime('2026-01-01T21:00:00.000Z', now)).toContain('hour');
    expect(formatHistoryAuditRelativeTime('2025-12-30T00:00:00.000Z', now)).toContain('day');
    expect(formatHistoryAuditRelativeTime('not-a-date', now)).toBeNull();
  });

  it('normalizes and resolves detail labels', () => {
    expect(normalizeDetailKey(' triggered_by_user ')).toBe('TRIGGERED_BY_USER');
    expect(titleCaseFromKey('custom_detail-key')).toBe('Custom Detail Key');
    expect(detailLabelForKey('CONFIGURATION')).toBe('Configuration');
    expect(detailLabelForKey('custom_detail')).toBe('Custom Detail');
  });

  it('extracts triggered-by details and checks triggered key', () => {
    const result = extractTriggeredBy([
      { key: 'TRIGGERED_BY_USER', value: 'Workflow Engine' },
      { key: 'TRIGGERED_BY_ACTION', value: 'Auto Approve' },
    ]);

    expect(result?.userName).toBe('Workflow Engine');
    expect(result?.action).toBe('Auto Approve');
    expect(isTriggeredByKey('TRIGGERED_BY_USER')).toBe(true);
    expect(isTriggeredByKey('CONFIGURATION')).toBe(false);
  });

  it('supports triggered-by fallback keys and returns null when values are blank', () => {
    const fallbackResult = extractTriggeredBy([
      { key: 'TRIGGEREDBYUSER', value: 'Workflow Service' },
      { key: 'TRIGGEREDBYACTION', value: 'batch_process' },
    ]);
    expect(fallbackResult?.userName).toBe('Workflow Service');
    expect(fallbackResult?.action).toBe('batch_process');

    const blankResult = extractTriggeredBy([
      { key: 'TRIGGERED_BY_USER', value: '   ' },
      { key: 'TRIGGERED_BY_ACTION', value: '' },
    ]);
    expect(blankResult).toBeNull();
  });

  it('checks non-empty strings', () => {
    expect(isNonEmptyString(' hello ')).toBe(true);
    expect(isNonEmptyString('  ')).toBe(false);
    expect(isNonEmptyString(null)).toBe(false);
  });

  it('returns avatar styles for event types', () => {
    const theme = {
      palette: {
        mode: 'light',
        info: { main: '#1', light: '#2', dark: '#3' },
        warning: { main: '#4', light: '#5', dark: '#6' },
        error: { main: '#7', light: '#8', dark: '#9' },
        grey: { 100: '#a', 800: '#b' },
        text: { primary: '#c', secondary: '#d' },
        divider: '#e',
      },
    };

    const createdStyle = getHistoryAuditAvatarStyle(HISTORY_AUDIT_EVENT_TYPES.CREATED);
    const updatedStyle = getHistoryAuditAvatarStyle(HISTORY_AUDIT_EVENT_TYPES.UPDATED);
    const deletedStyle = getHistoryAuditAvatarStyle(HISTORY_AUDIT_EVENT_TYPES.DELETED);
    const otherStyle = getHistoryAuditAvatarStyle(HISTORY_AUDIT_EVENT_TYPES.OTHER);

    expect(createdStyle(theme as never).bgcolor).toBe('#2');
    expect(updatedStyle(theme as never).color).toBe('#6');
    expect(deletedStyle(theme as never).borderColor).toBe('#755');
    expect(otherStyle(theme as never).borderColor).toBe('#e');
  });

  it('returns dark-mode avatar styles for added and removed event families', () => {
    const darkTheme = {
      palette: {
        mode: 'dark',
        info: { main: '#11', light: '#12', dark: '#13' },
        warning: { main: '#21', light: '#22', dark: '#23' },
        error: { main: '#31', light: '#32', dark: '#33' },
        grey: { 100: '#41', 800: '#42' },
        text: { primary: '#51', secondary: '#52' },
        divider: '#61',
      },
    };

    const addedStyle = getHistoryAuditAvatarStyle(HISTORY_AUDIT_EVENT_TYPES.ADDED)(
      darkTheme as never,
    );
    const removedStyle = getHistoryAuditAvatarStyle(HISTORY_AUDIT_EVENT_TYPES.REMOVED)(
      darkTheme as never,
    );

    expect(addedStyle.bgcolor).toBe('#1126');
    expect(addedStyle.borderColor).toBe('#1180');
    expect(removedStyle.color).toBe('#32');
    expect(removedStyle.borderColor).toBe('#3180');
  });

  it('creates AG Grid theme for both light and dark modes', () => {
    const lightTheme = {
      palette: {
        mode: 'light',
        primary: { main: '#00A9E0' },
        background: { default: '#fafafa', paper: '#ffffff' },
        text: { primary: '#111111', secondary: '#666666' },
        divider: '#dddddd',
      },
      typography: { fontFamily: 'Inter' },
    };

    const darkTheme = {
      palette: {
        mode: 'dark',
        primary: { main: '#53D5FF' },
        background: { default: '#121212', paper: '#1e1e1e' },
        text: { primary: '#ffffff', secondary: '#bdbdbd' },
        divider: '#2d2d2d',
      },
      typography: { fontFamily: 'Inter' },
    };

    const lightAgGridTheme = createHistoryAuditAgGridTheme(lightTheme as never);
    const darkAgGridTheme = createHistoryAuditAgGridTheme(darkTheme as never);

    expect(lightAgGridTheme).toBeTruthy();
    expect(darkAgGridTheme).toBeTruthy();
    expect(typeof lightAgGridTheme).toBe('object');
    expect(typeof darkAgGridTheme).toBe('object');
  });

  it('calculates row heights based on content complexity', () => {
    const base = getHistoryAuditRowHeight(null);
    const detailed = getHistoryAuditRowHeight({
      id: '1',
      username: 'SYSTEM',
      auditEventType: 'UPDATED',
      timestamp: '2026-01-01T00:00:00.000Z',
      details:
        'This is a long details value that should increase the rendered row height with multiple lines.',
      fieldChanges: [{ fieldName: 'Status', oldValue: 'Pending', newValue: 'Approved' }],
      additionalDetails: [
        { key: 'TRIGGERED_BY_USER', value: 'Workflow Engine' },
        { key: 'CONFIGURATION', value: 'Very long configuration value for wrapping checks' },
      ],
    });
    const detailedWithCreatedBy = getHistoryAuditRowHeight({
      id: '2',
      username: 'SYSTEM',
      createdBy: 'workflow.engine@gen2fund.com',
      auditEventType: 'UPDATED',
      timestamp: '2026-01-01T00:00:00.000Z',
      details:
        'This is a long details value that should increase the rendered row height with multiple lines.',
      fieldChanges: [{ fieldName: 'Status', oldValue: 'Pending', newValue: 'Approved' }],
      additionalDetails: [
        { key: 'TRIGGERED_BY_USER', value: 'Workflow Engine' },
        { key: 'CONFIGURATION', value: 'Very long configuration value for wrapping checks' },
      ],
    });

    expect(base).toBe(84);
    expect(detailed).toBeGreaterThan(base);
    expect(detailedWithCreatedBy).toBeGreaterThan(detailed);
  });

  it('uses legacy old/new values when fieldChanges is empty and counts triggered/context lines', () => {
    const withLegacyChanges = getHistoryAuditRowHeight({
      id: 'legacy',
      username: 'SYSTEM',
      auditEventType: 'UPDATED',
      timestamp: '2026-01-01T00:00:00.000Z',
      oldValue: 'old',
      newValue: 'new',
      additionalDetails: [
        { key: 'TRIGGERED_BY_USER', value: 'workflow' },
        {
          key: 'CONFIGURATION',
          value:
            'This is a very long contextual value that should wrap to multiple lines and be capped.',
        },
      ],
    });

    const withoutExtras = getHistoryAuditRowHeight({
      id: 'legacy-2',
      username: 'SYSTEM',
      auditEventType: 'UPDATED',
      timestamp: '2026-01-01T00:00:00.000Z',
      oldValue: 'old',
      newValue: 'new',
      additionalDetails: [{ key: 'CONFIGURATION', value: 'x' }],
    });

    expect(withLegacyChanges).toBeGreaterThan(withoutExtras);
  });

  it('sortContextualDetails orders by canonical key priority and preserves unknown keys at end', () => {
    const input = [
      { key: 'CONFIG_VERSION', value: '7' },
      { key: 'CUSTOM_FIELD', value: 'foo' },
      { key: 'CONFIGURATION', value: 'Acme Corp' },
      { key: 'ITERATION', value: '3' },
    ];

    const sorted = sortContextualDetails(input);

    expect(sorted[0].key).toBe('ITERATION');
    expect(sorted[1].key).toBe('CONFIGURATION');
    expect(sorted[2].key).toBe('CONFIG_VERSION');
    expect(sorted[3].key).toBe('CUSTOM_FIELD');
  });

  it('sortContextualDetails treats CONFIG_NAME and CONFIGURATION_NAME as Configuration-priority', () => {
    const input = [
      { key: 'CONFIG_VERSION', value: '2' },
      { key: 'CONFIG_NAME', value: 'Plan A' },
      { key: 'ITERATION', value: '1' },
    ];

    const sorted = sortContextualDetails(input);

    expect(sorted[0].key).toBe('ITERATION');
    expect(sorted[1].key).toBe('CONFIG_NAME');
    expect(sorted[2].key).toBe('CONFIG_VERSION');
  });

  it('sortContextualDetails does not mutate the original array', () => {
    const input = [
      { key: 'CONFIG_VERSION', value: '1' },
      { key: 'ITERATION', value: '2' },
    ];
    const original = [...input];
    sortContextualDetails(input);
    expect(input).toEqual(original);
  });
});
