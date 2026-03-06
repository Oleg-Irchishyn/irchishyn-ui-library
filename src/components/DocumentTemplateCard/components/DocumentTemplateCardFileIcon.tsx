import { Box, Typography } from '@mui/material';
import { FileText } from 'lucide-react';

import { getDocumentTemplateCardFileIconContainerStyles } from '../styles';
import type { DocumentTemplateCardFileKind } from '../types';

interface DocumentTemplateCardFileIconProps {
  fileKind: DocumentTemplateCardFileKind;
  selected: boolean;
}

export const DocumentTemplateCardFileIcon = ({
  fileKind,
  selected,
}: DocumentTemplateCardFileIconProps) => {
  if (fileKind === 'pdf') {
    return (
      <Box sx={getDocumentTemplateCardFileIconContainerStyles(true)}>
        <Typography
          component="span"
          sx={(theme) => ({
            fontSize: '0.5rem',
            fontWeight: 700,
            letterSpacing: 0.3,
            color: theme.palette.error.main,
          })}
        >
          PDF
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={getDocumentTemplateCardFileIconContainerStyles(false)}>
      <FileText size={36} color={selected ? 'currentColor' : undefined} />
    </Box>
  );
};
