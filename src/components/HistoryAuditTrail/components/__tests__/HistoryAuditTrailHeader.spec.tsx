import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { HISTORY_AUDIT_RENDER_MODES } from '../../constants';
import { HistoryAuditTrailHeader } from '../HistoryAuditTrailHeader';

vi.mock('../HistoryAuditTrailSearch', () => ({
  HistoryAuditTrailSearch: ({ searchValue }: { searchValue?: string }) => (
    <div data-testid="history-audit-trail-search-mock">{searchValue ?? ''}</div>
  ),
}));

vi.mock('../HistoryAuditExport', () => ({
  HistoryAuditExport: () => <div data-testid="history-audit-export-mock">export</div>,
}));

vi.mock('../HistoryAudtitTrailModuleDropdown', () => ({
  HistoryAudtitTrailModuleDropdown: () => (
    <div data-testid="history-audit-module-dropdown-mock">module-dropdown</div>
  ),
}));

vi.mock('../HistoryAuditTrailIcons', () => ({
  CloseIcon: () => <span>close-icon</span>,
  HistoryIcon: () => <span>history-icon</span>,
}));

describe('HistoryAuditTrailHeader', () => {
  it('renders panel mode elements and handles clear action', () => {
    const onClear = vi.fn();

    render(
      <HistoryAuditTrailHeader
        renderMode={HISTORY_AUDIT_RENDER_MODES.PANEL}
        title="Audit Events"
        countLabel="3 events"
        onClear={onClear}
        moduleDropdown={{
          value: '__all_modules__',
          options: [],
          onValueChange: vi.fn(),
        }}
        search={{ searchValue: 'abc', onSearchValueChange: vi.fn() }}
        export={{ enableExport: true, onExportCsv: vi.fn(), onExportExcel: vi.fn() }}
      />,
    );

    expect(screen.getByText('Audit Events')).toBeTruthy();
    expect(screen.getByText('3 events')).toBeTruthy();
    expect(screen.getByTestId('history-audit-module-dropdown-mock')).toBeTruthy();
    expect(screen.getByTestId('history-audit-trail-search-mock')).toBeTruthy();
    expect(screen.getByTestId('history-audit-export-mock')).toBeTruthy();

    fireEvent.click(screen.getByLabelText('Close activity history'));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('does not render panel-specific controls in inline mode', () => {
    render(
      <HistoryAuditTrailHeader
        renderMode={HISTORY_AUDIT_RENDER_MODES.INLINE}
        title="Audit Events"
        search={{ searchValue: '', onSearchValueChange: vi.fn() }}
        export={{ enableExport: false }}
      />,
    );

    expect(screen.queryByText('Audit Events')).toBeNull();
    expect(screen.queryByLabelText('Close activity history')).toBeNull();
    expect(screen.queryByTestId('history-audit-export-mock')).toBeNull();
    expect(screen.getByTestId('history-audit-trail-search-mock')).toBeTruthy();
  });
});
