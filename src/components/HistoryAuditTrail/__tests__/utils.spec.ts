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

    expect(base).toBe(112);
    expect(detailed).toBeGreaterThan(base);
    expect(detailedWithCreatedBy).toBeGreaterThan(detailed);
  });
});
