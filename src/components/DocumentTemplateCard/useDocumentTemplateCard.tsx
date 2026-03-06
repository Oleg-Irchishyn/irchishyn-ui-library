import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MoveHorizontal, Settings, Trash2 } from 'lucide-react';

import { DOCUMENT_TEMPLATE_CARD_ACTION_TYPES } from './constants';
import {
  normalizeDocumentTemplateCardType,
  resolveDocumentTemplateCardActionAriaLabel,
  resolveDocumentTemplateCardFileKind,
  resolveDocumentTemplateCardLabel,
} from './utils';
import type {
  ResolvedDocumentTemplateCardAction,
  UseDocumentTemplateCardParams,
  UseDocumentTemplateCardResult,
} from './types';

const getDefaultActionIcon = (actionType: string) => {
  if (actionType === DOCUMENT_TEMPLATE_CARD_ACTION_TYPES.DELETE) {
    return <Trash2 size={14} />;
  }
  if (actionType === DOCUMENT_TEMPLATE_CARD_ACTION_TYPES.SETTINGS) {
    return <Settings size={14} />;
  }
  return <MoveHorizontal size={14} />;
};

export const useDocumentTemplateCard = ({
  type,
  label,
  fileName,
  selected = false,
  actions = [],
  onClick,
}: UseDocumentTemplateCardParams): UseDocumentTemplateCardResult => {
  const normalizedType = useMemo(() => normalizeDocumentTemplateCardType(type), [type]);
  const cardLabel = useMemo(() => resolveDocumentTemplateCardLabel(type, label), [label, type]);
  const fileKind = useMemo(
    () => resolveDocumentTemplateCardFileKind(normalizedType, fileName),
    [normalizedType, fileName],
  );

  const [showFileNameTooltip, setShowFileNameTooltip] = useState(false);
  const fileNameNodeRef = useRef<HTMLParagraphElement | null>(null);

  const updateFileNameOverflowState = useCallback(() => {
    const node = fileNameNodeRef.current;
    if (!node) {
      setShowFileNameTooltip(false);
      return;
    }

    setShowFileNameTooltip(node.scrollWidth > node.clientWidth);
  }, []);

  const fileNameRef = useCallback(
    (node: HTMLParagraphElement | null) => {
      fileNameNodeRef.current = node;
      updateFileNameOverflowState();
    },
    [updateFileNameOverflowState],
  );

  useEffect(() => {
    updateFileNameOverflowState();
  }, [updateFileNameOverflowState, fileName]);

  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return;
    if (!fileNameNodeRef.current) return;

    const observer = new ResizeObserver(() => {
      updateFileNameOverflowState();
    });

    observer.observe(fileNameNodeRef.current);
    return () => observer.disconnect();
  }, [updateFileNameOverflowState]);

  const handleCardClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  const resolvedActions = useMemo<ResolvedDocumentTemplateCardAction[]>(
    () =>
      actions.map((action) => ({
        type: action.type,
        icon: action.icon ?? getDefaultActionIcon(action.type),
        disabled: Boolean(action.disabled),
        ariaLabel: action.ariaLabel ?? resolveDocumentTemplateCardActionAriaLabel(action.type),
        onClick: (event) => {
          event.stopPropagation();
          action.onClick?.(
            {
              cardType: type,
              label: cardLabel,
              fileName,
              selected,
              actionType: action.type,
            },
            event,
          );
        },
      })),
    [actions, cardLabel, fileName, selected, type],
  );

  return {
    cardLabel,
    fileKind,
    normalizedType,
    actions: resolvedActions,
    handleCardClick,
    fileNameRef,
    showFileNameTooltip,
  };
};
