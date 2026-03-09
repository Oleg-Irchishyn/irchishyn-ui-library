import type { OutputFormatItem } from './types';

/** Default id for PDF format */
export const OUTPUT_FORMAT_ID_PDF = 'pdf';

/** Default id for Word format */
export const OUTPUT_FORMAT_ID_WORD = 'word';

/** Default format list (labels and descriptions only; icons are applied in the component with theme colours) */
export const DEFAULT_OUTPUT_FORMATS: Omit<OutputFormatItem, 'icon'>[] = [
  {
    id: OUTPUT_FORMAT_ID_PDF,
    label: 'PDF',
    description: 'Portable Document Format',
    iconColor: 'error',
  },
  {
    id: OUTPUT_FORMAT_ID_WORD,
    label: 'Word',
    description: 'Microsoft Word Document (.docx)',
    iconColor: 'info',
  },
];

/** Default minimum number of formats that must be selected */
export const DEFAULT_MIN_SELECTED_FORMATS = 1;

/** Default selected format ids (PDF only, per AC1) */
export const DEFAULT_SELECTED_FORMATS: string[] = [OUTPUT_FORMAT_ID_PDF];

/** Validation message when user attempts to deselect below minSelected */
export const OUTPUT_FORMAT_MIN_SELECTED_MESSAGE =
  'At least one output format must be selected.';
