import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { HistoryAuditTrailTableRow } from '../../types';

const { registerModulesMock, createHistoryAuditAgGridThemeMock, agGridReactPropsCalls } =
  vi.hoisted(() => ({
    registerModulesMock: vi.fn(),
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
}));

import { HistoryAuditTrailTable } from '../HistoryAuditTrailTable';

describe('HistoryAuditTrailTable', () => {
  it('registers grid modules on import', () => {
    expect(registerModulesMock).toHaveBeenCalledTimes(1);
  });

  it('renders ag-grid with expected props and no manual row-height callback', () => {
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
    expect(lastProps.popupParent).toBe(document.body);
    expect(lastProps.getRowHeight).toBeUndefined();
  });
});
