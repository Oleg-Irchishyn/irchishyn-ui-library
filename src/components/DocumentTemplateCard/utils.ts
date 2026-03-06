import {
  DOCUMENT_TEMPLATE_CARD_ACTION_ARIA_LABELS,
  DOCUMENT_TEMPLATE_CARD_TYPES,
} from './constants';
import type { DocumentTemplateCardActionType, DocumentTemplateCardFileKind } from './types';
import type { BadgeColorPreset } from '../../types';

export const normalizeDocumentTemplateCardType = (type: string): string =>
  type.trim().toLowerCase().replace(/\s+/g, ' ');

export const resolveDocumentTemplateCardLabel = (type: string, label?: string): string =>
  label?.trim() || type;

export const resolveDocumentTemplateCardFileKind = (
  normalizedType: string,
  fileName: string,
): DocumentTemplateCardFileKind => {
  if (normalizedType === DOCUMENT_TEMPLATE_CARD_TYPES.TEMPLATE) {
    return 'document';
  }

  return fileName.trim().toLowerCase().endsWith('.pdf') ? 'pdf' : 'document';
};

export const resolveDocumentTemplateCardActionAriaLabel = (
  actionType: DocumentTemplateCardActionType,
  fallback = 'Document card action',
) => DOCUMENT_TEMPLATE_CARD_ACTION_ARIA_LABELS[actionType] ?? fallback;

export const resolveDocumentTemplateCardBadgeColor = (normalizedType: string): BadgeColorPreset => {
  if (normalizedType === DOCUMENT_TEMPLATE_CARD_TYPES.ADDENDUM) {
    return 'warning';
  }

  return 'info';
};
