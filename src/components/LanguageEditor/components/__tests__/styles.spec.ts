import type { SxProps, Theme } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { describe, expect, it } from 'vitest';

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
  it('builds validation styles for both valid and invalid states', () => {
    const valid = getLanguageEditorValidationBannerStyles(true);
    const invalid = getLanguageEditorValidationBannerStyles(false);

    expect(valid).toMatchObject({ backgroundColor: 'success.light' });
    expect(invalid).toMatchObject({ backgroundColor: 'error.light' });
  });

  it('builds editable area styles for readOnly and editable modes', () => {
    const readOnly = getLanguageEditorEditableAreaStyles('250px', true);
    const editable = getLanguageEditorEditableAreaStyles('200px', false);

    expect(readOnly).toMatchObject({ minHeight: '250px', cursor: 'default' });
    expect(editable).toMatchObject({ minHeight: '200px', cursor: 'text' });
  });

  it('resolves theme-based menu and search styles', () => {
    const light = createTheme({ palette: { mode: 'light' } });
    const menu = resolveSxObject(languageEditorFieldMenuPaperStyles, light);
    const search = resolveSxObject(languageEditorFieldSearchInputStyles, light);

    expect(menu.minWidth).toBe(280);
    expect(search.backgroundColor).toBe(light.palette.grey[100]);
  });

  it('builds field type chip and shared style constants', () => {
    const theme = createTheme({ palette: { mode: 'light' } });
    const chipStyles = getLanguageEditorFieldTypeChipStyles({ bg: '#111', text: '#eee' });
    expect(chipStyles).toMatchObject({ backgroundColor: '#111', color: '#eee' });
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
