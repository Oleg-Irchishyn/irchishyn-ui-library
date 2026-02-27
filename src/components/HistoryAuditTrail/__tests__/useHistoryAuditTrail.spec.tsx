import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { HISTORY_AUDIT_ALL_MODULES_VALUE, HISTORY_AUDIT_COLUMN_IDS } from '../constants';
import type { HistoryAuditTrailEvent } from '../types';
import { useHistoryAuditTrail } from '../useHistoryAuditTrail';

const events: HistoryAuditTrailEvent[] = [
  {
    id: 'evt-1',
    source: '/capevent/package/10001',
    username: 'SYSTEM',
    auditEventType: 'UPDATED',
    subject: 'Updated package',
    details: 'Package updated',
    oldValue: 'A',
    newValue: 'B',
    timestamp: '2026-01-03T00:00:00.000Z',
  },
  {
    id: 'evt-2',
    source: '/capevent/allocations/10001',
    username: 'john.doe',
    auditEventType: 'CREATED',
    subject: 'Created allocation',
    timestamp: '2026-01-02T00:00:00.000Z',
  },
];

describe('useHistoryAuditTrail', () => {
  it('builds row data and basic labels from events', () => {
    const { result } = renderHook(() =>
      useHistoryAuditTrail({
        events,
        countLabel: '2 events',
      }),
    );

    expect(result.current.rowData.length).toBe(2);
    expect(result.current.rowData[0].id).toBe('evt-1');
    expect(result.current.rowData[0].actor).toBe('System');
    expect(result.current.rowData[0].badge).toBe('System');
    expect(result.current.displayedCountLabel).toBe('2 events');
  });

  it('supports quick filtering and quoted parser tokens', () => {
    const { result } = renderHook(() =>
      useHistoryAuditTrail({
        events,
        countLabel: '2 events',
      }),
    );

    act(() => {
      result.current.setQuickFilterText('"Updated package"');
    });

    expect(result.current.quickFilterParser('"Updated package" test')).toEqual([
      'Updated package',
      'test',
    ]);
    expect(result.current.isSearchActive).toBe(true);
    expect(result.current.filteredRowCount).toBe(1);
    expect(result.current.displayedCountLabel).toBe('1 of 2 events');
  });

  it('creates module dropdown and filters by selected module', () => {
    const onModuleSourceChange = vi.fn();
    const { result } = renderHook(() =>
      useHistoryAuditTrail({
        events,
        countLabel: '2 events',
        moduleSources: ['/capevent/package/10001', '/capevent/allocations/10001'],
        primaryModuleSource: '/capevent/package/10001',
        onModuleSourceChange,
      }),
    );

    expect(result.current.moduleDropdown?.value).toBe(HISTORY_AUDIT_ALL_MODULES_VALUE);
    expect(result.current.moduleDropdown?.options.length).toBe(2);

    act(() => {
      result.current.moduleDropdown?.onValueChange('/capevent/allocations/10001');
    });

    expect(onModuleSourceChange).toHaveBeenCalledWith('/capevent/allocations/10001');
    expect(result.current.rowData.length).toBe(1);
    expect(result.current.rowData[0].id).toBe('evt-2');
  });

  it('exports excel/csv when enabled and grid api is ready', () => {
    const exportDataAsExcel = vi.fn();
    const exportDataAsCsv = vi.fn();

    const { result } = renderHook(() =>
      useHistoryAuditTrail({
        events,
        enableExport: true,
        exportFileName: 'audit-report',
      }),
    );

    act(() => {
      result.current.onGridReady({
        api: {
          exportDataAsExcel,
          exportDataAsCsv,
        },
      } as never);
    });

    act(() => {
      result.current.handleDownloadExcel();
      result.current.handleDownloadCsv();
    });

    expect(exportDataAsExcel).toHaveBeenCalledWith({ fileName: 'audit-report.xlsx' });
    expect(exportDataAsCsv).toHaveBeenCalledWith({ fileName: 'audit-report.csv' });
  });

  it('handles context menu exports and row click callback', () => {
    const onItemClick = vi.fn();
    const { result } = renderHook(() =>
      useHistoryAuditTrail({
        events,
        enableExport: true,
        exportFileName: 'audit-export',
        onItemClick,
      }),
    );

    const exportDataAsCsv = vi.fn();
    const exportDataAsExcel = vi.fn();
    const menuItems = result.current.getContextMenuItems({
      column: {
        getColId: () => HISTORY_AUDIT_COLUMN_IDS.ACTIVITY,
      },
      api: {
        exportDataAsCsv,
        exportDataAsExcel,
      },
    } as never);

    expect(Array.isArray(menuItems)).toBe(true);
    if (Array.isArray(menuItems)) {
      const exportGroup = menuItems[menuItems.length - 1];
      if (typeof exportGroup === 'object' && exportGroup && 'subMenu' in exportGroup) {
        const subMenu = exportGroup.subMenu;
        if (Array.isArray(subMenu)) {
          const csvItem = subMenu[0];
          const excelItem = subMenu[1];
          if (typeof csvItem === 'object' && csvItem && 'action' in csvItem) {
            csvItem.action?.({} as never);
          }
          if (typeof excelItem === 'object' && excelItem && 'action' in excelItem) {
            excelItem.action?.({} as never);
          }
        }
      }
    }

    expect(exportDataAsCsv).toHaveBeenCalledWith({ fileName: 'audit-export.csv' });
    expect(exportDataAsExcel).toHaveBeenCalledWith({ fileName: 'audit-export.xlsx' });

    act(() => {
      result.current.onRowClicked({
        data: { event: events[0] },
      } as never);
    });
    expect(onItemClick).toHaveBeenCalledWith(events[0]);
  });
});
