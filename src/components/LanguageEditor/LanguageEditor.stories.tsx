import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '@mui/material';

import { FieldInsertDropdown } from './components/FieldInsertDropdown';
import type { FieldDefinition } from './types';

const prototypeFieldConfig: FieldDefinition[] = [
  { name: 'INVESTOR_NAME', displayName: 'Investor Name', type: 'Dimension', dataType: 'text' },
  { name: 'Entity_Name', displayName: 'Entity Name', type: 'Dimension', dataType: 'text' },
  { name: 'FUND_NAME', displayName: 'Fund Name', type: 'Dimension', dataType: 'text' },
  { name: 'NET_CALL_AMOUNT', displayName: 'Net Call Amount', type: 'Measure', dataType: 'number' },
  { name: 'DUE_DATE', displayName: 'Due Date', type: 'Dimension', dataType: 'date' },
  { name: 'BANK_NAME', displayName: 'Bank Name', type: 'Dimension', dataType: 'text' },
  { name: 'BANK_ABA', displayName: 'Bank ABA', type: 'Dimension', dataType: 'text' },
  { name: 'ACCOUNT_NAME', displayName: 'Account Name', type: 'Dimension', dataType: 'text' },
  { name: 'ACCOUNT_NUMBER', displayName: 'Account Number', type: 'Dimension', dataType: 'text' },
  {
    name: 'COMMITMENT_AMOUNT',
    displayName: 'Commitment Amount',
    type: 'Measure',
    dataType: 'number',
  },
];

const meta: Meta<typeof FieldInsertDropdown> = {
  title: 'Components/LanguageEditor/FieldInsertDropdown',
  component: FieldInsertDropdown,
  argTypes: {
    onInsertField: { action: 'insertField' },
    onClose: { action: 'close' },
  },
};

export default meta;

type Story = StoryObj<typeof FieldInsertDropdown>;

function FieldInsertDropdownWithAnchor(props: {
  fieldConfig: FieldDefinition[];
  onInsertField: (name: string) => void;
}) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        # Insert Field
      </Button>
      <FieldInsertDropdown
        fieldConfig={props.fieldConfig}
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        onInsertField={(name) => {
          props.onInsertField(name);
          setAnchorEl(null);
        }}
      />
    </>
  );
}

export const Default: Story = {
  render: (args) => (
    <FieldInsertDropdownWithAnchor
      fieldConfig={args.fieldConfig}
      onInsertField={args.onInsertField ?? (() => {})}
    />
  ),
  args: {
    fieldConfig: prototypeFieldConfig,
  },
};

export const WithSearch: Story = {
  ...Default,
  args: {
    fieldConfig: prototypeFieldConfig,
  },
};

export const ManyFields: Story = {
  args: {
    fieldConfig: [
      ...prototypeFieldConfig,
      ...Array.from({ length: 15 }, (_, i) => ({
        name: `EXTRA_FIELD_${i + 1}`,
        displayName: `Extra Field ${i + 1}`,
        type: i % 2 === 0 ? ('Dimension' as const) : ('Measure' as const),
        dataType: 'text' as const,
      })),
    ],
  },
  render: (args) => (
    <FieldInsertDropdownWithAnchor
      fieldConfig={args.fieldConfig}
      onInsertField={args.onInsertField ?? (() => {})}
    />
  ),
};

export const EmptyConfig: Story = {
  args: {
    fieldConfig: [],
  },
  render: (args) => (
    <FieldInsertDropdownWithAnchor
      fieldConfig={args.fieldConfig}
      onInsertField={args.onInsertField ?? (() => {})}
    />
  ),
};
