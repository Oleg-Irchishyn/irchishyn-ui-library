import type { MouseEvent, ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';

import type { DOCUMENT_TEMPLATE_CARD_ACTION_TYPES } from './constants';

export type DocumentTemplateCardActionType =
  | (typeof DOCUMENT_TEMPLATE_CARD_ACTION_TYPES)[keyof typeof DOCUMENT_TEMPLATE_CARD_ACTION_TYPES]
  | (string & {});

export type DocumentTemplateCardFileKind = 'pdf' | 'document';

export interface DocumentTemplateCardActionContext {
  cardType: string;
  label: string;
  fileName: string;
  selected: boolean;
  actionType: DocumentTemplateCardActionType;
}

export interface DocumentTemplateCardAction {
  type: DocumentTemplateCardActionType;
  onClick?: (
    context: DocumentTemplateCardActionContext,
    event: MouseEvent<HTMLButtonElement>,
  ) => void;
  disabled?: boolean;
  ariaLabel?: string;
  icon?: ReactNode;
}

export interface DocumentTemplateCardProps {
  type: string;
  label?: string;
  fileName: string;
  selected?: boolean;
  actions?: DocumentTemplateCardAction[];
  onClick?: () => void;
  sx?: SxProps<Theme>;
}

export interface UseDocumentTemplateCardParams {
  type: string;
  label?: string;
  fileName: string;
  selected?: boolean;
  actions?: DocumentTemplateCardAction[];
  onClick?: () => void;
}

export interface ResolvedDocumentTemplateCardAction {
  type: DocumentTemplateCardActionType;
  icon: ReactNode;
  disabled: boolean;
  ariaLabel: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

export interface UseDocumentTemplateCardResult {
  cardLabel: string;
  fileKind: DocumentTemplateCardFileKind;
  normalizedType: string;
  actions: ResolvedDocumentTemplateCardAction[];
  handleCardClick: () => void;
  fileNameRef: (node: HTMLParagraphElement | null) => void;
  showFileNameTooltip: boolean;
}
