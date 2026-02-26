import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Box, Typography } from '@mui/material';

import { LanguageEditor } from './components/LanguageEditor';
import type { FieldDefinition, ValidationResult } from './types';

const sampleFieldConfig: FieldDefinition[] = [
  {
    name: 'INVESTOR_NAME',
    displayName: 'Investor Name',
    type: 'Dimension',
    dataType: 'text',
    group: 'Identity',
  },
  {
    name: 'FUND_NAME',
    displayName: 'Fund Name',
    type: 'Dimension',
    dataType: 'text',
    group: 'Identity',
  },
  {
    name: 'NET_CALL_AMOUNT',
    displayName: 'Net Call Amount',
    type: 'Measure',
    dataType: 'number',
    group: 'Financials',
  },
  {
    name: 'DUE_DATE',
    displayName: 'Due Date',
    type: 'Dimension',
    dataType: 'date',
    group: 'Dates',
  },
  {
    name: 'IS_CAPITAL_CALL',
    displayName: 'Is Capital Call',
    type: 'Boolean',
    dataType: 'boolean',
  },
  {
    name: 'ENTITY_NAME',
    displayName: 'Entity Name',
    type: 'Dimension',
    dataType: 'text',
    group: 'Identity',
  },
];

const sampleContentWithTokens = `Dear «INVESTOR_NAME»,

This letter is to inform you about your investment in «FUND_NAME».

{{IF IS_CAPITAL_CALL equals true}}Your capital call amount is «NET_CALL_AMOUNT», due by «DUE_DATE».{{ELSE}}This is a distribution notice.{{ENDIF}}

Best regards,
«ENTITY_NAME»`;

const meta: Meta<typeof LanguageEditor> = {
  title: 'Components/LanguageEditor/LanguageEditor',
  component: LanguageEditor,
  parameters: {
    docs: {
      description: {
        component:
          'Rich text editor with conditional syntax and field references. Supports B/I/U formatting, field insertion, conditional language builder, and content validation.',
      },
    },
  },
  argTypes: {
    onChange: { action: 'changed' },
    onValidate: { action: 'validated' },
  },
};

export default meta;

type Story = StoryObj<typeof LanguageEditor>;

function LanguageEditorWithState(props: {
  fieldConfig: FieldDefinition[];
  initialContent?: string;
  readOnly?: boolean;
  placeholder?: string;
  minHeight?: string;
  onValidate?: (result: ValidationResult) => void;
}) {
  const [content, setContent] = useState(props.initialContent ?? '');
  const [lastValidation, setLastValidation] = useState<ValidationResult | null>(null);

  return (
    <Box>
      <LanguageEditor
        fieldConfig={props.fieldConfig}
        content={content}
        onChange={setContent}
        onValidate={(result) => {
          setLastValidation(result);
          props.onValidate?.(result);
        }}
        readOnly={props.readOnly}
        placeholder={props.placeholder}
        minHeight={props.minHeight}
      />
      <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          Current Content (plain text):
        </Typography>
        <pre style={{ margin: 0, fontSize: 12, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {content || '(empty)'}
        </pre>
      </Box>
      {lastValidation && (
        <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Last Validation Result:
          </Typography>
          <pre style={{ margin: 0, fontSize: 12 }}>{JSON.stringify(lastValidation, null, 2)}</pre>
        </Box>
      )}
    </Box>
  );
}

export const Default: Story = {
  render: (args) => (
    <LanguageEditorWithState
      fieldConfig={args.fieldConfig ?? sampleFieldConfig}
      initialContent=""
      onValidate={args.onValidate}
    />
  ),
  args: {
    fieldConfig: sampleFieldConfig,
    content: '',
  },
};

export const WithContent: Story = {
  render: (args) => (
    <LanguageEditorWithState
      fieldConfig={args.fieldConfig ?? sampleFieldConfig}
      initialContent={sampleContentWithTokens}
      onValidate={args.onValidate}
    />
  ),
  args: {
    fieldConfig: sampleFieldConfig,
    content: sampleContentWithTokens,
  },
};

export const ReadOnly: Story = {
  render: (args) => (
    <LanguageEditorWithState
      fieldConfig={args.fieldConfig ?? sampleFieldConfig}
      initialContent={sampleContentWithTokens}
      readOnly
      onValidate={args.onValidate}
    />
  ),
  args: {
    fieldConfig: sampleFieldConfig,
    content: sampleContentWithTokens,
    readOnly: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'In read-only mode, the toolbar is hidden and the content is not editable, but token rendering is preserved.',
      },
    },
  },
};

export const Empty: Story = {
  render: (args) => (
    <LanguageEditorWithState
      fieldConfig={args.fieldConfig ?? sampleFieldConfig}
      initialContent=""
      placeholder={args.placeholder}
      onValidate={args.onValidate}
    />
  ),
  args: {
    fieldConfig: sampleFieldConfig,
    content: '',
    placeholder: 'Start typing your content here...',
  },
  parameters: {
    docs: {
      description: {
        story: 'When content is empty, a placeholder is shown in the editor area.',
      },
    },
  },
};

export const ValidationErrors: Story = {
  render: (args) => (
    <LanguageEditorWithState
      fieldConfig={args.fieldConfig ?? sampleFieldConfig}
      initialContent={`Dear «UNKNOWN_FIELD»,

{{IF INVALID_FIELD badOperator value}}Content here{{ENDIF}}

Missing endif: {{IF IS_CAPITAL_CALL equals true}}Some content`}
      onValidate={args.onValidate}
    />
  ),
  args: {
    fieldConfig: sampleFieldConfig,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Click the Validate button to see validation errors for invalid field references, unknown operators, and mismatched IF/ENDIF.',
      },
    },
  },
};

export const CustomHeight: Story = {
  render: (args) => (
    <LanguageEditorWithState
      fieldConfig={args.fieldConfig ?? sampleFieldConfig}
      initialContent=""
      minHeight={args.minHeight}
      onValidate={args.onValidate}
    />
  ),
  args: {
    fieldConfig: sampleFieldConfig,
    content: '',
    minHeight: '400px',
  },
  parameters: {
    docs: {
      description: {
        story: 'The editor height can be customized using the minHeight prop.',
      },
    },
  },
};

export const AllFieldTypes: Story = {
  render: (args) => (
    <LanguageEditorWithState
      fieldConfig={args.fieldConfig ?? sampleFieldConfig}
      initialContent=""
      onValidate={args.onValidate}
    />
  ),
  args: {
    fieldConfig: [
      { name: 'text_field', displayName: 'Text Field', type: 'Dimension', dataType: 'text' },
      { name: 'number_field', displayName: 'Number Field', type: 'Measure', dataType: 'number' },
      { name: 'date_field', displayName: 'Date Field', type: 'Dimension', dataType: 'date' },
      { name: 'boolean_field', displayName: 'Boolean Field', type: 'Boolean', dataType: 'boolean' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Field configuration with all supported data types. Use the Insert Field button to see the field type badges.',
      },
    },
  },
};
