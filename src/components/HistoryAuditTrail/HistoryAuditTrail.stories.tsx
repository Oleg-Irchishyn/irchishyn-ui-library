import { useState } from 'react';
import type { ComponentProps } from 'react';
import { Button, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Meta, StoryObj } from '@storybook/react';
import { HistoryAuditTrail } from './HistoryAuditTrail';

import { HISTORY_AUDIT_EVENT_TYPES, HISTORY_AUDIT_RENDER_MODES } from './constants';
import type { HistoryAuditTrailEvent, HistoryAuditTrailRenderMode } from './types';

const sample: HistoryAuditTrailEvent[] = [
  {
    id: 'a9928ba7-c353-4180-be08-4f2e4defebc7',
    source: '/capevent/configuration/1003',
    username: 'Alice Smith',
    createdBy: 'alice.smith@example.com',
    auditEventType: HISTORY_AUDIT_EVENT_TYPES.ADDED,
    subject: "Added new derived field 'Net_Contribution'",
    oldValue: null,
    newValue: null,
    details: 'Gross_Contribution - fees',
    timestamp: '2026-02-12T09:43:12.9275039+02:00',
  },
  {
    id: '9b8452ad-f84e-4d2d-aa75-6058002592c2',
    source: '/capevent/configuration/1003',
    username: 'Bob Jones',
    auditEventType: HISTORY_AUDIT_EVENT_TYPES.UPDATED,
    subject: "Updated column heading for 'Commitment_Amount'",
    fieldChanges: [
      { fieldName: 'Commitment_Amount', oldValue: 'Commitment', newValue: 'Total Commitment ($)' },
    ],
    details: null,
    timestamp: '2026-02-12T08:13:45.1275039+02:00',
  },
  {
    id: '537399a9-c431-4294-a38d-bb39e3b6ed41',
    source: '/capevent/configuration/1003',
    username: 'Bob Jones',
    auditEventType: HISTORY_AUDIT_EVENT_TYPES.UPDATED,
    subject: "Updated placeholder 'NoticeHeader' content",
    oldValue: null,
    newValue: null,
    details: null,
    timestamp: '2026-02-11T16:28:10.2275039+02:00',
  },
  {
    id: '7727e501-c591-4162-829c-6a497812a297',
    source: '/capevent/package/10001',
    username: 'SYSTEM',
    createdBy: 'sarah.williams@example.com',
    auditEventType: HISTORY_AUDIT_EVENT_TYPES.OTHER,
    subject: 'Notice letters generated for all investors',
    oldValue: null,
    newValue: null,
    details: '18 notice letters regenerated after date update',
    fieldChanges: [
      { fieldName: 'Notice Date', oldValue: '01/22/2025', newValue: '01/29/2025' },
      { fieldName: 'Due Date', oldValue: '02/22/2025', newValue: '02/28/2025' },
    ],
    additionalDetails: [
      { key: 'ITERATION', value: '4' },
      { key: 'CONFIGURATION', value: 'CapEvent - Sponsor - SP001-Acme Corp' },
      { key: 'CONFIG_VERSION', value: '7' },
      { key: 'TRIGGERED_BY_USER', value: 'Sarah Williams' },
      { key: 'TRIGGERED_BY_ACTION', value: 'dates_updated' },
    ],
    timestamp: '2026-02-10T11:05:01.3275039+02:00',
  },
  {
    id: '5fbe3731-069f-43fe-9fc3-b0efc55f6ee3',
    source: '/capevent/driver-report/3521',
    username: 'SYSTEM',
    createdBy: 'john.doe@example.com',
    auditEventType: HISTORY_AUDIT_EVENT_TYPES.OTHER,
    subject: 'Testing Irchishyn UI Library integration',
    oldValue: null,
    newValue: null,
    details: '',
    timestamp: '2026-02-20T11:19:22.4318918Z',
  },
  {
    id: 'c2f9bf6a-49a4-4ed7-9b88-3e942f4a6a11',
    source: '/capevent/package/10001',
    username: 'Testing',
    auditEventType: HISTORY_AUDIT_EVENT_TYPES.OTHER,
    subject: 'Field changes list renders multiple items',
    details: 'This event includes 4 fieldChanges objects. Ensure all are rendered in order.',
    fieldChanges: [
      { fieldName: 'Date', oldValue: '12', newValue: '13' },
      { fieldName: 'New Date', oldValue: '14', newValue: '15' },
      { fieldName: 'Status', oldValue: 'Draft', newValue: 'Ready' },
      { fieldName: 'Notes', oldValue: 'Old note', newValue: 'New note' },
    ],
    timestamp: '2026-02-25T22:10:00.000Z',
  },
  {
    id: 'a3c14a7a-2c66-4f68-b6c5-1e2f71e8f3c2',
    source: '/capevent/package/10001',
    username: 'Testing',
    auditEventType: HISTORY_AUDIT_EVENT_TYPES.OTHER,
    subject: 'Field changes without fieldName still render',
    details: null,
    fieldChanges: [
      { fieldName: null, oldValue: 'AAA', newValue: 'BBB' },
      { fieldName: '', oldValue: '1', newValue: '2' },
      { fieldName: undefined, oldValue: 'X', newValue: 'Y' },
    ],
    additionalDetails: [
      { key: 'ITERATION', value: '12' },
      {
        key: 'CONFIGURATION',
        value: 'A very long configuration name to force wrapping in the contextual details section',
      },
      { key: 'CONFIG_VERSION', value: '21' },
    ],
    timestamp: '2026-02-25T22:07:00.000Z',
  },
  {
    id: 'edb3b1d6-2ff5-4c2a-9c11-7209c9f4c9d1',
    source: '/capevent/configuration/1003',
    username: 'Testing',
    auditEventType: HISTORY_AUDIT_EVENT_TYPES.UPDATED,
    subject: 'Many field changes (stress test)',
    details: 'Stress test: many fieldChanges should not collapse to just the first item.',
    fieldChanges: [
      { fieldName: 'Field A', oldValue: 'a1', newValue: 'a2' },
      { fieldName: 'Field B', oldValue: 'b1', newValue: 'b2' },
      { fieldName: 'Field C', oldValue: 'c1', newValue: 'c2' },
      { fieldName: 'Field D', oldValue: 'd1', newValue: 'd2' },
      { fieldName: 'Field E', oldValue: 'e1', newValue: 'e2' },
      { fieldName: 'Field F', oldValue: 'f1', newValue: 'f2' },
    ],
    timestamp: '2026-02-25T22:03:00.000Z',
  },
  {
    id: '80a3a5b7-2142-4a48-8fd2-c831256f9aa5',
    source: '/capevent/driver-report/3521',
    username: 'Other',
    auditEventType: HISTORY_AUDIT_EVENT_TYPES.OTHER,
    subject: '',
    oldValue: null,
    newValue: null,
    details: '',
    timestamp: '2026-02-20T11:20:32.6350662Z',
  },
  {
    id: '2a261039-4144-49b8-bf6d-59b6404e2f67',
    source: '/capevent/package/10001',
    username: 'Sarah Williamns',
    auditEventType: HISTORY_AUDIT_EVENT_TYPES.UPDATED,
    subject: 'Due Date updated for Entity: GI Strategic Partners LP',
    fieldChanges: [{ fieldName: 'Due Date', oldValue: '01/22/2025', newValue: '01/29/2025' }],
    details: null,
    timestamp: '2025-01-29T14:42:50.4275039+02:00',
  },
  {
    id: 'ec5d9bf5-a2a4-46c4-b3ed-cf7f70d3672d',
    source: '/capevent/package/10001',
    username: 'SYSTEM',
    auditEventType: HISTORY_AUDIT_EVENT_TYPES.REMOVED,
    subject: 'Notice letters removed for all investors',
    oldValue: null,
    newValue: null,
    details: '18 notice letters removed after addendum removed',
    timestamp: '2024-11-07T10:12:09.5275039+02:00',
  },
  {
    id: 'f1a2b3c4-d5e6-7890-abcd-ef1234567890',
    source: '/capevent/package/10001',
    username: 'SYSTEM',
    createdBy: 'workflow.engine@example.com',
    auditEventType: HISTORY_AUDIT_EVENT_TYPES.UPDATED,
    subject: 'All fields rendered — full content stress test',
    details:
      'This row exercises every section of the activity column: createdBy, details text, multiple field changes with labels, triggered-by, and contextual details. No content should be clipped or overlap adjacent rows.',
    fieldChanges: [
      { fieldName: 'Status', oldValue: 'Pending Review', newValue: 'Approved' },
      { fieldName: 'Net Amount', oldValue: '1,250,000.00', newValue: '1,375,000.00' },
      { fieldName: 'Due Date', oldValue: '03/15/2026', newValue: '03/29/2026' },
    ],
    additionalDetails: [
      { key: 'TRIGGERED_BY_USER', value: 'Workflow Engine' },
      { key: 'TRIGGERED_BY_ACTION', value: 'auto_approve' },
      { key: 'ITERATION', value: '7' },
      { key: 'CONFIGURATION', value: 'CapEvent - Sponsor - SP001-Acme Corp' },
      { key: 'CONFIG_VERSION', value: '14' },
    ],
    timestamp: '2024-10-01T08:00:00.000Z',
  },
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-111122223333',
    source: '/capevent/configuration/1003',
    username: 'Carol Davis',
    auditEventType: HISTORY_AUDIT_EVENT_TYPES.UPDATED,
    subject: 'Old/new value without fieldChanges array',
    oldValue: 'Draft Template v1',
    newValue: 'Approved Template v2',
    details: null,
    timestamp: '2024-09-15T14:30:00.000Z',
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-222233334444',
    source: '/capevent/driver-report/3521',
    username: 'Dave Kim',
    auditEventType: HISTORY_AUDIT_EVENT_TYPES.ADDED,
    subject: 'Long details text wraps across multiple lines',
    details:
      'This is a deliberately long details message to verify that multi-line details text is fully visible and the row height expands correctly to accommodate all the text without any overflow or clipping issues. The row below should not overlap this one.',
    timestamp: '2024-08-20T10:00:00.000Z',
  },
];

