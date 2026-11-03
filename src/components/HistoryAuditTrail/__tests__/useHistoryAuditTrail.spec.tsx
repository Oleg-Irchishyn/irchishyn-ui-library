import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  HISTORY_AUDIT_ALL_MODULES_VALUE,
  HISTORY_AUDIT_COLUMN_IDS,
  HISTORY_AUDIT_LABELS,
} from '../constants';
import type { HistoryAuditTrailEvent } from '../types';
import { useHistoryAuditTrail } from '../useHistoryAuditTrail';

const EVENT_1_DETAILS_TEXT = 'Package updated';
const REGEX_SPECIAL_CHARS_PATTERN = /[.*+?^${}()|[\]\\]/g;
const REGEX_ESCAPE_REPLACEMENT = '\\$&';

const events: HistoryAuditTrailEvent[] = [
  {
    id: 'evt-1',
    source: '/capevent/package/10001',
    username: 'SYSTEM',
    auditEventType: 'UPDATED',
    subject: 'Updated package',
    details: EVENT_1_DETAILS_TEXT,
    oldValue: 'A',
    newValue: 'B',
    timestamp: '2026-01-03T00:00:00.000Z',
  },
  {
    id: 'evt-2',
    source: '/capevent/allocations/10001',
    username: 'john.doe',
    createdBy: 'john.doe@example.com',
    auditEventType: 'CREATED',
    subject: 'Created allocation',
    timestamp: '2026-01-02T00:00:00.000Z',
  },
];

