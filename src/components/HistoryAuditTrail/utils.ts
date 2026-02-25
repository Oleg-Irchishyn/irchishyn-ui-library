import type { Theme } from '@mui/material/styles';
import { colorSchemeDark, colorSchemeLight, themeAlpine } from 'ag-grid-community';
import type { Theme as AgGridTheme } from 'ag-grid-community';

import type { HistoryAuditTrailEvent } from './types';
import {
  HISTORY_AUDIT_DETAIL_LABEL_BY_KEY,
  HISTORY_AUDIT_TRIGGERED_BY_ACTION_KEYS,
  HISTORY_AUDIT_TRIGGERED_BY_ACTION_KEYS_FALLBACK,
  HISTORY_AUDIT_TRIGGERED_BY_PREFIX,
  HISTORY_AUDIT_TRIGGERED_BY_USER_KEYS,
  HISTORY_AUDIT_TRIGGERED_BY_USER_KEYS_FALLBACK,
  HISTORY_AUDIT_EVENT_TYPES,
} from './constants';

export const createHistoryAuditAgGridTheme = (muiTheme: Theme): AgGridTheme => {
  const isDark = muiTheme.palette.mode === 'dark';

  return themeAlpine.withPart(isDark ? colorSchemeDark : colorSchemeLight).withParams({
    accentColor: muiTheme.palette.primary.main,
    backgroundColor: muiTheme.palette.background.default,
    foregroundColor: muiTheme.palette.text.primary,
    borderColor: muiTheme.palette.divider,
    headerBackgroundColor: muiTheme.palette.background.paper,
    headerTextColor: muiTheme.palette.text.secondary,
    fontFamily: muiTheme.typography.fontFamily,
  });
};

export const formatHistoryAuditTimestamp = (value: string, locale = 'en-US'): string => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;

  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(d);
};

export const formatHistoryAuditRelativeTime = (value: string, now = new Date()): string | null => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;

  const diffMs = d.getTime() - now.getTime();
  const diffAbs = Math.abs(diffMs);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffAbs < hour) return rtf.format(Math.round(diffMs / minute), 'minute');
  if (diffAbs < day) return rtf.format(Math.round(diffMs / hour), 'hour');
  return rtf.format(Math.round(diffMs / day), 'day');
};

export const getHistoryAuditAvatarStyle = (auditEventType: string) => {
  switch (auditEventType) {
    case HISTORY_AUDIT_EVENT_TYPES.ADDED:
    case HISTORY_AUDIT_EVENT_TYPES.CREATED:
      return (theme: Theme) => ({
        bgcolor: theme.palette.info.light,
        color: theme.palette.info.dark,
        borderColor: `${theme.palette.info.main}55`,
      });
    case HISTORY_AUDIT_EVENT_TYPES.UPDATED:
      return (theme: Theme) => ({
        bgcolor: theme.palette.warning.light,
        color: theme.palette.warning.dark,
        borderColor: `${theme.palette.warning.main}55`,
      });
    case HISTORY_AUDIT_EVENT_TYPES.DELETED:
    case HISTORY_AUDIT_EVENT_TYPES.REMOVED:
      return (theme: Theme) => ({
        bgcolor: theme.palette.error.light,
        color: theme.palette.error.dark,
        borderColor: `${theme.palette.error.main}55`,
      });
    case HISTORY_AUDIT_EVENT_TYPES.OTHER:
    default:
      return (theme: Theme) => ({
        bgcolor: theme.palette.grey[100],
        color: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
      });
  }
};

export const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

export const normalizeDetailKey = (key: string) => key.trim().toUpperCase();

export const titleCaseFromKey = (key: string) =>
  key
    .trim()
    .replace(/[_-]+/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

export const detailLabelForKey = (key: string) => {
  const k = normalizeDetailKey(key);
  return HISTORY_AUDIT_DETAIL_LABEL_BY_KEY[k] ?? titleCaseFromKey(key);
};

export const extractTriggeredBy = (items: Array<{ key: string; value: string }>) => {
  const get = (wantedKeys: readonly string[]) =>
    items.find((i) => wantedKeys.includes(normalizeDetailKey(i.key)))?.value?.trim() ?? null;

  const userName =
    get(HISTORY_AUDIT_TRIGGERED_BY_USER_KEYS) ?? get(HISTORY_AUDIT_TRIGGERED_BY_USER_KEYS_FALLBACK);
  const action =
    get(HISTORY_AUDIT_TRIGGERED_BY_ACTION_KEYS) ??
    get(HISTORY_AUDIT_TRIGGERED_BY_ACTION_KEYS_FALLBACK);

  if (!isNonEmptyString(userName ?? undefined) && !isNonEmptyString(action ?? undefined))
    return null;
  return {
    userName: isNonEmptyString(userName ?? undefined) ? userName : null,
    action: isNonEmptyString(action ?? undefined) ? action : null,
  };
};

export const isTriggeredByKey = (key: string) =>
  normalizeDetailKey(key).startsWith(HISTORY_AUDIT_TRIGGERED_BY_PREFIX);

export const getHistoryAuditRowHeight = (event?: HistoryAuditTrailEvent | null) => {
  const baseHeight = 112;
  if (!event) return baseHeight;

  const hasDetailsText = isNonEmptyString(event.details);
  const detailsTextLength = hasDetailsText ? event.details!.trim().length : 0;
  const detailsLines = hasDetailsText
    ? Math.min(6, Math.max(1, Math.ceil(detailsTextLength / 70)))
    : 0;

  const fieldChanges = (event.fieldChanges ?? []).filter(
    (c) => isNonEmptyString(c?.fieldName) || c?.oldValue != null || c?.newValue != null,
  );

  const fieldChangeLineCount =
    fieldChanges.length > 0
      ? fieldChanges.reduce((sum, c) => {
          const hasFieldLabel = isNonEmptyString(c.fieldName);
          const hasValueChange = c.oldValue != null || c.newValue != null;
          return sum + (hasFieldLabel ? 1 : 0) + (hasValueChange ? 1 : 0);
        }, 0)
      : event.oldValue != null || event.newValue != null
        ? 1
        : 0;

  const additionalDetails = (event.additionalDetails ?? []).filter(
    (i) => isNonEmptyString(i?.key) && isNonEmptyString(i?.value),
  );
  const triggeredByCount = additionalDetails.filter((i) => isTriggeredByKey(i.key)).length;
  const contextualDetails = additionalDetails.filter((i) => !isTriggeredByKey(i.key));

  const triggeredByLines = triggeredByCount > 0 ? 1 : 0;
  const contextualLines = contextualDetails.reduce((sum, item) => {
    const valueLen = item.value.trim().length;
    const estimatedLines = Math.max(1, Math.ceil(valueLen / 42));
    return sum + Math.min(3, estimatedLines);
  }, 0);

  const lineHeight = 26;
  const extraPadding = 18;
  return (
    baseHeight +
    (detailsLines + fieldChangeLineCount + triggeredByLines + contextualLines) * lineHeight +
    extraPadding
  );
};
