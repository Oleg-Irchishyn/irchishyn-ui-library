import { DOCUMENT_TEMPLATE_CARD_ACTION_TYPES } from './documentTemplateCardActionTypes';

export const DOCUMENT_TEMPLATE_CARD_ACTION_ARIA_LABELS: Record<string, string> = {
  [DOCUMENT_TEMPLATE_CARD_ACTION_TYPES.SWAP]: 'Swap card position',
  [DOCUMENT_TEMPLATE_CARD_ACTION_TYPES.DELETE]: 'Delete document',
  [DOCUMENT_TEMPLATE_CARD_ACTION_TYPES.SETTINGS]: 'Open template settings',
};
