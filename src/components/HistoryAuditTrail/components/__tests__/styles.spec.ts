import type { SxProps, Theme } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { describe, expect, it } from 'vitest';

import {
  getHistoryAuditTableStyles,
  historyAuditExportButtonStyles,
  historyAuditHeaderStyles,
  historyAuditListItemIconStyles,
  historyAuditLoaderStyles,
  historyAuditModuleDropdownPaperStyles,
  historyAuditModuleDropdownStyles,
  historyAuditSearchInputStyles,
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

describe('HistoryAuditTrail component styles', () => {
  it('resolves export/search/dropdown styles in light and dark themes', () => {
    const light = createTheme({ palette: { mode: 'light' } });
    const dark = createTheme({ palette: { mode: 'dark' } });

    const exportLight = resolveSxObject(historyAuditExportButtonStyles, light);
    const exportDark = resolveSxObject(historyAuditExportButtonStyles, dark);
    const searchLight = resolveSxObject(historyAuditSearchInputStyles, light);
    const searchDark = resolveSxObject(historyAuditSearchInputStyles, dark);
    const dropdownLight = resolveSxObject(historyAuditModuleDropdownStyles, light);
    const dropdownPaperLight = resolveSxObject(historyAuditModuleDropdownPaperStyles, light);

    expect(exportLight.backgroundColor).toBe(light.palette.common.white);
    expect(exportDark.backgroundColor).toBe(dark.palette.background.paper);
    expect(searchLight.backgroundColor).toBe(light.palette.common.white);
    expect(searchDark.backgroundColor).toBe(dark.palette.background.paper);
    expect(dropdownLight.width).toBe(176);
    expect(String(dropdownPaperLight.border)).toContain(light.palette.divider);
  });

  it('builds ag-grid table styles and merges external sx', () => {
    const styles = getHistoryAuditTableStyles(500, { mt: 2 });
    expect(Array.isArray(styles)).toBe(true);
    if (Array.isArray(styles)) {
      expect(styles[0]).toMatchObject({ width: '100%', height: 500 });
      expect(styles[1]).toEqual({ mt: 2 });
    }

    const stylesWithArray = getHistoryAuditTableStyles('50vh', [{ mt: 1 }, { mb: 2 }]);
    expect(Array.isArray(stylesWithArray)).toBe(true);
    if (Array.isArray(stylesWithArray)) {
      expect(stylesWithArray).toHaveLength(3);
    }
  });

  it('exports static styles', () => {
    expect(historyAuditListItemIconStyles).toEqual({ minWidth: 32 });
    expect(historyAuditHeaderStyles).toMatchObject({ display: 'flex' });
    expect(historyAuditLoaderStyles).toMatchObject({ py: 6 });
  });
});
