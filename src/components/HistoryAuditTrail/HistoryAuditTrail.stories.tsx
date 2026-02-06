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
    timestamp: '2026-02-03T13:16:35.9275039+02:00',
  },
  {
    id: '9b8452ad-f84e-4d2d-aa75-6058002592c2',
    source: '/capevent/configuration/1003',
    username: 'Bob Jones',
    auditEventType: HISTORY_AUDIT_EVENT_TYPES.UPDATED,
    subject: "Updated column heading for 'Commitment_Amount'",
    oldValue: 'Commitment',
    newValue: 'Total Commitment ($)',
    details: null,
    timestamp: '2026-02-03T13:16:35.9275039+02:00',
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
    timestamp: '2026-02-03T13:16:35.9275039+02:00',
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
    timestamp: '2026-02-03T13:16:35.9275039+02:00',
  },
  {
    id: '2a261039-4144-49b8-bf6d-59b6404e2f67',
    source: '/capevent/package/10001',
    username: 'Sarah Williamns',
    auditEventType: HISTORY_AUDIT_EVENT_TYPES.UPDATED,
    subject: 'Due Date updated for Entity: GI Strategic Partners LP',
    oldValue: '01/22/2025',
    newValue: '01/29/2025',
    details: null,
    timestamp: '2026-02-03T13:16:35.9275039+02:00',
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
    timestamp: '2026-02-03T13:16:35.9275039+02:00',
  },
];

const meta: Meta<typeof HistoryAuditTrail> = {
  title: 'Components/HistoryAuditTrail',
  component: HistoryAuditTrail,
  argTypes: {
    onItemClick: { action: 'item clicked' },
    onClear: { action: 'cleared' },
  },
  args: {
    title: 'Activity History',
    countLabel: `${sample.length} events`,
    events: sample,
  },
};

export default meta;
type Story = StoryObj<typeof HistoryAuditTrail>;

export const Default: Story = {
  args: {
    events: [
      {
        id: 'a9928ba7-c353-4180-be08-4f2e4defebc7',
        source: '/capevent/configuration/1003',
        username: 'Alice Smith',
        auditEventType: 'ADDED',
        subject: "Added new derived field 'Net_Contribution'",
        oldValue: null,
        newValue: null,
        details: 'Gross_Contribution - fees',
        timestamp: '2026-02-03T13:16:35.9275039+02:00',
      },
      {
        id: '9b8452ad-f84e-4d2d-aa75-6058002592c2',
        source: '/capevent/configuration/1003',
        username: 'Bob Jones',
        auditEventType: 'UPDATED',
        subject: "Updated column heading for 'Commitment_Amount'",
        oldValue: 'Commitment',
        newValue: 'Total Commitment ($)',
        details: null,
        timestamp: '2026-02-03T13:16:35.9275039+02:00',
      },
      {
        id: '537399a9-c431-4294-a38d-bb39e3b6ed41',
        source: '/capevent/configuration/1003',
        username: 'Bob Jones',
        auditEventType: 'UPDATED',
        subject: "Updated placeholder 'NoticeHeader' content",
        oldValue: null,
        newValue: null,
        details: null,
        timestamp: '2026-02-03T13:16:35.9275039+02:00',
      },
      {
        id: '7727e501-c591-4162-829c-6a497812a297',
        source: '/capevent/package/10001',
        username: 'SYSTEM',
        auditEventType: 'OTHER',
        subject: 'Notice letters generated for all investors',
        oldValue: null,
        newValue: null,
        details: '18 notice letters regenerated after date update',
        timestamp: '2026-02-03T13:16:35.9275039+02:00',
      },
      {
        id: '2a261039-4144-49b8-bf6d-59b6404e2f67',
        source: '/capevent/package/10001',
        username: 'Sarah Williamns',
        auditEventType: 'UPDATED',
        subject: 'Due Date updated for Entity: GI Strategic Partners LP',
        oldValue: '01/22/2025',
        newValue: '01/29/2025',
        details: null,
        timestamp: '2026-02-03T13:16:35.9275039+02:00',
      },
      {
        id: 'ec5d9bf5-a2a4-46c4-b3ed-cf7f70d3672d',
        source: '/capevent/package/10001',
        username: 'SYSTEM',
        auditEventType: 'REMOVED',
        subject: 'Notice letters removed for all investors',
        oldValue: null,
        newValue: null,
        details: '18 notice letters removed after addendum removed',
        timestamp: '2026-02-03T13:16:35.9275039+02:00',
      },
      {
        id: 'ec5d9bf5-a2a4-46c4-b3ed-cf7f70d3672d',
        source: '/capevent/package/10001',
        username: 'SYSTEM',
        auditEventType: 'UPDATED',
        subject: 'Notice letters removed for all investors',
        oldValue: null,
        newValue: null,
        details: '18 notice letters removed after addendum removed',
        timestamp: '2026-02-03T13:16:35.9275039+02:00',
      },
    ],

    countLabel: '7 events',
  },
};

export const Empty: Story = {
  args: { events: [], countLabel: '0 events' },
};

export const Loading: Story = {
  args: { events: [], countLabel: '0 events', loading: true },
};
