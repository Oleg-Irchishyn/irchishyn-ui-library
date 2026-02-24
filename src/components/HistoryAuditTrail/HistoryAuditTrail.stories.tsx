import type { Meta, StoryObj } from '@storybook/react';
import { HistoryAuditTrail } from './HistoryAuditTrail';

import { HISTORY_AUDIT_EVENT_TYPES } from './constants';
import type { HistoryAuditTrailEvent } from './types';

const sample: HistoryAuditTrailEvent[] = [
  {
    id: 'a9928ba7-c353-4180-be08-4f2e4defebc7',
    source: '/capevent/configuration/1003',
    username: 'Alice Smith',
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
    auditEventType: HISTORY_AUDIT_EVENT_TYPES.OTHER,
    subject: 'Notice letters generated for all investors',
    oldValue: null,
    newValue: null,
    details: '18 notice letters regenerated after date update',
    timestamp: '2026-02-10T11:05:01.3275039+02:00',
  },
  {
    id: '5fbe3731-069f-43fe-9fc3-b0efc55f6ee3',
    source: '/capevent/driver-report/3521',
    username: 'SYSTEM',
    auditEventType: HISTORY_AUDIT_EVENT_TYPES.OTHER,
    subject: 'Testing Gen2Fund UI Library integration',
    oldValue: null,
    newValue: null,
    details: '',
    timestamp: '2026-02-20T11:19:22.4318918Z',
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
  },
  args: {
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

export const ExportEnabled: Story = {
  args: {
    events: sample,
    countLabel: `${sample.length} events`,
    enableExport: true,
    exportFileName: 'history-audit-trail-storybook',
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
