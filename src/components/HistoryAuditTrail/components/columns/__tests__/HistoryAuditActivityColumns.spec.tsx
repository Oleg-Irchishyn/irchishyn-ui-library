import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { GridApi, ICellRendererParams, IRowNode } from 'ag-grid-community';

import type { HistoryAuditTrailTableRow } from '../../../types';
import { HistoryAuditActivityColumns } from '../HistoryAuditActivityColumns';

vi.mock('../../HistoryAuditTrailIcons', () => ({
  BotIcon: () => <span>bot-icon</span>,
  HistoryAuditTrailIconForType: ({ type }: { type: string }) => <span>{`event-icon-${type}`}</span>,
}));

describe('HistoryAuditActivityColumns', () => {
  it('returns null when row data is missing', () => {
    const params = {
      data: undefined,
      node: undefined,
      api: undefined,
    } as unknown as ICellRendererParams<HistoryAuditTrailTableRow>;

    const { container } = render(<HistoryAuditActivityColumns {...params} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders actor/action/details/changes/triggered-by/contextual details', () => {
    const data: HistoryAuditTrailTableRow = {
      id: 'row-1',
      actor: 'John Doe',
      badge: 'System',
      moduleBadge: 'Module A',
      moduleBadgeColor: '#00A9E0',
      action: 'Updated record',
      details: 'A detailed description',
      timeAgo: 'now',
      timestamp: 'Jan 01',
      event: {
        id: 'evt-1',
        username: 'SYSTEM',
        auditEventType: 'UPDATED',
        details: 'A detailed description',
        fieldChanges: [{ fieldName: 'Status', oldValue: 'Pending', newValue: 'Approved' }],
        additionalDetails: [
          { key: 'TRIGGERED_BY_USER', value: 'Workflow Engine' },
          { key: 'TRIGGERED_BY_ACTION', value: 'Auto Approve' },
          { key: 'CONFIGURATION', value: 'Validation Config' },
        ],
        timestamp: '2026-01-01T00:00:00.000Z',
      },
    };

    const params = {
      data,
      node: { rowIndex: 0 } as unknown as IRowNode<HistoryAuditTrailTableRow>,
      api: { getDisplayedRowCount: () => 1 } as unknown as GridApi<HistoryAuditTrailTableRow>,
    } as unknown as ICellRendererParams<HistoryAuditTrailTableRow>;

    render(<HistoryAuditActivityColumns {...params} />);

    expect(screen.getByText('John Doe')).toBeTruthy();
    expect(screen.getByText('Updated record')).toBeTruthy();
    expect(screen.getByText('A detailed description')).toBeTruthy();
    expect(screen.getByText('Field: Status')).toBeTruthy();
    expect(screen.getByText('Pending')).toBeTruthy();
    expect(screen.getByText('Approved')).toBeTruthy();
    expect(screen.getByText('Triggered by:')).toBeTruthy();
    expect(screen.getByText('Workflow Engine')).toBeTruthy();
    expect(screen.getByText('(Auto Approve)')).toBeTruthy();
    expect(screen.getByText('Configuration:')).toBeTruthy();
    expect(screen.getByText('Validation Config')).toBeTruthy();
    expect(screen.getByText('bot-icon')).toBeTruthy();
  });

  it('renders non-system activity with fallback changes and custom action style icon', () => {
    const data: HistoryAuditTrailTableRow = {
      id: 'row-2',
      actor: 'Jane Smith',
      badge: null,
      moduleBadge: null,
      moduleBadgeColor: null,
      action: 'Created record',
      details: null,
      timeAgo: '1 hour ago',
      timestamp: 'Jan 02',
      event: {
        id: 'evt-2',
        username: 'jane',
        auditEventType: 'CREATED',
        oldValue: 'old',
        newValue: 'new',
        additionalDetails: [{ key: 'CONFIG_VERSION', value: 'v2' }],
        timestamp: '2026-01-02T00:00:00.000Z',
      },
      changeFrom: 'old',
      changeTo: 'new',
    };

    const params = {
      data,
      node: { rowIndex: 1 } as unknown as IRowNode<HistoryAuditTrailTableRow>,
      api: { getDisplayedRowCount: () => 3 } as unknown as GridApi<HistoryAuditTrailTableRow>,
      actionStyles: {
        CREATED: {
          icon: <span>custom-created-icon</span>,
        },
      },
    } as unknown as ICellRendererParams<HistoryAuditTrailTableRow>;

    render(<HistoryAuditActivityColumns {...params} />);

    expect(screen.getByText('Jane Smith')).toBeTruthy();
    expect(screen.getByText('custom-created-icon')).toBeTruthy();
    expect(screen.getByText('old')).toBeTruthy();
    expect(screen.getByText('new')).toBeTruthy();
    expect(screen.queryByText('Triggered by:')).toBeNull();
    expect(screen.getByText('Config Version:')).toBeTruthy();
    expect(screen.getByText('v2')).toBeTruthy();
  });
});
