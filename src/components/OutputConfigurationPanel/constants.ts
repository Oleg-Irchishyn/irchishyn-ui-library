import type { FileNamingToken, FileNamingVariable, OutputFormatItem } from './types';

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
export const OUTPUT_FORMAT_MIN_SELECTED_MESSAGE = 'At least one output format must be selected.';

/** Split mode: single consolidated document */
export const SPLIT_MODE_CONSOLIDATED = 'consolidated';

/** Split mode: separate document per investor */
export const SPLIT_MODE_SPLIT_PER_INVESTOR = 'splitPerInvestor';

/** Default split mode (Consolidated File selected) */
export const DEFAULT_SPLIT_MODE = SPLIT_MODE_CONSOLIDATED;

/** Default File Splitting options (title + description per AC3) */
export const DEFAULT_FILE_SPLITTING_OPTIONS: {
  value: 'consolidated' | 'splitPerInvestor';
  title: string;
  description: string;
}[] = [
  {
    value: 'consolidated',
    title: 'Consolidated File',
    description:
      'Generate a single document containing all investors. Best for internal review or batch processing.',
  },
  {
    value: 'splitPerInvestor',
    title: 'Split Per Investor',
    description:
      'Generate separate documents for each investor. Best for distribution and individual communications.',
  },
];

/** Variable keys for file naming (aligned with POC) */
export const FILE_NAMING_VAR_FUND_GROUP = 'fundGroup';
export const FILE_NAMING_VAR_FUND_GROUP_ID = 'fundGroupId';
export const FILE_NAMING_VAR_EVENT_TYPE = 'eventType';
export const FILE_NAMING_VAR_EVENT_ID = 'eventId';
export const FILE_NAMING_VAR_NOTICE_DATE = 'noticeDate';
export const FILE_NAMING_VAR_DUE_DATE = 'dueDate';
export const FILE_NAMING_VAR_ENTITY_NAME = 'entityName';
export const FILE_NAMING_VAR_ENTITY_ID = 'entityId';
export const FILE_NAMING_VAR_SPONSOR_NAME = 'sponsorName';
export const FILE_NAMING_VAR_SPONSOR_ID = 'sponsorId';
export const FILE_NAMING_VAR_INVESTOR_ID = 'investorId';
export const FILE_NAMING_VAR_INVESTOR_NAME = 'investorName';
export const FILE_NAMING_VAR_INVESTOR_TYPE = 'investorType';
export const FILE_NAMING_VAR_INVESTOR_ACCOUNT = 'investorAccount';

/** Default available variables for File Naming - consolidated mode (label + value) */
export const DEFAULT_FILE_NAMING_VARIABLES: FileNamingVariable[] = [
  { label: 'Fund Group', value: FILE_NAMING_VAR_FUND_GROUP },
  { label: 'Fund Group ID', value: FILE_NAMING_VAR_FUND_GROUP_ID },
  { label: 'Entity Name', value: FILE_NAMING_VAR_ENTITY_NAME },
  { label: 'Entity ID', value: FILE_NAMING_VAR_ENTITY_ID },
  { label: 'Event Type', value: FILE_NAMING_VAR_EVENT_TYPE },
  { label: 'Event ID', value: FILE_NAMING_VAR_EVENT_ID },
  { label: 'Notice Date', value: FILE_NAMING_VAR_NOTICE_DATE },
  { label: 'Due Date', value: FILE_NAMING_VAR_DUE_DATE },
  { label: 'Sponsor Name', value: FILE_NAMING_VAR_SPONSOR_NAME },
  { label: 'Sponsor ID', value: FILE_NAMING_VAR_SPONSOR_ID },
];

/** Variables for File Naming when split per investor */
export const DEFAULT_FILE_NAMING_VARIABLES_PER_INVESTOR: FileNamingVariable[] = [
  { label: 'Investor ID', value: FILE_NAMING_VAR_INVESTOR_ID },
  { label: 'Investor Name', value: FILE_NAMING_VAR_INVESTOR_NAME },
  { label: 'Investor Type', value: FILE_NAMING_VAR_INVESTOR_TYPE },
  { label: 'Account Number', value: FILE_NAMING_VAR_INVESTOR_ACCOUNT },
  { label: 'Entity ID', value: FILE_NAMING_VAR_ENTITY_ID },
  { label: 'Entity Name', value: FILE_NAMING_VAR_ENTITY_NAME },
  { label: 'Fund Group', value: FILE_NAMING_VAR_FUND_GROUP },
  { label: 'Event Type', value: FILE_NAMING_VAR_EVENT_TYPE },
  { label: 'Notice Date', value: FILE_NAMING_VAR_NOTICE_DATE },
  { label: 'Due Date', value: FILE_NAMING_VAR_DUE_DATE },
];

