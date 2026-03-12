import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { HistoryAuditTrailTableRow } from '../types';

const useHistoryAuditTrailMock = vi.hoisted(() => vi.fn());

vi.mock('../useHistoryAuditTrail', () => ({
  useHistoryAuditTrail: useHistoryAuditTrailMock,
}));

vi.mock('../components/HistoryAuditTrailHeader', () => ({
  HistoryAuditTrailHeader: ({ countLabel }: { countLabel?: string }) => (
    <div data-testid="history-audit-header-mock">{countLabel ?? ''}</div>
  ),
}));

vi.mock('../components/HistoryAuditTrailLoader', () => ({
  HistoryAuditTrailLoader: () => <div data-testid="history-audit-loader-mock">loader</div>,
}));

vi.mock('../components/HistoryAuditTrailError', () => ({
  HistoryAuditTrailError: ({ message }: { message?: string }) => (
    <div data-testid="history-audit-error-mock">
      {message ?? 'Error: Failed to load activity history.'}
    </div>
  ),
}));

vi.mock('../components/HistoryAuditTrailEmpty', () => ({
  HistoryAuditTrailEmpty: ({ message }: { message?: string }) => (
    <div data-testid="history-audit-empty-mock">{message ?? 'No activity yet.'}</div>
  ),
}));

vi.mock('../components/HistoryAuditTrailTable', () => ({
  HistoryAuditTrailTable: () => <div data-testid="history-audit-table-mock">table</div>,
}));

import { HistoryAuditTrail } from '../HistoryAuditTrail';

const baseHookValue = {
  rowData: [] as HistoryAuditTrailTableRow[],
  columnDefs: [],
  defaultColDef: {},
  onRowClicked: vi.fn(),
  getRowId: vi.fn(),
  quickFilterText: '',
  quickFilterParser: vi.fn(),
  setQuickFilterText: vi.fn(),
  filteredRowCount: 0,
  isSearchActive: false,
  displayedCountLabel: '0 events',
  moduleDropdown: undefined,
  handleClear: vi.fn(),
  onGridReady: vi.fn(),
  handleDownloadExcel: vi.fn(),
  handleDownloadCsv: vi.fn(),
  getContextMenuItems: vi.fn(),
};

describe('HistoryAuditTrail', () => {
  it('renders error state when error message is provided', () => {
    useHistoryAuditTrailMock.mockReturnValue({
      ...baseHookValue,
      rowData: [],
    });

    render(<HistoryAuditTrail events={[]} error="Error: Audit Trail request failed (401)" />);
    expect(screen.getByTestId('history-audit-error-mock').textContent).toBe(
      'Error: Audit Trail request failed (401)',
    );
    expect(screen.queryByTestId('history-audit-header-mock')).toBeNull();
  });

  it('renders loader when loading and no rows', () => {
    useHistoryAuditTrailMock.mockReturnValue({
      ...baseHookValue,
      rowData: [],
    });

    render(<HistoryAuditTrail events={[]} loading={true} />);
    expect(screen.getByTestId('history-audit-loader-mock')).toBeTruthy();
  });

  it('renders empty message when there is no data', () => {
    useHistoryAuditTrailMock.mockReturnValue({
      ...baseHookValue,
      rowData: [],
    });

    render(<HistoryAuditTrail events={[]} />);
    expect(screen.getByTestId('history-audit-empty-mock').textContent).toBe('No activity yet.');
  });

  it('renders no-data-to-display message when search is active and no filtered rows', () => {
    useHistoryAuditTrailMock.mockReturnValue({
      ...baseHookValue,
      rowData: [
        {
          id: '1',
          event: { id: '1', username: 'SYSTEM', auditEventType: 'OTHER', timestamp: '2026-01-01' },
          actor: 'System',
          action: 'Action',
          timeAgo: 'now',
          timestamp: 'Jan 01',
        },
      ],
      isSearchActive: true,
      filteredRowCount: 0,
    });

    render(<HistoryAuditTrail events={[]} />);
    expect(screen.getByTestId('history-audit-empty-mock').textContent).toBe('No Data to display');
  });

  it('renders table when rows are available and passes panel count label', () => {
    useHistoryAuditTrailMock.mockReturnValue({
      ...baseHookValue,
      rowData: [
        {
          id: '1',
          event: { id: '1', username: 'SYSTEM', auditEventType: 'OTHER', timestamp: '2026-01-01' },
          actor: 'System',
          action: 'Action',
          timeAgo: 'now',
          timestamp: 'Jan 01',
        },
      ],
      displayedCountLabel: '1 events',
    });

    render(<HistoryAuditTrail events={[]} />);
    expect(screen.getByTestId('history-audit-table-mock')).toBeTruthy();
    expect(screen.getByTestId('history-audit-header-mock').textContent).toBe('1 events');
  });
});
