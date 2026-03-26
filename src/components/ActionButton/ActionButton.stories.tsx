import { Plus, Trash2 } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/react';

import { ActionButton } from './ActionButton';

const meta: Meta<typeof ActionButton> = {
  title: 'Components/ActionButton',
  component: ActionButton,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'icon'],
      description: 'Visual style of the button',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Button size',
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    label: { control: 'text' },
    tooltip: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof ActionButton>;

export const PrimaryWithIcon: Story = {
  name: 'Primary — with icon',
  args: {
    variant: 'primary',
    label: 'New Capital Event',
    icon: <Plus size={16} />,
  },
};

export const PrimaryNoIcon: Story = {
  name: 'Primary — no icon',
  args: {
    variant: 'primary',
    label: 'Save',
  },
};

export const Secondary: Story = {
  name: 'Secondary',
  args: {
    variant: 'secondary',
    label: 'Cancel',
  },
};

export const Icon: Story = {
  name: 'Icon only',
  args: {
    variant: 'icon',
    icon: <Trash2 size={16} />,
    tooltip: 'Delete',
  },
};

export const AllSizes: Story = {
  name: 'All sizes',
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <ActionButton variant="primary" label="Small" icon={<Plus size={14} />} size="small" />
      <ActionButton variant="primary" label="Medium" icon={<Plus size={16} />} size="medium" />
      <ActionButton variant="primary" label="Large" icon={<Plus size={18} />} size="large" />
    </div>
  ),
};

export const Disabled: Story = {
  name: 'Disabled',
  args: {
    variant: 'primary',
    label: 'New Capital Event',
    icon: <Plus size={16} />,
    disabled: true,
  },
};

export const Loading: Story = {
  name: 'Loading',
  args: {
    variant: 'primary',
    label: 'Saving…',
    loading: true,
  },
};