/** Default token sequence for File Naming - consolidated (e.g. Fund Group _ Event Type _ Notice Date) */
export const DEFAULT_FILE_NAMING_TOKENS: FileNamingToken[] = [
  { type: 'variable', value: FILE_NAMING_VAR_FUND_GROUP },
  { type: 'static', value: '_' },
  { type: 'variable', value: FILE_NAMING_VAR_EVENT_TYPE },
  { type: 'static', value: '_' },
  { type: 'variable', value: FILE_NAMING_VAR_NOTICE_DATE },
];

/** Default token sequence for File Naming when split per investor */
export const DEFAULT_FILE_NAMING_TOKENS_PER_INVESTOR: FileNamingToken[] = [
  { type: 'variable', value: FILE_NAMING_VAR_INVESTOR_ID },
];

/** Demo values for preview when variable values are resolved (e.g. for Storybook) */
export const DEFAULT_FILE_NAMING_DEMO_VALUES: Record<string, string> = {
  [FILE_NAMING_VAR_FUND_GROUP]: 'Global Fund II',
  [FILE_NAMING_VAR_FUND_GROUP_ID]: 'FG001',
  [FILE_NAMING_VAR_EVENT_TYPE]: 'Capital Call',
  [FILE_NAMING_VAR_EVENT_ID]: 'CE-2025-001',
  [FILE_NAMING_VAR_NOTICE_DATE]: '2025-01-29',
  [FILE_NAMING_VAR_DUE_DATE]: '2025-02-15',
  [FILE_NAMING_VAR_ENTITY_NAME]: 'Acme Corp LP',
  [FILE_NAMING_VAR_ENTITY_ID]: 'ENT001',
  [FILE_NAMING_VAR_SPONSOR_NAME]: 'Acme Corp',
  [FILE_NAMING_VAR_SPONSOR_ID]: 'SP001',
  [FILE_NAMING_VAR_INVESTOR_ID]: 'INV001',
  [FILE_NAMING_VAR_INVESTOR_NAME]: 'John Smith',
  [FILE_NAMING_VAR_INVESTOR_TYPE]: 'Limited Partner',
  [FILE_NAMING_VAR_INVESTOR_ACCOUNT]: 'ACC-12345',
};

/** Subtitle for File Naming section - consolidated mode */
export const FILE_NAMING_SUBTITLE_CONSOLIDATED =
  'Configure the output file name by combining static text and variables.';

/** Subtitle for File Naming section - split per investor mode */
export const FILE_NAMING_SUBTITLE_PER_INVESTOR =
  'Configure how individual investor files should be named by combining static text and variables.';

/** Default file extension for preview */
export const DEFAULT_FILE_NAMING_PREVIEW_EXTENSION = '.pdf';

/** Preset static options for the "+ Add" picker (label for UI, value for token) */
export const FILE_NAMING_STATIC_OPTIONS: FileNamingVariable[] = [
  { label: 'Underscore (_)', value: '_' },
  { label: 'Space', value: ' ' },
  { label: 'Hyphen (-)', value: '-' },
];

/** File Naming Section – UI strings and layout constants */
export const FILE_NAMING_SECTION_TITLE = 'File Naming Convention';
export const FILE_NAME_STRUCTURE_LABEL = 'File Name Structure';
export const PREVIEW_LABEL = 'Preview';
export const ADD_BUTTON_LABEL = 'Add';
export const RESET_LABEL = 'Reset to Default';
export const ADD_SEGMENT_TITLE = 'Add Segment';
export const ADD_SEGMENT_SUBTITLE = 'Choose segment type to add';
export const ADD_SEGMENT_TAB_VARIABLE = 'variable' as const;
export const ADD_SEGMENT_TAB_STATIC = 'static' as const;
export const ADD_SEGMENT_STATIC_LABEL = 'Static Text';
export const ADD_SEGMENT_STATIC_PLACEHOLDER = 'e.g., _, -, Notice';
export const ADD_STATIC_BUTTON_LABEL = 'Add Static Text';
export const FILE_NAMING_SECTION_ICON_SIZE = 20;
export const FILE_NAMING_TOKEN_ICON_SIZE = 14;
export const FILE_NAMING_POPOVER_VARIABLE_LIST_HEIGHT = 200;