const escapeRegExp = (value: string) =>
  value.replace(REGEX_SPECIAL_CHARS_PATTERN, REGEX_ESCAPE_REPLACEMENT);

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

    act(() => {
      result.current.setQuickFilterText('john.doe@example.com');
    });
    expect(result.current.filteredRowCount).toBe(1);
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

  it('uses moduleFilterCallback and exposes undefined count label when no countLabel is provided', () => {
    const moduleFilterCallback = vi.fn((event, selectedSource) => event.source !== selectedSource);

    const { result } = renderHook(() =>
      useHistoryAuditTrail({
        events,
        moduleSources: ['/capevent/package/10001', '/capevent/allocations/10001'],
        primaryModuleSource: '/capevent/package/10001',
        moduleFilterCallback,
      }),
    );

    act(() => {
      result.current.moduleDropdown?.onValueChange('/capevent/package/10001');
    });

    expect(moduleFilterCallback).toHaveBeenCalled();
    expect(result.current.displayedCountLabel).toBeUndefined();
  });

  it('resets selected module to all when selected source disappears', () => {
    const initialEvents: HistoryAuditTrailEvent[] = [
      {
        id: 'a',
        source: '/source/a',
        username: 'u1',
        auditEventType: 'UPDATED',
        subject: 'A',
        timestamp: '2026-01-03T00:00:00.000Z',
      },
      {
        id: 'b',
        source: '/source/b',
        username: 'u2',
        auditEventType: 'UPDATED',
        subject: 'B',
        timestamp: '2026-01-02T00:00:00.000Z',
      },
    ];
    const nextEvents: HistoryAuditTrailEvent[] = [
      {
        id: 'c',
        source: '/source/c',
        username: 'u3',
        auditEventType: 'UPDATED',
        subject: 'C',
        timestamp: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'd',
        source: '/source/d',
        username: 'u4',
        auditEventType: 'UPDATED',
        subject: 'D',
        timestamp: '2025-12-31T00:00:00.000Z',
      },
    ];

    const { result, rerender } = renderHook(
      ({ inputEvents }) =>
        useHistoryAuditTrail({
          events: inputEvents,
          moduleSources: ['/source/a', '/source/b', '/source/c', '/source/d'],
        }),
      { initialProps: { inputEvents: initialEvents } },
    );

    act(() => {
      result.current.moduleDropdown?.onValueChange('/source/b');
    });
    expect(result.current.moduleDropdown?.value).toBe('/source/b');

    rerender({ inputEvents: nextEvents });
    expect(result.current.moduleDropdown?.value).toBe(HISTORY_AUDIT_ALL_MODULES_VALUE);
  });

  it('does not export when export is disabled and returns base context menu for unknown column', () => {
    const exportDataAsExcel = vi.fn();
    const exportDataAsCsv = vi.fn();

    const { result } = renderHook(() =>
      useHistoryAuditTrail({
        events,
        enableExport: false,
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

    expect(exportDataAsExcel).not.toHaveBeenCalled();
    expect(exportDataAsCsv).not.toHaveBeenCalled();

    const menuItems = result.current.getContextMenuItems({
      column: { getColId: () => 'unknown' },
      api: { exportDataAsCsv, exportDataAsExcel },
    } as never);
    expect(menuItems).toEqual(['cut', 'copy', 'copyWithHeaders', 'copyWithGroupHeaders', 'paste']);
  });

  it('covers getRowId and ignores row click without callback', () => {
    const { result } = renderHook(() =>
      useHistoryAuditTrail({
        events,
      }),
    );

    expect(
      result.current.getRowId({
        data: { id: 'row-42' },
      } as never),
    ).toBe('row-42');

    expect(() =>
      result.current.onRowClicked({
        data: { event: events[0] },
      } as never),
    ).not.toThrow();
  });

  it('activity column has autoHeight and wrapText enabled', () => {
    const { result } = renderHook(() =>
      useHistoryAuditTrail({
        events,
      }),
    );

    const activityColumn = result.current.columnDefs.find(
      (col) => col.colId === HISTORY_AUDIT_COLUMN_IDS.ACTIVITY,
    );

    expect(activityColumn?.autoHeight).toBe(true);
    expect(activityColumn?.wrapText).toBe(true);
  });

  it('exports details once in activity export text', () => {
    const { result } = renderHook(() =>
      useHistoryAuditTrail({
        events,
      }),
    );

    const activityColumn = result.current.columnDefs.find(
      (col) => col.colId === HISTORY_AUDIT_COLUMN_IDS.ACTIVITY,
    );
    const row = result.current.rowData[0];
    expect(typeof activityColumn?.valueGetter).toBe('function');
    const exportText =
      typeof activityColumn?.valueGetter === 'function'
        ? String(activityColumn.valueGetter({ data: row } as never))
        : '';

    expect(exportText).toContain(EVENT_1_DETAILS_TEXT);

    const detailMatches = exportText.match(new RegExp(escapeRegExp(EVENT_1_DETAILS_TEXT), 'g'));
    expect(detailMatches ?? []).toHaveLength(1);
  });

  it('does not duplicate old/new values in export text when derived from fieldChanges', () => {
    const fieldChangeEvents: HistoryAuditTrailEvent[] = [
      {
        id: 'evt-fc-1',
        source: '/capevent/package/10001',
        username: 'alice',
        auditEventType: 'UPDATED',
        subject: 'Updated status',
        fieldChanges: [{ fieldName: 'Status', oldValue: 'Draft', newValue: 'Ready' }],
        timestamp: '2026-01-03T00:00:00.000Z',
      },
      {
        id: 'evt-fc-2',
        source: '/capevent/package/10001',
        username: 'bob',
        auditEventType: 'UPDATED',
        subject: 'Updated multiple fields',
        fieldChanges: [
          { fieldName: 'Status', oldValue: 'Draft', newValue: 'Ready' },
          { fieldName: 'Due Date', oldValue: '01/01/2026', newValue: '01/02/2026' },
        ],
        timestamp: '2026-01-02T00:00:00.000Z',
      },
    ];

    const { result } = renderHook(() => useHistoryAuditTrail({ events: fieldChangeEvents }));

    const activityColumn = result.current.columnDefs.find(
      (col) => col.colId === HISTORY_AUDIT_COLUMN_IDS.ACTIVITY,
    );
    expect(typeof activityColumn?.valueGetter).toBe('function');

    // Single fieldChange: "Draft -> Ready" must appear exactly once
    const row1 = result.current.rowData.find((r) => r.id === 'evt-fc-1')!;
    const exportText1 =
      typeof activityColumn?.valueGetter === 'function'
        ? String(activityColumn.valueGetter({ data: row1 } as never))
        : '';
    const draftReadyMatches = exportText1.match(/Draft.*?Ready/g);
    expect(draftReadyMatches ?? []).toHaveLength(1);

    // Multiple fieldChanges: each pair must appear exactly once
    const row2 = result.current.rowData.find((r) => r.id === 'evt-fc-2')!;
    const exportText2 =
      typeof activityColumn?.valueGetter === 'function'
        ? String(activityColumn.valueGetter({ data: row2 } as never))
        : '';
    const statusMatches = exportText2.match(/Draft.*?Ready/g);
    const dateMatches = exportText2.match(new RegExp(escapeRegExp('01/01/2026'), 'g'));
    expect(statusMatches ?? []).toHaveLength(1);
    expect(dateMatches ?? []).toHaveLength(1);
  });

  it('includes direct oldValue/newValue in export text when event has no fieldChanges', () => {
    const directChangeEvents: HistoryAuditTrailEvent[] = [
      {
        id: 'evt-direct-1',
        source: '/capevent/package/10001',
        username: 'alice',
        auditEventType: 'UPDATED',
        subject: 'Updated value',
        oldValue: 'OldVal',
        newValue: 'NewVal',
        timestamp: '2026-01-03T00:00:00.000Z',
      },
    ];

    const { result } = renderHook(() => useHistoryAuditTrail({ events: directChangeEvents }));

    const activityColumn = result.current.columnDefs.find(
      (col) => col.colId === HISTORY_AUDIT_COLUMN_IDS.ACTIVITY,
    );
    const row = result.current.rowData[0];
    const exportText =
      typeof activityColumn?.valueGetter === 'function'
        ? String(activityColumn.valueGetter({ data: row } as never))
        : '';

    expect(exportText).toContain('OldVal');
    expect(exportText).toContain('NewVal');
    const matches = exportText.match(/OldVal.*?NewVal/g);
    expect(matches ?? []).toHaveLength(1);
  });

  it('uses fallback labels and timestamp handling for invalid timestamp events', () => {
    const invalidTimestampEvents: HistoryAuditTrailEvent[] = [
      {
        id: 'invalid-a',
        source: '/source/invalid-a',
        username: 'alice',
        auditEventType: 'UPDATED',
        subject: null,
        details: null,
        fieldChanges: [
          { fieldName: 'Status', oldValue: 'Draft', newValue: 'Ready' },
          { fieldName: 'Due Date', oldValue: '01/01/2026', newValue: '01/02/2026' },
        ],
        timestamp: 'not-a-date',
      },
      {
        id: 'valid-b',
        source: '/source/valid-b',
        username: 'bob',
        auditEventType: 'UPDATED',
        subject: 'Valid Event',
        timestamp: '2026-01-03T00:00:00.000Z',
      },
      {
        id: 'invalid-c',
        source: '/source/invalid-c',
        username: 'cathy',
        auditEventType: 'UPDATED',
        subject: 'Also invalid',
        timestamp: 'still-not-a-date',
      },
    ];

    const { result } = renderHook(() =>
      useHistoryAuditTrail({
        events: invalidTimestampEvents,
      }),
    );

    expect(result.current.rowData[0].id).toBe('valid-b');

    const invalidRow = result.current.rowData.find((row) => row.id === 'invalid-a');
    expect(invalidRow?.action).toBe(HISTORY_AUDIT_LABELS.DEFAULT_ACTION);
    expect(invalidRow?.details).toBe('2 fields changed');
    expect(invalidRow?.timeAgo).toBe(HISTORY_AUDIT_LABELS.UNKNOWN_TIME);
    expect(invalidRow?.timestamp).toBe('not-a-date');
  });

  it('falls back to event sources when configured moduleSources do not match any event', () => {
    const sourceEvents: HistoryAuditTrailEvent[] = [
      {
        id: 'evt-source-a',
        source: '/capevent/allocations/10001',
        username: 'alice',
        auditEventType: 'UPDATED',
        subject: 'A',
        timestamp: '2026-01-03T00:00:00.000Z',
      },
      {
        id: 'evt-source-b',
        source: '/capevent/package/10001',
        username: 'bob',
        auditEventType: 'UPDATED',
        subject: 'B',
        timestamp: '2026-01-02T00:00:00.000Z',
      },
    ];

    const { result } = renderHook(() =>
      useHistoryAuditTrail({
        events: sourceEvents,
        moduleSources: ['/capevent/non-existent/99999'],
      }),
    );

    const optionValues = result.current.moduleDropdown?.options.map((option) => option.value) ?? [];
    expect(optionValues).toEqual(['/capevent/allocations/10001', '/capevent/package/10001']);
  });

  it('returns empty strings from valueGetter and quickFilter text getters when row data is missing', () => {
    const { result } = renderHook(() =>
      useHistoryAuditTrail({
        events,
      }),
    );

    const activityColumn = result.current.columnDefs.find(
      (col) => col.colId === HISTORY_AUDIT_COLUMN_IDS.ACTIVITY,
    );
    const timeColumn = result.current.columnDefs.find(
      (col) => col.colId === HISTORY_AUDIT_COLUMN_IDS.TIME,
    );

    expect(
      typeof activityColumn?.valueGetter === 'function'
        ? activityColumn.valueGetter({ data: undefined } as never)
        : '',
    ).toBe('');
    expect(activityColumn?.getQuickFilterText?.({ data: undefined } as never)).toBe('');
    expect(
      typeof timeColumn?.valueGetter === 'function'
        ? timeColumn.valueGetter({ data: undefined } as never)
        : '',
    ).toBe('');
    expect(timeColumn?.getQuickFilterText?.({ data: undefined } as never)).toBe('');
  });

  it('calls onClear callback when handleClear is invoked', () => {
    const onClear = vi.fn();
    const { result } = renderHook(() =>
      useHistoryAuditTrail({
        events,
        onClear,
      }),
    );

    act(() => {
      result.current.handleClear();
    });

    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
