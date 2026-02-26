import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';

import { FieldInsertDropdown } from './components/FieldInsertDropdown';
import type { FieldDefinition } from './types';

const sampleFieldConfig: FieldDefinition[] = [
  {
    name: 'INVESTOR_NAME',
    displayName: 'Investor Name',
    type: 'Dimension',
    dataType: 'text',
    group: 'Identity',
  },
  {
    name: 'FUND_NAME',
    displayName: 'Fund Name',
    type: 'Dimension',
    dataType: 'text',
    group: 'Identity',
  },
  {
    name: 'ENTITY_NAME',
    displayName: 'Entity Name',
    type: 'Dimension',
    dataType: 'text',
    group: 'Identity',
  },
  {
    name: 'NET_CALL_AMOUNT',
    displayName: 'Net Call Amount',
    type: 'Measure',
    dataType: 'number',
    group: 'Financials',
  },
  {
    name: 'GROSS_AMOUNT',
    displayName: 'Gross Amount',
    type: 'Measure',
    dataType: 'number',
    group: 'Financials',
  },
  {
    name: 'DUE_DATE',
    displayName: 'Due Date',
    type: 'Dimension',
    dataType: 'date',
    group: 'Dates',
  },
  {
    name: 'IS_ACTIVE',
    displayName: 'Is Active',
    type: 'Boolean',
    dataType: 'boolean',
  },
  {
    name: 'IS_CAPITAL_CALL',
    displayName: 'Is Capital Call',
    type: 'Boolean',
    dataType: 'boolean',
  },
];

const meta: Meta<typeof FieldInsertDropdown> = {
  title: 'Components/LanguageEditor/FieldInsertDropdown',
  component: FieldInsertDropdown,
  parameters: {
    docs: {
      description: {
        component:
          'A dropdown menu for selecting and inserting field references into the LanguageEditor. Features search filtering and field type badges (Dimension, Measure, Boolean).',
      },
    },
  },
  argTypes: {
    onClose: { action: 'closed' },
    onInsertField: { action: 'insertField' },
  },
};

export default meta;

type Story = StoryObj<typeof FieldInsertDropdown>;

function FieldInsertDropdownWithTrigger(props: {
  fieldConfig: FieldDefinition[];
  onInsertField: (fieldName: string) => void;
}) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [lastInserted, setLastInserted] = useState<string | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleInsertField = (fieldName: string) => {
    props.onInsertField(fieldName);
    setLastInserted(fieldName);
    setAnchorEl(null);
  };

  return (
    <Box>
      <Button variant="outlined" onClick={handleClick}>
        # Insert Field
      </Button>
      {lastInserted && (
        <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="body2">
            Last inserted: <code>«{lastInserted}»</code>
          </Typography>
        </Box>
      )}
      <FieldInsertDropdown
        fieldConfig={props.fieldConfig}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onInsertField={handleInsertField}
      />
    </Box>
  );
}

export const Default: Story = {
  render: (args) => (
    <FieldInsertDropdownWithTrigger
      fieldConfig={args.fieldConfig ?? sampleFieldConfig}
      onInsertField={args.onInsertField ?? (() => {})}
    />
  ),
  args: {
    fieldConfig: sampleFieldConfig,
  },
};

export const AllFieldTypes: Story = {
  render: (args) => (
    <FieldInsertDropdownWithTrigger
      fieldConfig={args.fieldConfig ?? []}
      onInsertField={args.onInsertField ?? (() => {})}
    />
  ),
  args: {
    fieldConfig: [
      { name: 'text_field', displayName: 'Text Field', type: 'Dimension', dataType: 'text' },
      { name: 'number_field', displayName: 'Number Field', type: 'Measure', dataType: 'number' },
      { name: 'date_field', displayName: 'Date Field', type: 'Dimension', dataType: 'date' },
      { name: 'boolean_field', displayName: 'Boolean Field', type: 'Boolean', dataType: 'boolean' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the different field type badges: Dimension (blue), Measure (purple), Boolean (gray).',
      },
    },
  },
};

export const ManyFields: Story = {
  render: (args) => (
    <FieldInsertDropdownWithTrigger
      fieldConfig={args.fieldConfig ?? []}
      onInsertField={args.onInsertField ?? (() => {})}
    />
  ),
  args: {
    fieldConfig: [
      ...sampleFieldConfig,
      {
        name: 'ACCOUNT_NUMBER',
        displayName: 'Account Number',
        type: 'Dimension',
        dataType: 'text',
      },
      {
        name: 'COMMITMENT_AMOUNT',
        displayName: 'Commitment Amount',
        type: 'Measure',
        dataType: 'number',
      },
      {
        name: 'UNFUNDED_AMOUNT',
        displayName: 'Unfunded Amount',
        type: 'Measure',
        dataType: 'number',
      },
      { name: 'WIRE_DATE', displayName: 'Wire Date', type: 'Dimension', dataType: 'date' },
      { name: 'NOTICE_DATE', displayName: 'Notice Date', type: 'Dimension', dataType: 'date' },
      { name: 'IS_VERIFIED', displayName: 'Is Verified', type: 'Boolean', dataType: 'boolean' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'With many fields, the dropdown becomes scrollable. Use search to quickly find fields.',
      },
    },
  },
};

export const EmptyFieldConfig: Story = {
  render: (args) => (
    <FieldInsertDropdownWithTrigger
      fieldConfig={args.fieldConfig ?? []}
      onInsertField={args.onInsertField ?? (() => {})}
    />
  ),
  args: {
    fieldConfig: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'When no fields are configured, shows "No fields found" message.',
      },
    },
  },
};
