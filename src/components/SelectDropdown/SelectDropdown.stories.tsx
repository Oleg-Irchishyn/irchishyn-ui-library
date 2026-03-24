import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Box } from '@mui/material';
import { RefreshCw as RefreshCwIcon, Plus as PlusIcon } from 'lucide-react';

import { SelectDropdown } from './SelectDropdown';
import type { SelectDropdownOption, SelectDropdownProps } from './types';

const driverReportOptions: SelectDropdownOption[] = [
  {
    label: 'CapEvent - System - Direct Fund',
    value: 'direct-fund',
    badgeLabel: 'System',
    badgeColor: 'info',
  },
  {
    label: 'CapEvent - System - Fund of Funds',
    value: 'fund-of-funds',
    badgeLabel: 'System',
    badgeColor: 'info',
  },
  {
    label: 'CapEvent - System - Co-Investment',
    value: 'co-investment',
    badgeLabel: 'System',
    badgeColor: 'info',
  },
  {
    label: 'CapEvent - System - Secondary Fund',
    value: 'secondary-fund',
    badgeLabel: 'System',
    badgeColor: 'info',
  },
  {
    label: 'CapEvent - System - Venture Capital',
    value: 'venture-capital',
    badgeLabel: 'System',
    badgeColor: 'info',
  },
  {
    label: 'CapEvent - System - Real Estate',
    value: 'real-estate',
    badgeLabel: 'System',
    badgeColor: 'info',
  },
  {
    label: 'CapEvent - System - Infrastructure',
    value: 'infrastructure',
    badgeLabel: 'System',
    badgeColor: 'info',
  },
  {
    label: 'CapEvent - System - Credit Fund',
    value: 'credit-fund',
    badgeLabel: 'System',
    badgeColor: 'info',
  },
];

const meta: Meta<typeof SelectDropdown> = {
  title: 'Components/SelectDropdown',
  component: SelectDropdown,
  argTypes: {
    onChange: { action: 'changed' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    searchPlaceholder: { control: 'text' },
  },
  args: {
    options: driverReportOptions,
    value: null,
    placeholder: 'Select a driver report...',
    searchPlaceholder: 'Search driver reports...',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof SelectDropdown>;

/** Interactive wrapper that holds selection state */
const InteractiveRenderer = (args: SelectDropdownProps) => {
  const [selected, setSelected] = useState<string | null>(args.value);
  return (
    <Box sx={{ p: 2, width: 360 }}>
      <SelectDropdown
        {...args}
        value={selected}
        onChange={(option) => {
          setSelected(option.value);
          if (typeof args.onChange === 'function') args.onChange(option);
        }}
      />
    </Box>
  );
};

export const Default: Story = {
  render: (args) => <InteractiveRenderer {...args} />,
  args: { value: null },
};

export const WithPreselectedValue: Story = {
  name: 'Pre-selected Value',
  render: (args) => <InteractiveRenderer {...args} />,
  args: { value: 'fund-of-funds' },
};

const onRefreshClick = action('onRefreshClick');
const onCreateNewClick = action('onCreateNewClick');

export const WithActionButtons: Story = {
  name: 'With Action Buttons',
  render: (args) => <InteractiveRenderer {...args} />,
  args: {
    value: 'fund-of-funds',
    actionButtons: [
      {
        label: 'Refresh List',
        icon: <RefreshCwIcon size={14} />,
        onClick: onRefreshClick,
      },
      {
        label: 'Create New Driver Report',
        icon: <PlusIcon size={14} />,
        onClick: onCreateNewClick,
        closeOnClick: true,
      },
    ],
  },
};

export const NoBadges: Story = {
  name: 'Options Without Badges',
  render: (args) => <InteractiveRenderer {...args} />,
  args: {
    options: [
      { label: 'Alpha Fund', value: 'alpha' },
      { label: 'Beta Strategy', value: 'beta' },
      { label: 'Gamma Portfolio', value: 'gamma' },
    ],
    value: null,
    placeholder: 'Select a fund...',
    searchPlaceholder: 'Search funds...',
  },
};

export const Disabled: Story = {
  args: {
    value: 'fund-of-funds',
    disabled: true,
  },
};
