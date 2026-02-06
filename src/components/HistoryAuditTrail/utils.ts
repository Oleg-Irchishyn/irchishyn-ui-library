import type { Theme } from '@mui/material/styles';
import { colorSchemeDark, colorSchemeLight, themeAlpine } from 'ag-grid-community';
import type { Theme as AgGridTheme } from 'ag-grid-community';

import { HISTORY_AUDIT_EVENT_TYPES } from './constants';

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