const moduleSources = [
  '/capevent/package/10001',
  '/capevent/configuration/1003',
  '/capevent/driver-report/3521',
];

const meta: Meta<typeof HistoryAuditTrail> = {
  title: 'Components/HistoryAuditTrail',
  component: HistoryAuditTrail,
  argTypes: {
    onItemClick: { action: 'item clicked' },
    onClear: { action: 'cleared' },
    enableExport: { control: 'boolean' },
    exportFileName: { control: 'text' },
    renderMode: {
      control: { type: 'inline-radio' },
      options: [HISTORY_AUDIT_RENDER_MODES.PANEL, HISTORY_AUDIT_RENDER_MODES.INLINE],
    },
  },
  args: {
    renderMode: HISTORY_AUDIT_RENDER_MODES.PANEL,
    title: 'Activity History',
    countLabel: `${sample.length} events`,
    events: sample,
    enableExport: false,
    exportFileName: 'history-audit-trail',
    moduleSources,
    primaryModuleSource: '/capevent/package/10001',
  },
};

export default meta;
type Story = StoryObj<typeof HistoryAuditTrail>;

const ToggleModesStoryRenderer = (args: ComponentProps<typeof HistoryAuditTrail>) => {
  const [renderMode, setRenderMode] = useState<HistoryAuditTrailRenderMode>(
    HISTORY_AUDIT_RENDER_MODES.PANEL,
  );

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1}>
        <Button
          size="small"
          variant={renderMode === HISTORY_AUDIT_RENDER_MODES.PANEL ? 'contained' : 'outlined'}
          onClick={() => setRenderMode(HISTORY_AUDIT_RENDER_MODES.PANEL)}
        >
          Panel
        </Button>
        <Button
          size="small"
          variant={renderMode === HISTORY_AUDIT_RENDER_MODES.INLINE ? 'contained' : 'outlined'}
          onClick={() => setRenderMode(HISTORY_AUDIT_RENDER_MODES.INLINE)}
        >
          Inline
        </Button>
      </Stack>
      <HistoryAuditTrail {...args} renderMode={renderMode} />
    </Stack>
  );
};

