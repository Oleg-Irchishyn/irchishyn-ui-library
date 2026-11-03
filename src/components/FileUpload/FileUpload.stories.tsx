import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Box, Typography, Stack } from '@mui/material';

import { IrchishynThemeProvider } from '../../providers';
import { FileUpload } from './FileUpload';

const meta: Meta<typeof FileUpload> = {
  title: 'Components/FileUpload',
  component: FileUpload,
  parameters: {
    docs: {
      description: {
        component:
          'Reusable file upload with dashed-border drop zone, upload icon, "Drop or browse" label, and Browse button. Supports drag-and-drop, file type/size validation, single or multiple files, and disabled state. Theme-compatible (light/dark).',
      },
    },
  },
  argTypes: {
    onFileSelect: { action: 'fileSelect', control: false },
    accept: { control: 'text' },
    multiple: { control: 'boolean' },
    maxSizeBytes: { control: 'number' },
    disabled: { control: 'boolean' },
  },
  args: {
    accept: '.pdf,.docx',
    multiple: false,
    disabled: false,
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

type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {
  args: {
    onFileSelect: () => {},
  },
};

export const SingleFile: Story = {
  args: {
    accept: '.pdf',
    multiple: false,
    onFileSelect: () => {},
  },
};

export const MultipleFiles: Story = {
  args: {
    accept: '.pdf,.docx',
    multiple: true,
    onFileSelect: () => {},
  },
};

export const WithMaxSize: Story = {
  args: {
    accept: '*/*',
    maxSizeBytes: 1024 * 1024, // 1 MB
    onFileSelect: () => {},
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    onFileSelect: () => {},
  },
};

export const WithCallback: Story = {
  render: function WithCallbackStory() {
    const [lastFiles, setLastFiles] = useState<string>('(none yet)');

    return (
      <Stack spacing={2} sx={{ maxWidth: 400 }}>
        <FileUpload
          accept=".pdf,.docx"
          multiple
          onFileSelect={(files) => {
            const names = Array.isArray(files) ? files.map((f) => f.name) : [files.name];
            setLastFiles(names.join(', '));
          }}
        />
        <Typography variant="body2" color="text.secondary">
          Last selected: <strong>{lastFiles}</strong>
        </Typography>
      </Stack>
    );
  },
};

export const AllStates: Story = {
  render: function AllStatesStory() {
    return (
      <Stack spacing={3} sx={{ maxWidth: 360 }}>
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Idle
          </Typography>
          <FileUpload accept=".pdf" onFileSelect={() => {}} />
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            With max size (1 MB) – try dropping a large file to see error
          </Typography>
          <FileUpload accept="*/*" maxSizeBytes={1024 * 1024} onFileSelect={() => {}} />
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Disabled
          </Typography>
          <FileUpload disabled onFileSelect={() => {}} />
        </Box>
      </Stack>
    );
  },
};

export const DarkMode: Story = {
  decorators: [
    (Story) => (
      <IrchishynThemeProvider mode="dark">
        <Box sx={{ p: 2, bgcolor: 'background.default', minHeight: 200 }}>
          <Story />
        </Box>
      </IrchishynThemeProvider>
    ),
  ],
  args: {
    onFileSelect: () => {},
  },
};
