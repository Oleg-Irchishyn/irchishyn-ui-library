import type { SxProps, Theme } from '@mui/material/styles';
import { alpha, createTheme } from '@mui/material/styles';
import { describe, expect, it } from 'vitest';

import {
  documentTemplateCardActionBarStyles,
  documentTemplateCardFooterStyles,
  documentTemplateCardPreviewStyles,
  getDocumentTemplateCardActionButtonStyles,
  getDocumentTemplateCardBadgeStyles,
  getDocumentTemplateCardFileIconContainerStyles,
  getDocumentTemplateCardFileNameStyles,
  getDocumentTemplateCardRootStyles,
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

describe('DocumentTemplateCard styles', () => {
  it('resolves root styles for selected and clickable states', () => {
    const light = createTheme({ palette: { mode: 'light' } });
    const selectedRoot = resolveSxObject(getDocumentTemplateCardRootStyles(true, true), light);
    const unselectedRoot = resolveSxObject(getDocumentTemplateCardRootStyles(false, false), light);

    expect(selectedRoot.borderColor).toBe(light.palette.primary.main);
    expect(selectedRoot.cursor).toBe('pointer');
    expect(unselectedRoot.borderColor).toBe(light.palette.divider);
    expect(unselectedRoot.cursor).toBe('default');
  });

  it('resolves action bar and preview styles in dark mode', () => {
    const dark = createTheme({ palette: { mode: 'dark' } });
    const actionBar = resolveSxObject(documentTemplateCardActionBarStyles, dark);
    const preview = resolveSxObject(documentTemplateCardPreviewStyles, dark);

    expect(actionBar.backgroundColor).toBe(alpha(dark.palette.text.primary, 0.08));
    expect(preview.backgroundColor).toBe(alpha(dark.palette.text.primary, 0.08));
  });

  it('resolves action button styles for danger and normal states', () => {
    const light = createTheme({ palette: { mode: 'light' } });
    const danger = resolveSxObject(getDocumentTemplateCardActionButtonStyles(true), light);
    const normal = resolveSxObject(getDocumentTemplateCardActionButtonStyles(false), light);

    expect(danger.color).toBe(light.palette.error.main);
    expect(normal.color).toBe(light.palette.text.secondary);
  });

  it('resolves badge styles for template and non-template', () => {
    const light = createTheme({ palette: { mode: 'light' } });
    const templateBadge = resolveSxObject(getDocumentTemplateCardBadgeStyles(true), light);
    const regularBadge = resolveSxObject(getDocumentTemplateCardBadgeStyles(false), light);

    expect(templateBadge.backgroundColor).toBe(light.palette.primary.main);
    expect(templateBadge.color).toBe(light.palette.primary.contrastText);
    expect(regularBadge.backgroundColor).toBeUndefined();
  });

  it('resolves file icon container and footer/file name styles', () => {
    const light = createTheme({ palette: { mode: 'light' } });
    const pdfContainer = resolveSxObject(
      getDocumentTemplateCardFileIconContainerStyles(true),
      light,
    );
    const docContainer = resolveSxObject(
      getDocumentTemplateCardFileIconContainerStyles(false),
      light,
    );
    const footer = resolveSxObject(documentTemplateCardFooterStyles, light);
    const selectedFileName = resolveSxObject(getDocumentTemplateCardFileNameStyles(true), light);
    const defaultFileName = resolveSxObject(getDocumentTemplateCardFileNameStyles(false), light);

    expect(pdfContainer.backgroundColor).toBe(light.palette.background.paper);
    expect(docContainer.backgroundColor).toBe('transparent');
    expect(String(footer.borderTop)).toContain(light.palette.divider);
    expect(selectedFileName.color).toBe(light.palette.primary.main);
    expect(defaultFileName.color).toBe(light.palette.text.primary);
  });
});
