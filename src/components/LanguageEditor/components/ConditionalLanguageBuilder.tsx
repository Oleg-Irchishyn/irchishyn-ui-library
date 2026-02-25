import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Code, Plus } from 'lucide-react';

import { LANGUAGE_EDITOR_LABELS } from '../constants';
import type { ConditionalLanguageBuilderProps } from '../types';
import { useConditionalLanguageBuilder } from '../useConditionalLanguageBuilder';
import { ConditionalLanguageBuilderElseBlock } from './ConditionalLanguageBuilderElseBlock';
import { ConditionalLanguageBuilderElseIfBlock } from './ConditionalLanguageBuilderElseIfBlock';
import { ConditionalLanguageBuilderIfBlock } from './ConditionalLanguageBuilderIfBlock';

export function ConditionalLanguageBuilder({
  open,
  onClose,
  fieldConfig,
  onInsertConditional,
}: ConditionalLanguageBuilderProps) {
  const {
    ifClause,
    setIfClause,
    elseIfClauses,
    elseContent,
    setElseContent,
    handleClose,
    handleInsert,
    addElseIf,
    removeElseIf,
    updateElseIf,
    canInsert,
  } = useConditionalLanguageBuilder({
    fieldConfig,
    onClose,
    onInsertConditional,
  });

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { maxHeight: '85vh' } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Code size={22} />
        {LANGUAGE_EDITOR_LABELS.CLB_TITLE}
      </DialogTitle>
      <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box component="p" sx={{ m: 0, color: 'text.secondary', fontSize: 14 }}>
          {LANGUAGE_EDITOR_LABELS.CLB_DESCRIPTION}
        </Box>

        <ConditionalLanguageBuilderIfBlock
          clause={ifClause}
          onClauseChange={setIfClause}
          fieldConfig={fieldConfig}
        />

        {elseIfClauses.map((clause, index) => (
          <ConditionalLanguageBuilderElseIfBlock
            key={index}
            clause={clause}
            onClauseChange={(c) => updateElseIf(index, c)}
            fieldConfig={fieldConfig}
            onRemove={() => removeElseIf(index)}
          />
        ))}

        <Button startIcon={<Plus size={18} />} variant="outlined" onClick={addElseIf} fullWidth>
          {LANGUAGE_EDITOR_LABELS.CLB_ADD_ELSE_IF}
        </Button>

        <ConditionalLanguageBuilderElseBlock
          content={elseContent}
          onContentChange={setElseContent}
        />
      </DialogContent>
      <DialogActions sx={{ px: 2, py: 1.5 }}>
        <Button onClick={handleClose}>{LANGUAGE_EDITOR_LABELS.CLB_CANCEL}</Button>
        <Button variant="contained" onClick={handleInsert} disabled={!canInsert}>
          {LANGUAGE_EDITOR_LABELS.CLB_INSERT}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
