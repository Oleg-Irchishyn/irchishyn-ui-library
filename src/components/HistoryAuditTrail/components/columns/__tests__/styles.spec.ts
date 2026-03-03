import type { SxProps, Theme } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { describe, expect, it } from 'vitest';

import {
  getHistoryAuditAvatarStyles,
  getHistoryAuditTimelineColumnStyles,
  getHistoryAuditTimelineLineStyles,
  getHistoryAuditToValueStyles,
  historyAuditDetailsBoxStyles,
  historyAuditFromValueStyles,
  historyAuditTimestampDotStyles,
} from '../styles';

const resolveSxObject = (sx: SxProps<Theme>, theme: Theme): Record<string, unknown> => {
  if (typeof sx === 'function') {
    const resolved = sx(theme);
    return resolved && typeof resolved === 'object' ? (resolved as Record<string, unknown>) : {};
  }
  if (sx && typeof sx === 'object' && !Array.isArray(sx)) {
    return sx as Record<string, unknown>;
  }
  return {};
};

describe('HistoryAuditTrail column styles', () => {
  it('builds timeline styles for first/last row combinations', () => {
    const theme = createTheme();
    const firstLast = resolveSxObject(getHistoryAuditTimelineLineStyles(20, true, true, 0), theme);
    const middle = resolveSxObject(getHistoryAuditTimelineLineStyles(20, false, false, 10), theme);

    expect(getHistoryAuditTimelineColumnStyles(40)).toMatchObject({ width: 40, py: 2 });
    expect(firstLast.top).toContain('calc(');
    expect(firstLast.bottom).toContain('calc(');
    expect(middle.top).toBe('-10px');
    expect(middle.bottom).toBe('-10px');
  });

  it('builds avatar styles with and without overrides', () => {
    const theme = createTheme();
    const baseAvatar = getHistoryAuditAvatarStyles(40, () => ({ bgcolor: 'red' }));
    const withOverrides = getHistoryAuditAvatarStyles(40, () => ({ bgcolor: 'red' }), {
      backgroundColor: '#00A9E0',
      iconColor: '#fff',
      borderColor: '#111',
    });

    const resolvedBase = resolveSxObject(baseAvatar, theme);
    const resolvedOverride = resolveSxObject(withOverrides, theme);

    expect(resolvedBase.width).toBe(40);
    expect(resolvedBase.border).toBe('1px solid');
    expect(resolvedOverride.bgcolor).toBe('#00A9E0');
    expect(resolvedOverride.color).toBe('#fff');
    expect(resolvedOverride.borderColor).toBe('#111');
  });

  it('builds details/change styles with branches', () => {
    const light = createTheme({ palette: { mode: 'light' } });
    const dark = createTheme({ palette: { mode: 'dark' } });

    const detailsLight = resolveSxObject(historyAuditDetailsBoxStyles, light);
    const detailsDark = resolveSxObject(historyAuditDetailsBoxStyles, dark);
    const fromStyles = resolveSxObject(historyAuditFromValueStyles, light);
    const toWithFrom = resolveSxObject(getHistoryAuditToValueStyles(true), light);
    const toWithoutFrom = resolveSxObject(getHistoryAuditToValueStyles(false), light);

    expect(detailsLight.backgroundColor).toBe(light.palette.grey[50]);
    expect(detailsDark.backgroundColor).toBe(dark.palette.action.hover);
    expect(fromStyles.backgroundColor).toContain(light.palette.error.main);
    expect(toWithFrom.border).toBe('none');
    expect(String(toWithoutFrom.border)).toContain(light.palette.divider);
    expect(historyAuditTimestampDotStyles).toMatchObject({ width: 6, height: 6 });
  });
});
