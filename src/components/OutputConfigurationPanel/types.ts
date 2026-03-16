import type { SxProps, Theme } from '@mui/material/styles';
import type { ReactNode } from 'react';

/** Single output format option (e.g. PDF, Word) */
export type OutputFormatItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  /** Optional palette key (e.g. 'error', 'info') or CSS color for the icon background tint */
  iconColor?: string;
  description?: string;
};

/** Props for the Output Format subsection */
export type OutputFormatSectionProps = {
  /** Available format options */
  formats: OutputFormatItem[];
  /** Currently selected format ids */
  selectedFormats: string[];
  /** Called when selection changes (with new array of selected ids) */
  onFormatsChange: (selectedIds: string[]) => void;
  /** Minimum number of formats that must remain selected; default 1 */
  minSelected?: number;
  /** Optional validation message (e.g. when user tried to deselect below minSelected) */
  error?: string;
  /** Optional helper text below the section */
  helperText?: string;
  /** Optional MUI sx for the section container */
  sx?: SxProps<Theme>;
};

/** File splitting mode: single document vs per-investor */
export type SplitMode = 'consolidated' | 'splitPerInvestor';

/** Props for the File Splitting subsection */
export type FileSplittingSectionProps = {
  splitMode: SplitMode;
  onSplitModeChange: (mode: SplitMode) => void;
  /** Optional MUI sx for the section container */
  sx?: SxProps<Theme>;
};

/** Single token in the file name structure (variable placeholder or static text) */
export type FileNamingToken = {
  type: 'variable' | 'static';
  value: string;
};

/** Available variable for the file naming picker (label shown in UI, value used in tokens) */
export type FileNamingVariable = {
  label: string;
  value: string;
};

/** Tab value for the Add Segment popover (Variable | Static Text) */
export type AddSegmentTab = 'variable' | 'static';

/** Props for the File Naming Convention subsection */
export type FileNamingSectionProps = {
  /** Current token sequence (variable + static) */
  tokens: FileNamingToken[];
  /** Variables that can be added via "+ Add" (label + value) */
  availableVariables: FileNamingVariable[];
  /** Called when the token sequence changes */
  onTokensChange: (tokens: FileNamingToken[]) => void;
  /** Called when user clicks "Reset to Default" */
  onReset: () => void;
  /** One or two file name previews based on selected output formats (e.g. ["name.pdf"] or ["name_1.pdf", "name_2.docx"]) */
  previewFileNames: string[];
  /** Optional subtitle; when split per investor, use description for individual investor files */
  subtitle?: string;
  /** Optional map of variable value -> example string for "Add Segment" popup (e.g. { fundGroup: "Global Fund II" }) */
  variableExamples?: Record<string, string>;
  /** Optional MUI sx for the section container */
  sx?: SxProps<Theme>;
};

/** Props for the full Output Configuration Panel (shell; more sections later) */
export type OutputConfigurationPanelProps = {
  /** Output Format subsection props; if omitted, section uses internal defaults for demo */
  outputFormat?: OutputFormatSectionProps;
  /** File Splitting subsection props; if omitted, section uses internal defaults */
  fileSplitting?: FileSplittingSectionProps;
  /** File Naming Convention subsection props; if omitted, section uses internal defaults for demo */
  fileNaming?: FileNamingSectionProps;
  /** Optional styles for the panel container */
  sx?: SxProps<Theme>;
};
