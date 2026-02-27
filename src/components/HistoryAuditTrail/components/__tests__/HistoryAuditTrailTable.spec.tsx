import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { HistoryAuditTrailTableRow } from '../../types';

const {
  registerModulesMock,
  getHistoryAuditRowHeightMock,
  createHistoryAuditAgGridThemeMock,
  agGridReactPropsCalls,
} = vi.hoisted(() => ({
  registerModulesMock: vi.fn(),
  getHistoryAuditRowHeightMock: vi.fn(() => 180),
  createHistoryAuditAgGridThemeMock: vi.fn(() => ({ themeName: 'mock-theme' })),
  agGridReactPropsCalls: [] as Array<Record<string, unknown>>,
}));

vi.mock('ag-grid-community', () => ({
  AllCommunityModule: { id: 'community' },
  ModuleRegistry: {
    registerModules: registerModulesMock,
  },
}));

vi.mock('ag-grid-enterprise', () => ({
  AllEnterpriseModule: { id: 'enterprise' },
}));

vi.mock('ag-grid-react', () => ({
  AgGridReact: (props: Record<string, unknown>) => {
    agGridReactPropsCalls.push(props);
    return <div data-testid="ag-grid-react-mock" />;
  },
}));

vi.mock('../../utils', () => ({
  createHistoryAuditAgGridTheme: createHistoryAuditAgGridThemeMock,
  getHistoryAuditRowHeight: getHistoryAuditRowHeightMock,
}));

import { HistoryAuditTrailTable } from '../HistoryAuditTrailTable';

describe('HistoryAuditTrailTable', () => {
  it('registers grid modules on import', () => {
    expect(registerModulesMock).toHaveBeenCalledTimes(1);
  });

  it('renders ag-grid with expected props and row-height callback', () => {
    const rowData: HistoryAuditTrailTableRow[] = [
      {
        id: '1',
        event: {
          id: '1',
          username: 'SYSTEM',
          auditEventType: 'OTHER',
          timestamp: '2026-01-01T00:00:00.000Z',
        },
        actor: 'System',
        action: 'Action',
        timeAgo: '1 minute ago',
        timestamp: 'Jan 01',
      },
    ];

    render(
      <HistoryAuditTrailTable
        rowData={rowData}
        columnDefs={[]}
        defaultColDef={{}}
        quickFilterText="abc"
        quickFilterParser={(value) => value.split(/\s+/)}
        loading={true}
        getRowId={(params) => params.data.id}
      />,
    );

    expect(screen.getByTestId('ag-grid-react-mock')).toBeTruthy();
    expect(createHistoryAuditAgGridThemeMock).toHaveBeenCalledTimes(1);

    const lastProps = agGridReactPropsCalls[agGridReactPropsCalls.length - 1];
    expect(lastProps).toBeTruthy();
    expect(lastProps.quickFilterText).toBe('abc');
    expect(lastProps.loading).toBe(true);

    const getRowHeight = lastProps.getRowHeight as (params: {
      data?: HistoryAuditTrailTableRow;
    }) => number;
    const computedHeight = getRowHeight({ data: rowData[0] });
    expect(computedHeight).toBe(180);
    expect(getHistoryAuditRowHeightMock).toHaveBeenCalledWith(rowData[0].event);
  });
});
