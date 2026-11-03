import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Box, Typography, List, ListItem } from '@mui/material';

import { IrchishynThemeProvider } from '../../providers';
import { SearchTextBox } from './SearchTextBox';

const SAMPLE_ITEMS = [
  'Q1 2025 Investor Report',
  'Q2 2025 Capital Call Notice',
  'Data Dictionary - Fields',
  'Sponsor Configuration - Acme Corp',
  'Driver Report - GL Data',
];

const meta: Meta<typeof SearchTextBox> = {
  title: 'Components/SearchTextBox',
  component: SearchTextBox,
  parameters: {
    docs: {
      description: {
        component:
          'Reusable search text input with leading search icon, debounced onChange, and optional clear (X) button. Use for filtering lists, grids, and dropdowns. Theme-compatible (light/dark).',
      },
    },
  },
  argTypes: {
    value: { control: 'text' },
    placeholder: { control: 'text' },
    debounceMs: { control: 'number' },
    onChange: { action: 'changed' },
    onClear: { action: 'cleared' },
  },
  decorators: [
    (Story) => (
      <IrchishynThemeProvider mode="light">
        <Box sx={{ p: 2 }}>
          <Story />
        </Box>
      </IrchishynThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof SearchTextBox>;

export const Default: Story = {
  args: {
    value: '',
    placeholder: 'Search reports...',
    onChange: () => {},
  },
};

export const WithPlaceholder: Story = {
  args: {
    value: '',
    placeholder: 'Search data items...',
    onChange: () => {},
  },
};

export const WithClear: Story = {
  args: {
    value: 'some search text',
    placeholder: 'Search...',
    onChange: () => {},
    onClear: () => {},
  },
};

export const DebouncedCallback: Story = {
  render: function DebouncedStory() {
    const [value, setValue] = useState('');
    const [lastDebounced, setLastDebounced] = useState<string>('(none yet)');

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
        <SearchTextBox
          value={value}
          onChange={(v) => {
            setValue(v);
            setLastDebounced(v);
          }}
          placeholder="Type to see debounced value..."
          debounceMs={300}
        />
        <Typography variant="body2" color="text.secondary">
          Current input: <strong>{value || '(empty)'}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Last onChange (after debounce): <strong>{lastDebounced}</strong>
        </Typography>
      </Box>
    );
  },
};

export const LiveFiltering: Story = {
  render: function LiveFilteringStory() {
    const [query, setQuery] = useState('');
    const filtered = SAMPLE_ITEMS.filter((item) =>
      item.toLowerCase().includes(query.toLowerCase()),
    );

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
        <SearchTextBox
          value={query}
          onChange={setQuery}
          placeholder="Search reports..."
          debounceMs={200}
          onClear={() => setQuery('')}
        />
        <Typography variant="body2" color="text.secondary">
          {filtered.length} item(s)
        </Typography>
        <List dense sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <ListItem key={item}>
                <Typography variant="body2">{item}</Typography>
              </ListItem>
            ))
          ) : (
            <ListItem>
              <Typography variant="body2" color="text.secondary">
                No matches
              </Typography>
            </ListItem>
          )}
        </List>
      </Box>
    );
  },
};

export const DarkMode: Story = {
  decorators: [
    (Story) => (
      <IrchishynThemeProvider mode="dark">
        <Box sx={{ p: 2, bgcolor: 'background.default', minHeight: 120 }}>
          <Story />
        </Box>
      </IrchishynThemeProvider>
    ),
  ],
  args: {
    value: '',
    placeholder: 'Search in dark mode...',
    onChange: () => {},
  },
};
