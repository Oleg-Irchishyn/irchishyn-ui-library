import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { useMemo, useState } from 'react';
import { action } from '@storybook/addon-actions';
import { FileText, FileType } from 'lucide-react';

import { IrchishynThemeProvider } from '../../providers';
import {
  OutputConfigurationPanel,
  OutputFormatSection,
  FileSplittingSection,
  FileNamingSection,
} from '.';
import {
  DEFAULT_OUTPUT_FORMATS,
  DEFAULT_SELECTED_FORMATS,
  DEFAULT_SPLIT_MODE,
  DEFAULT_FILE_NAMING_TOKENS,
  DEFAULT_FILE_NAMING_VARIABLES,
  OUTPUT_FORMAT_ID_PDF,
  OUTPUT_FORMAT_ID_WORD,
} from './constants';
import type { OutputFormatItem, SplitMode } from './types';

const meta: Meta<typeof OutputConfigurationPanel> = {
  title: 'Components/OutputConfigurationPanel',
  component: OutputConfigurationPanel,
  decorators: [
    (Story) => (
      <IrchishynThemeProvider>
        <Box sx={{ width: '100%', maxWidth: 720 }}>
          <Story />
        </Box>
      </IrchishynThemeProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          "Reusable Output Configuration Panel with Output Format, File Splitting, and File Naming Convention (preview, token chips, + Add, Reset to Default). Uses theme tokens throughout so it adapts to the app's light/dark switcher (AC10).",
      },
    },
  },
  argTypes: {
    outputFormat: { control: false },
    fileSplitting: { control: false },
    fileNaming: { control: false },
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

/** AC10: Theme Compatibility — validate in Storybook by toggling theme or viewing this story */
export const DarkModeAC10: Story = {
  name: 'Dark Mode',
  parameters: {
    docs: {
      description: {
        story:
          'AC10: Renders in dark theme. Section backgrounds, checkbox/radio, token chips, preview text, buttons, and labels use MUI theme tokens and adapt for full legibility.',
      },
    },
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <IrchishynThemeProvider mode="dark">
        <Box sx={{ width: '100%', maxWidth: 720 }}>
          <Story />
        </Box>
      </IrchishynThemeProvider>
    ),
  ],
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

function PanelWithFileNamingState() {
  const [selectedFormats, setSelectedFormats] = useState<string[]>(DEFAULT_SELECTED_FORMATS);
  const [splitMode, setSplitMode] = useState<SplitMode>(DEFAULT_SPLIT_MODE);
  const [tokens, setTokens] = useState(DEFAULT_FILE_NAMING_TOKENS);
  const theme = useTheme();
  const formatsWithIcons = useMemo(() => getFormatsWithIcons(theme), [theme]);

  const previewFileNames = useMemo(() => {
    const demoValues: Record<string, string> = {
      fundGroup: 'Global Fund II',
      eventType: 'Capital Call',
      noticeDate: '2025-01-29',
    };
    const parts = tokens.map((t) =>
      t.type === 'variable' ? (demoValues[t.value] ?? t.value) : t.value,
    );
    const base = parts.join('');
    if (!base) return [];
    const names: string[] = [];
    if (selectedFormats.includes(OUTPUT_FORMAT_ID_PDF)) names.push(`${base}.pdf`);
    if (selectedFormats.includes(OUTPUT_FORMAT_ID_WORD)) names.push(`${base}.docx`);
    return names;
  }, [tokens, selectedFormats]);

  const fileNamingSubtitle =
    splitMode === 'splitPerInvestor'
      ? 'Configure how individual investor files should be named by combining static text and variables.'
      : 'Configure the output file name by combining static text and variables.';

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
      fileNaming={{
        tokens,
        availableVariables: DEFAULT_FILE_NAMING_VARIABLES,
        onTokensChange: (next) => {
          action('onTokensChange')(next);
          setTokens(next);
        },
        onReset: () => {
          action('onReset')();
          setTokens(DEFAULT_FILE_NAMING_TOKENS);
        },
        previewFileNames,
        subtitle: fileNamingSubtitle,
      }}
    />
  );
}

export const WithFileNamingInteractive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Full panel with Output Format, File Splitting, and File Naming Convention. Add/remove tokens, reset to default; preview updates in real time (AC5–AC8).',
      },
    },
  },
  render: () => <PanelWithFileNamingState />,
};

const FILE_NAMING_STANDALONE_FORMATS = [OUTPUT_FORMAT_ID_PDF];

function FileNamingSectionStandaloneWrapper() {
  const [tokens, setTokens] = useState(DEFAULT_FILE_NAMING_TOKENS);
  const previewFileNames = useMemo(() => {
    const demoValues: Record<string, string> = {
      fundGroup: 'Global Fund II',
      eventType: 'Capital Call',
      noticeDate: '2025-01-29',
    };
    const parts = tokens.map((t) =>
      t.type === 'variable' ? (demoValues[t.value] ?? t.value) : t.value,
    );
    const base = parts.join('');
    if (!base) return [];
    const names: string[] = [];
    if (FILE_NAMING_STANDALONE_FORMATS.includes(OUTPUT_FORMAT_ID_PDF)) names.push(`${base}.pdf`);
    if (FILE_NAMING_STANDALONE_FORMATS.includes(OUTPUT_FORMAT_ID_WORD)) names.push(`${base}.docx`);
    return names;
  }, [tokens]);

  return (
    <FileNamingSection
      tokens={tokens}
      availableVariables={DEFAULT_FILE_NAMING_VARIABLES}
      onTokensChange={(next) => {
        action('onTokensChange')(next);
        setTokens(next);
      }}
      onReset={() => {
        action('onReset')();
        setTokens(DEFAULT_FILE_NAMING_TOKENS);
      }}
      previewFileNames={previewFileNames}
    />
  );
}

export const FileNamingSectionStandalone: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'File Naming Convention section only: preview, token chips (removable), + Add picker, Reset to Default.',
      },
    },
  },
  render: () => <FileNamingSectionStandaloneWrapper />,
};
