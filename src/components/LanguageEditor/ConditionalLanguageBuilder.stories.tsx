import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Box, Button } from '@mui/material';

import { ConditionalLanguageBuilder } from './components/ConditionalLanguageBuilder';
import type { FieldDefinition } from './types';

const prototypeFieldConfig: FieldDefinition[] = [
  { name: 'INVESTOR_NAME', displayName: 'Investor Name', type: 'Dimension', dataType: 'text' },
  { name: 'FUND_NAME', displayName: 'Fund Name', type: 'Dimension', dataType: 'text' },
  { name: 'NET_CALL_AMOUNT', displayName: 'Net Call Amount', type: 'Measure', dataType: 'number' },
  { name: 'DUE_DATE', displayName: 'Due Date', type: 'Dimension', dataType: 'date' },
  { name: 'IS_ACTIVE', displayName: 'Is Active', type: 'Boolean', dataType: 'boolean' },
];

const meta: Meta<typeof ConditionalLanguageBuilder> = {
  title: 'Components/LanguageEditor/ConditionalLanguageBuilder',
  component: ConditionalLanguageBuilder,
  argTypes: {
    onClose: { action: 'close' },
    onInsertConditional: { action: 'insertConditional' },
  },
};

export default meta;

type Story = StoryObj<typeof ConditionalLanguageBuilder>;

function ConditionalLanguageBuilderWithTrigger(props: {
  fieldConfig: FieldDefinition[];
  onInsertConditional: (text: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [lastInserted, setLastInserted] = useState<string | null>(null);

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Open Conditional Language Builder
      </Button>
      {lastInserted !== null && (
        <Box
          component="pre"
          sx={{
            mt: 2,
            p: 1.5,
            bgcolor: 'grey.100',
            borderRadius: 1,
            fontSize: 12,
            overflow: 'auto',
            maxHeight: 200,
          }}
        >
          {lastInserted}
        </Box>
      )}
      <ConditionalLanguageBuilder
        open={open}
        onClose={() => setOpen(false)}
        fieldConfig={props.fieldConfig}
        onInsertConditional={(text) => {
          props.onInsertConditional(text);
          setLastInserted(text);
          setOpen(false);
        }}
      />
    </>
  );
}

export const Default: Story = {
  args: {
    open: true,
    fieldConfig: prototypeFieldConfig,
  },
};

export const WithTrigger: Story = {
  render: (args) => (
    <ConditionalLanguageBuilderWithTrigger
      fieldConfig={args.fieldConfig ?? prototypeFieldConfig}
      onInsertConditional={args.onInsertConditional ?? (() => {})}
    />
  ),
  args: {
    fieldConfig: prototypeFieldConfig,
  },
};

export const AllDataTypes: Story = {
  args: {
    open: true,
    fieldConfig: [
      { name: 'text_field', displayName: 'Text Field', type: 'Dimension', dataType: 'text' },
      { name: 'num_field', displayName: 'Number Field', type: 'Measure', dataType: 'number' },
      { name: 'date_field', displayName: 'Date Field', type: 'Dimension', dataType: 'date' },
      { name: 'bool_field', displayName: 'Boolean Field', type: 'Boolean', dataType: 'boolean' },
    ],
  },
};

export const EmptyFieldConfig: Story = {
  args: {
    open: true,
    fieldConfig: [],
  },
};
