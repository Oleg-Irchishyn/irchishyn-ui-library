import type { Meta, StoryObj } from '@storybook/react';
import { Box, Stack, Typography } from '@mui/material';
import { FileText } from 'lucide-react';

import { Gen2ThemeProvider } from '../../providers';
import { Badge } from './Badge';
import { BADGE_COLOR_PRESETS, BADGE_SIZES, BADGE_VARIANTS } from './constants';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  render: (args) => <Badge {...args} />,
  argTypes: {
    label: {
      control: { type: 'text' },
    },
    variant: {
      control: { type: 'inline-radio' },
      options: BADGE_VARIANTS,
    },
    color: {
      control: { type: 'select' },
      options: BADGE_COLOR_PRESETS,
    },
    size: {
      control: { type: 'inline-radio' },
      options: BADGE_SIZES,
    },
    icon: { control: false },
  },
  args: {
    label: 'Capital Call',
    variant: 'filled',
    color: 'info',
    size: 'medium',
  },
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {};

export const Outlined: Story = {
  args: {
    label: 'In-Preparation',
    variant: 'outlined',
    color: 'info',
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Preparation',
    icon: <FileText size={12} strokeWidth={2} />,
    color: 'warning',
  },
};

export const StatusExamples: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      <Badge label="Capital Call" color="info" />
      <Badge label="Preparation" color="warning" icon={<FileText size={12} strokeWidth={2} />} />
      <Badge label="In-Preparation" variant="outlined" color="info" />
      <Badge label="Editable" variant="outlined" color="success" />
      <Badge label="Sponsor" color="info" />
      <Badge label="Cap Event: GL Data" color="#1D4ED8" />
      <Badge label="Cap Event: Accounts" color="#1D4ED8" />
      <Badge label="System" size="small" color="neutral" />
      <Badge label="Sponsor" size="small" variant="outlined" color="info" />
    </Stack>
  ),
};

export const SemanticColors: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      <Badge label="Capital Call" color="info" />
      <Badge label="Editable" color="success" />
      <Badge label="Preparation" color="warning" />
      <Badge label="System" color="neutral" />
      <Badge label="In-Preparation" variant="outlined" color="info" />
      <Badge label="Sponsor" color="info" />
    </Stack>
  ),
};

export const CustomColor: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      <Badge label="Custom Filled" color="#00A9E0" />
      <Badge label="Custom Outlined" variant="outlined" color="#00897B" />
    </Stack>
  ),
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack direction="row" spacing={1} alignItems="center">
      <Badge label="Small Badge" size="small" color="info" />
      <Badge label="Medium Badge" size="medium" color="info" />
      <Badge label="Small Outlined" size="small" variant="outlined" color="success" />
      <Badge label="Medium Outlined" size="medium" variant="outlined" color="success" />
    </Stack>
  ),
};

export const ThemeCompatibility: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={2}>
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Light
        </Typography>
        <Gen2ThemeProvider mode="light">
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Badge label="Capital Call" color="info" />
            <Badge label="Editable" variant="outlined" color="success" />
            <Badge
              label="Preparation"
              icon={<FileText size={12} strokeWidth={2} />}
              color="warning"
            />
            <Badge label="System" color="neutral" />
          </Stack>
        </Gen2ThemeProvider>
      </Box>

      <Box sx={{ p: 2, borderRadius: 1, backgroundColor: '#111827' }}>
        <Typography variant="subtitle2" sx={{ mb: 1, color: '#E5E7EB' }}>
          Dark
        </Typography>
        <Gen2ThemeProvider mode="dark">
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Badge label="Capital Call" color="info" />
            <Badge label="Editable" variant="outlined" color="success" />
            <Badge
              label="Preparation"
              icon={<FileText size={12} strokeWidth={2} />}
              color="warning"
            />
            <Badge label="System" color="neutral" />
          </Stack>
        </Gen2ThemeProvider>
      </Box>
    </Stack>
  ),
};
