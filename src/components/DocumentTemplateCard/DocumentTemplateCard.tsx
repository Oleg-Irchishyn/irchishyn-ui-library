import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { Badge } from '../Badge';
import { DOCUMENT_TEMPLATE_CARD_TYPES } from './constants';

import { DocumentTemplateCardActionButton } from './components/DocumentTemplateCardActionButton';
import { DocumentTemplateCardFileIcon } from './components/DocumentTemplateCardFileIcon';
import {
  documentTemplateCardActionBarStyles,
  documentTemplateCardFooterStyles,
  documentTemplateCardPreviewStyles,
  getDocumentTemplateCardBadgeStyles,
  getDocumentTemplateCardFileNameStyles,
  getDocumentTemplateCardRootStyles,
} from './styles';
import type { DocumentTemplateCardProps } from './types';
import { useDocumentTemplateCard } from './useDocumentTemplateCard';
import { resolveDocumentTemplateCardBadgeColor } from './utils';

export const DocumentTemplateCard = ({
  type,
  label,
  fileName,
  selected = false,
  actions = [],
  onClick,
  sx,
}: DocumentTemplateCardProps) => {
  const {
    cardLabel,
    fileKind,
    normalizedType,
    actions: resolvedActions,
    handleCardClick,
    fileNameRef,
    showFileNameTooltip,
  } = useDocumentTemplateCard({
    type,
    label,
    fileName,
    selected,
    actions,
    onClick,
  });
  const isTemplateCard = normalizedType === DOCUMENT_TEMPLATE_CARD_TYPES.TEMPLATE;
  const badgeColor = resolveDocumentTemplateCardBadgeColor(normalizedType);

  return (
    <Box
      data-testid="document-template-card"
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={handleCardClick}
      onKeyDown={(event) => {
        if (!onClick) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleCardClick();
        }
      }}
      sx={[
        getDocumentTemplateCardRootStyles(selected, Boolean(onClick)),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box sx={documentTemplateCardActionBarStyles}>
        {resolvedActions.map((action, index) => (
          <DocumentTemplateCardActionButton key={`${action.type}-${index}`} action={action} />
        ))}
      </Box>

      <Box sx={documentTemplateCardPreviewStyles}>
        <Stack spacing={1} alignItems="center" width="100%">
          <Badge
            label={cardLabel}
            size="small"
            color={badgeColor}
            sx={getDocumentTemplateCardBadgeStyles(isTemplateCard)}
          />
          <Box
            sx={(theme) => ({
              color: selected ? theme.palette.primary.main : theme.palette.text.secondary,
            })}
          >
            <DocumentTemplateCardFileIcon fileKind={fileKind} selected={selected} />
          </Box>
        </Stack>
      </Box>

      <Box sx={documentTemplateCardFooterStyles}>
        <Tooltip
          title={showFileNameTooltip ? fileName : ''}
          disableHoverListener={!showFileNameTooltip}
        >
          <Typography
            ref={fileNameRef}
            component="p"
            sx={getDocumentTemplateCardFileNameStyles(selected)}
          >
            {fileName}
          </Typography>
        </Tooltip>
      </Box>
    </Box>
  );
};
