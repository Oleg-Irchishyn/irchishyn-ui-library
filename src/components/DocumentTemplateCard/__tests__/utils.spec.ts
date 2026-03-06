import { describe, expect, it } from 'vitest';

import {
  normalizeDocumentTemplateCardType,
  resolveDocumentTemplateCardActionAriaLabel,
  resolveDocumentTemplateCardBadgeColor,
  resolveDocumentTemplateCardFileKind,
  resolveDocumentTemplateCardLabel,
} from '../utils';

describe('DocumentTemplateCard utils', () => {
  it('normalizes type values', () => {
    expect(normalizeDocumentTemplateCardType('  Cover   Letter ')).toBe('cover letter');
  });

  it('resolves card label with optional override', () => {
    expect(resolveDocumentTemplateCardLabel('Template', 'Custom Template')).toBe('Custom Template');
    expect(resolveDocumentTemplateCardLabel('Template')).toBe('Template');
  });

  it('resolves file kind by type and extension', () => {
    expect(resolveDocumentTemplateCardFileKind('template', 'template.pdf')).toBe('document');
    expect(resolveDocumentTemplateCardFileKind('cover letter', 'cover.pdf')).toBe('pdf');
    expect(resolveDocumentTemplateCardFileKind('addendum', 'addendum.docx')).toBe('document');
  });

  it('resolves action aria labels with fallback', () => {
    expect(resolveDocumentTemplateCardActionAriaLabel('swap')).toBe('Swap card position');
    expect(resolveDocumentTemplateCardActionAriaLabel('unknown', 'Fallback label')).toBe(
      'Fallback label',
    );
  });

  it('resolves badge colors by type', () => {
    expect(resolveDocumentTemplateCardBadgeColor('addendum')).toBe('warning');
    expect(resolveDocumentTemplateCardBadgeColor('cover letter')).toBe('info');
    expect(resolveDocumentTemplateCardBadgeColor('template')).toBe('info');
  });
});
