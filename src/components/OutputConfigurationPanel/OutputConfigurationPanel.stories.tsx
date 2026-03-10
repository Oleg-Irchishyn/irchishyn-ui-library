import type { Meta, StoryObj } from '@storybook/react';
import { useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { useMemo, useState } from 'react';
import { action } from '@storybook/addon-actions';
import { FileText, FileType } from 'lucide-react';

import { Gen2ThemeProvider } from '../../providers';
import { OutputConfigurationPanel, OutputFormatSection, FileSplittingSection } from '.';
import {
  DEFAULT_OUTPUT_FORMATS,
  DEFAULT_SELECTED_FORMATS,
  DEFAULT_SPLIT_MODE,
  OUTPUT_FORMAT_ID_PDF,
  OUTPUT_FORMAT_ID_WORD,
} from './constants';
import type { OutputFormatItem, SplitMode } from './types';

const meta: Meta<typeof OutputConfigurationPanel> = {
  title: 'Components/OutputConfigurationPanel',
  component: OutputConfigurationPanel,
  decorators: [
    (Story) => (
      <Gen2ThemeProvider>
        <Story />
      </Gen2ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Reusable Output Configuration Panel with Output Format, File Splitting (radio options), and File Naming Convention placeholder.',
      },
    },
  },
  argTypes: {
    outputFormat: { control: false },
    fileSplitting: { control: false },
    sx: { control: false },
  },
};

export default meta;

type Story = StoryObj<typeof OutputConfigurationPanel>;

function getFormatsWithIcons(theme: Theme): OutputFormatItem[] {
  return DEFAULT_OUTPUT_FORMATS.map((item) => {
    const icon =
      item.id === OUTPUT_FORMAT_ID_PDF ? (
        <FileText size={24} color={theme.palette.error.main} />
      ) : item.id === OUTPUT_FORMAT_ID_WORD ? (
        <FileType size={24} color={theme.palette.info.main} />
      ) : undefined;
    return { ...item, icon };
  });
}

function PanelWithState(props: { defaultSelected?: string[] }) {
  const initial =
    props.defaultSelected !== undefined ? props.defaultSelected : DEFAULT_SELECTED_FORMATS;
  const [selectedFormats, setSelectedFormats] = useState<string[]>(initial);
  const theme = useTheme();
  const formatsWithIcons = useMemo(() => getFormatsWithIcons(theme), [theme]);

  const handleFormatsChange = (ids: string[]) => {
    action('onFormatsChange')(ids);
    setSelectedFormats(ids);
  };

  return (
    <OutputConfigurationPanel
      outputFormat={{
        formats: formatsWithIcons,
        selectedFormats,
        onFormatsChange: handleFormatsChange,
        minSelected: 1,
      }}
    />
  );
}

function PanelWithFileSplittingState() {
  const [selectedFormats, setSelectedFormats] = useState<string[]>(DEFAULT_SELECTED_FORMATS);
  const [splitMode, setSplitMode] = useState<SplitMode>(DEFAULT_SPLIT_MODE);
  const theme = useTheme();
  const formatsWithIcons = useMemo(() => getFormatsWithIcons(theme), [theme]);

  return (
    <OutputConfigurationPanel
      outputFormat={{
        formats: formatsWithIcons,
        selectedFormats,
        onFormatsChange: (ids) => {
          action('onFormatsChange')(ids);
          setSelectedFormats(ids);
        },
        minSelected: 1,
      }}
      fileSplitting={{
        splitMode,
        onSplitModeChange: (mode) => {
          action('onSplitModeChange')(mode);
          setSplitMode(mode);
        },
      }}
    />
  );
}

export const Default: Story = {
  render: () => <PanelWithState />,
};

export const BothFormatsSelected: Story = {
  render: () => <PanelWithState defaultSelected={[OUTPUT_FORMAT_ID_PDF, OUTPUT_FORMAT_ID_WORD]} />,
};

export const ValidationWhenDeselectingLast: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Try deselecting PDF when it is the only selected format — selection stays, validation message appears.',
      },
    },
  },
  render: () => <PanelWithState defaultSelected={[OUTPUT_FORMAT_ID_PDF]} />,
};

export const WithFileSplittingInteractive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Panel with Output Format and File Splitting; toggle split mode to see onSplitModeChange.',
      },
    },
  },
  render: () => <PanelWithFileSplittingState />,
};

function OutputFormatSectionStandaloneWrapper() {
  const [selectedFormats, setSelectedFormats] = useState<string[]>(DEFAULT_SELECTED_FORMATS);
  const theme = useTheme();
  const formatsWithIcons = useMemo(() => getFormatsWithIcons(theme), [theme]);

  const handleFormatsChange = (ids: string[]) => {
    action('onFormatsChange')(ids);
    setSelectedFormats(ids);
  };

  return (
    <OutputFormatSection
      formats={formatsWithIcons}
      selectedFormats={selectedFormats}
      onFormatsChange={handleFormatsChange}
      minSelected={1}
    />
  );
}

export const OutputFormatSectionStandalone: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Output Format section only (without panel placeholders).',
      },
    },
  },
  render: () => <OutputFormatSectionStandaloneWrapper />,
};

function FileSplittingSectionStandaloneWrapper() {
  const [splitMode, setSplitMode] = useState<SplitMode>(DEFAULT_SPLIT_MODE);
  return (
    <FileSplittingSection
      splitMode={splitMode}
      onSplitModeChange={(mode) => {
        action('onSplitModeChange')(mode);
        setSplitMode(mode);
      }}
    />
  );
}

export const FileSplittingSectionStandalone: Story = {
  parameters: {
    docs: {
      description: {
        story: 'File Splitting section only (Consolidated File / Split Per Investor).',
      },
    },
  },
  render: () => <FileSplittingSectionStandaloneWrapper />,
};