export const Default: Story = {
  args: {
    events: sample,
    countLabel: `${sample.length} events`,
  },
};

export const Empty: Story = {
  args: { events: [], countLabel: '0 events' },
};

export const Loading: Story = {
  args: { events: [], countLabel: '0 events', loading: true },
};

export const Error: Story = {
  args: {
    events: [],
    countLabel: '0 events',
    error: 'Error: Audit Trail request failed (401)',
  },
};

export const ExportEnabled: Story = {
  args: {
    events: sample,
    countLabel: `${sample.length} events`,
    enableExport: true,
    exportFileName: 'history-audit-trail-storybook',
  },
};

export const ActionStyles: Story = {
  args: {
    events: sample,
    countLabel: `${sample.length} events`,
    actionStyles: {
      [HISTORY_AUDIT_EVENT_TYPES.ADDED]: {
        icon: <AddIcon fontSize="small" />,
        backgroundColor: '#E8F5E9',
        iconColor: '#2E7D32',
      },
      [HISTORY_AUDIT_EVENT_TYPES.UPDATED]: {
        icon: <EditIcon fontSize="small" />,
        backgroundColor: '#E3F2FD',
        iconColor: '#1565C0',
      },
      [HISTORY_AUDIT_EVENT_TYPES.REMOVED]: {
        icon: <DeleteIcon fontSize="small" />,
        backgroundColor: '#FFEBEE',
        iconColor: '#C62828',
      },
    },
    defaultActionStyle: {
      backgroundColor: '#F3F4F6',
      iconColor: '#374151',
      borderColor: '#D1D5DB',
    },
  },
};

export const MultiModule: Story = {
  args: {
    events: sample,
    countLabel: `${sample.length} events`,
    moduleSources,
    primaryModuleSource: '/capevent/package/10001',
  },
};

export const InlineMode: Story = {
  args: {
    renderMode: HISTORY_AUDIT_RENDER_MODES.INLINE,
    events: sample,
    countLabel: `${sample.length} events`,
    moduleSources,
    primaryModuleSource: '/capevent/package/10001',
    enableExport: true,
  },
};

export const ToggleModes: Story = {
  render: (args) => <ToggleModesStoryRenderer {...args} />,
  args: {
    events: sample,
    countLabel: `${sample.length} events`,
    moduleSources,
    primaryModuleSource: '/capevent/package/10001',
    enableExport: true,
  },
};
