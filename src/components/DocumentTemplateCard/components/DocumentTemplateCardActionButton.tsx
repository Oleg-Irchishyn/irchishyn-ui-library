import { IconButton, Tooltip } from '@mui/material';

import { DOCUMENT_TEMPLATE_CARD_ACTION_TYPES } from '../constants';
import { getDocumentTemplateCardActionButtonStyles } from '../styles';
import type { ResolvedDocumentTemplateCardAction } from '../types';

interface DocumentTemplateCardActionButtonProps {
  action: ResolvedDocumentTemplateCardAction;
}

export const DocumentTemplateCardActionButton = ({
  action,
}: DocumentTemplateCardActionButtonProps) => {
  const isDeleteAction = action.type === DOCUMENT_TEMPLATE_CARD_ACTION_TYPES.DELETE;

  return (
    <Tooltip title={action.ariaLabel}>
      <span>
        <IconButton
          size="small"
          aria-label={action.ariaLabel}
          disabled={action.disabled}
          onClick={action.onClick}
          sx={getDocumentTemplateCardActionButtonStyles(isDeleteAction)}
        >
          {action.icon}
        </IconButton>
      </span>
    </Tooltip>
  );
};
