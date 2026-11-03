import type { SxProps, Theme } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { describe, expect, it } from 'vitest';

import { info } from '../../../../tokens';

import {
  getLanguageEditorEditableAreaStyles,
  getLanguageEditorFieldTypeChipStyles,
  getLanguageEditorValidationBannerStyles,
  languageEditorClauseBooleanValueControlStyles,
  languageEditorClauseTextValueInputStyles,
  languageEditorElseIfTagStyles,
  languageEditorFieldMenuPaperStyles,
  languageEditorFieldSearchInputStyles,
  languageEditorIfTagStyles,
  languageEditorPaperStyles,
  languageEditorToolbarStyles,
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

describe('LanguageEditor component styles', () => {
  it('builds validation styles for both valid and invalid states (less saturated, theme-based)', () => {
    const theme = createTheme({ palette: { mode: 'light' } });
    const valid = resolveSxObject(getLanguageEditorValidationBannerStyles(true), theme);
    const invalid = resolveSxObject(getLanguageEditorValidationBannerStyles(false), theme);

    expect(valid.display).toBe('flex');
    expect(String(valid.backgroundColor)).toMatch(/^rgba\(/);
    expect(String(invalid.backgroundColor)).toMatch(/^rgba\(/);
    expect(valid.backgroundColor).not.toBe(invalid.backgroundColor);
  });

  it('builds editable area styles for readOnly and editable modes', () => {
    const readOnly = getLanguageEditorEditableAreaStyles('250px', true);
    const editable = getLanguageEditorEditableAreaStyles('200px', false);

    expect(readOnly).toMatchObject({ minHeight: '250px', cursor: 'default' });
    expect(editable).toMatchObject({ minHeight: '200px', cursor: 'text' });
  });

  it('resolves theme-based menu and search styles', () => {
    const light = createTheme({ palette: { mode: 'light' } });
    const dark = createTheme({ palette: { mode: 'dark' } });
    const menu = resolveSxObject(languageEditorFieldMenuPaperStyles, light);
    const searchLight = resolveSxObject(languageEditorFieldSearchInputStyles, light);
    const searchDark = resolveSxObject(languageEditorFieldSearchInputStyles, dark);

    expect(menu.minWidth).toBe(280);
    expect(searchLight.backgroundColor).toBe(light.palette.grey[100]);
    expect(searchDark.backgroundColor).toBe(dark.palette.grey[800]);
  });

  it('builds field type chip and shared style constants', () => {
    const theme = createTheme({ palette: { mode: 'light' } });
    const chipStyles = getLanguageEditorFieldTypeChipStyles({ bg: info.light, text: info.dark });
    expect(chipStyles).toMatchObject({ backgroundColor: info.light, color: info.dark });
    expect(languageEditorPaperStyles).toMatchObject({ overflow: 'hidden' });
    expect(resolveSxObject(languageEditorToolbarStyles, theme)).toMatchObject({
      display: 'flex',
      backgroundColor: theme.palette.background.paper,
    });
    expect(languageEditorClauseBooleanValueControlStyles).toMatchObject({ minWidth: 120 });
    expect(languageEditorClauseTextValueInputStyles).toMatchObject({ minWidth: 140 });
    expect(languageEditorIfTagStyles).toMatchObject({ bgcolor: expect.any(String) });
    expect(languageEditorElseIfTagStyles).toMatchObject({ bgcolor: expect.any(String) });
  });
});
