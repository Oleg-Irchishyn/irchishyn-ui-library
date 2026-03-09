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

/** Props for the full Output Configuration Panel (shell; more sections later) */
export type OutputConfigurationPanelProps = {
  /** Output Format subsection props; if omitted, section uses internal defaults for demo */
  outputFormat?: OutputFormatSectionProps;
  /** Optional styles for the panel container */
  sx?: SxProps<Theme>;
};
