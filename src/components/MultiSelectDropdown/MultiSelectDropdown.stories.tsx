import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '@mui/material';

import { MultiSelectDropdown } from './MultiSelectDropdown';
import type { MultiSelectDropdownProps } from './types';

const sponsorOptions = [
  { label: 'Acme Corp', value: 'acme-corp' },
  { label: 'Golden Image-Dev', value: 'golden-image-dev' },
  { label: 'Nebula Ventures', value: 'nebula-ventures' },
  { label: 'Omega Fund', value: 'omega-fund' },
  { label: 'Orion Capital', value: 'orion-capital' },
  { label: 'Zenith Partners', value: 'zenith-partners' },
];

const meta: Meta<typeof MultiSelectDropdown> = {
  title: 'Components/MultiSelectDropdown',
  component: MultiSelectDropdown,
  argTypes: {
    onChange: { action: 'changed' },
    showSelectAll: { control: 'boolean' },
    disabled: { control: 'boolean' },
    maxDisplayNames: { control: { type: 'number', min: 1 } },
    placeholder: { control: 'text' },
    searchPlaceholder: { control: 'text' },
  },
  args: {
    options: sponsorOptions,
    selectedValues: [],
    placeholder: 'All Sponsors',
    searchPlaceholder: 'Search sponsors...',
    showSelectAll: true,
    maxDisplayNames: 2,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof MultiSelectDropdown>;

/** Interactive wrapper that holds selection state */
const InteractiveRenderer = (args: MultiSelectDropdownProps) => {
  const [selected, setSelected] = useState<string[]>(args.selectedValues);
  return (
    <Box sx={{ p: 2 }}>
      <MultiSelectDropdown {...args} selectedValues={selected} onChange={setSelected} />
    </Box>
  );
};

export const Default: Story = {
  render: (args) => <InteractiveRenderer {...args} />,
  args: { selectedValues: [] },
};

export const PartialSelection: Story = {
  render: (args) => <InteractiveRenderer {...args} />,
  args: { selectedValues: ['acme-corp', 'omega-fund'] },
};

export const CountLabel: Story = {
  name: 'Count Label (>maxDisplayNames)',
  render: (args) => <InteractiveRenderer {...args} />,
  args: { selectedValues: ['acme-corp', 'golden-image-dev', 'nebula-ventures'] },
};

export const AllSelected: Story = {
  render: (args) => <InteractiveRenderer {...args} />,
  args: { selectedValues: sponsorOptions.map((o) => o.value) },
};

export const NoSelectAll: Story = {
  render: (args) => <InteractiveRenderer {...args} />,
  args: { showSelectAll: false, selectedValues: [] },
};

export const Disabled: Story = {
  args: { disabled: true, selectedValues: ['acme-corp'] },
};
