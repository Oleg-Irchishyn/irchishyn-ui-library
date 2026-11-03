import type { Meta, StoryObj } from '@storybook/react';
import { Box, Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { action } from '@storybook/addon-actions';

import { IrchishynThemeProvider } from '../../providers';
import { DocumentTemplateCard } from './DocumentTemplateCard';
import { DOCUMENT_TEMPLATE_CARD_ACTION_TYPES } from './constants';
import type { DocumentTemplateCardAction } from './types';

const meta: Meta<typeof DocumentTemplateCard> = {
  title: 'Components/DocumentTemplateCard',
  component: DocumentTemplateCard,
  parameters: {
    docs: {
      description: {
        component:
          'Reusable card for attached templates and documents with type badge, file icon, configurable actions, selection state, and overflow-aware file name tooltip.',
      },
    },
  },
  argTypes: {
    type: { control: 'text' },
    label: { control: 'text' },
    fileName: { control: 'text' },
    selected: { control: 'boolean' },
    onClick: { action: 'cardClicked' },
  },
  decorators: [
    (Story) => (
      <IrchishynThemeProvider mode="light">
        <Box sx={{ p: 3 }}>
          <Story />
        </Box>
      </IrchishynThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DocumentTemplateCard>;

const coverLetterActions: DocumentTemplateCardAction[] = [
  { type: DOCUMENT_TEMPLATE_CARD_ACTION_TYPES.SWAP, onClick: action('cover-letter:swap') },
  { type: DOCUMENT_TEMPLATE_CARD_ACTION_TYPES.DELETE, onClick: action('cover-letter:delete') },
];

const templateActions: DocumentTemplateCardAction[] = [
  { type: DOCUMENT_TEMPLATE_CARD_ACTION_TYPES.SWAP, onClick: action('template:swap') },
  { type: DOCUMENT_TEMPLATE_CARD_ACTION_TYPES.SETTINGS, onClick: action('template:settings') },
];

const addendumActions: DocumentTemplateCardAction[] = [
  { type: DOCUMENT_TEMPLATE_CARD_ACTION_TYPES.SWAP, onClick: action('addendum:swap') },
  { type: DOCUMENT_TEMPLATE_CARD_ACTION_TYPES.DELETE, onClick: action('addendum:delete') },
];

export const CoverLetter: Story = {
  args: {
    type: 'Cover Letter',
    label: 'Cover Letter',
    fileName: 'Cover Letter - Standard.pdf',
    selected: false,
    actions: coverLetterActions,
    onClick: action('cover-letter:card-click'),
  },
};

export const TemplateSelected: Story = {
  args: {
    type: 'Template',
    label: 'Template',
    fileName: 'CapitalCall_Template_v3.docx',
    selected: true,
    actions: templateActions,
    onClick: action('template:card-click'),
  },
};

export const Addendum: Story = {
  args: {
    type: 'Addendum',
    label: 'Addendum',
    fileName: 'Tax_Withholding_Addendum_2025.pdf',
    selected: false,
    actions: addendumActions,
    onClick: action('addendum:card-click'),
  },
};

export const InteractiveSet: Story = {
  render: function InteractiveSetStory() {
    const [selectedType, setSelectedType] = useState('Template');
    const actionsByType = useMemo<Record<string, DocumentTemplateCardAction[]>>(
      () => ({
        'Cover Letter': coverLetterActions,
        Template: templateActions,
        Addendum: addendumActions,
      }),
      [],
    );

    const cards = [
      { type: 'Cover Letter', fileName: 'Cover Letter - Standard.pdf' },
      { type: 'Template', fileName: 'CapitalCall_Template_v3.docx' },
      { type: 'Addendum', fileName: 'Tax_Withholding_Addendum_2025.pdf' },
    ];

    return (
      <Stack spacing={2}>
        <Typography variant="body2" color="text.secondary">
          Click a card to set selected state.
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {cards.map((card) => (
            <DocumentTemplateCard
              key={card.type}
              type={card.type}
              label={card.type}
              fileName={card.fileName}
              selected={selectedType === card.type}
              actions={actionsByType[card.type]}
              onClick={() => {
                action('interactive-set:card-click')(card.type);
                setSelectedType(card.type);
              }}
            />
          ))}
        </Box>
      </Stack>
    );
  },
};

export const DarkMode: Story = {
  decorators: [
    (Story) => (
      <IrchishynThemeProvider mode="dark">
        <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: 240 }}>
          <Story />
        </Box>
      </IrchishynThemeProvider>
    ),
  ],
  args: {
    type: 'Template',
    label: 'Template',
    fileName: 'Very_Long_Template_Name_That_Should_Show_A_Tooltip_When_It_Overflows.docx',
    selected: true,
    actions: templateActions,
  },
};

export const Actions: Story = {
  render: function ActionsStory() {
    const [selectedType, setSelectedType] = useState('Template');
    const [lastAction, setLastAction] = useState('No action triggered yet');

    const cards = [
      { type: 'Cover Letter', fileName: 'Cover Letter - Standard.pdf' },
      { type: 'Template', fileName: 'CapitalCall_Template_v3.docx' },
      { type: 'Addendum', fileName: 'Tax_Withholding_Addendum_2025.pdf' },
    ];

    const actionsByType = useMemo<Record<string, DocumentTemplateCardAction[]>>(
      () => ({
        'Cover Letter': [
          {
            type: DOCUMENT_TEMPLATE_CARD_ACTION_TYPES.SWAP,
            onClick: ({ label, actionType }) => {
              action('actions-story:swap')({ label, actionType });
              setLastAction(`${label}: ${actionType}`);
            },
          },
          {
            type: DOCUMENT_TEMPLATE_CARD_ACTION_TYPES.DELETE,
            onClick: ({ label, actionType }) => {
              action('actions-story:delete')({ label, actionType });
              setLastAction(`${label}: ${actionType}`);
            },
          },
        ],
        Template: [
          {
            type: DOCUMENT_TEMPLATE_CARD_ACTION_TYPES.SWAP,
            onClick: ({ label, actionType }) => {
              action('actions-story:swap')({ label, actionType });
              setLastAction(`${label}: ${actionType}`);
            },
          },
          {
            type: DOCUMENT_TEMPLATE_CARD_ACTION_TYPES.SETTINGS,
            onClick: ({ label, actionType }) => {
              action('actions-story:settings')({ label, actionType });
              setLastAction(`${label}: ${actionType}`);
            },
          },
        ],
        Addendum: [
          {
            type: DOCUMENT_TEMPLATE_CARD_ACTION_TYPES.SWAP,
            onClick: ({ label, actionType }) => {
              action('actions-story:swap')({ label, actionType });
              setLastAction(`${label}: ${actionType}`);
            },
          },
          {
            type: DOCUMENT_TEMPLATE_CARD_ACTION_TYPES.DELETE,
            onClick: ({ label, actionType }) => {
              action('actions-story:delete')({ label, actionType });
              setLastAction(`${label}: ${actionType}`);
            },
          },
        ],
      }),
      [],
    );

    return (
      <Stack spacing={2}>
        <Typography variant="body2" color="text.secondary">
          Use top-right icons to trigger action callbacks. Click card body to select.
        </Typography>
        <Typography variant="body2">
          Last action: <strong>{lastAction}</strong>
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {cards.map((card) => (
            <DocumentTemplateCard
              key={card.type}
              type={card.type}
              label={card.type}
              fileName={card.fileName}
              selected={selectedType === card.type}
              actions={actionsByType[card.type]}
              onClick={() => {
                action('actions-story:card-click')(card.type);
                setSelectedType(card.type);
              }}
            />
          ))}
        </Box>
      </Stack>
    );
  },
};
