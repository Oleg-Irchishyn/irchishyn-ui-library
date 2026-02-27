import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { HistoryAuditExport } from '../HistoryAuditExport';

describe('HistoryAuditExport', () => {
  it('calls excel and csv export handlers from menu', () => {
    const onExportExcel = vi.fn();
    const onExportCsv = vi.fn();

    render(<HistoryAuditExport onExportExcel={onExportExcel} onExportCsv={onExportCsv} />);

    fireEvent.click(screen.getByTestId('history-audit-trail-export-button'));
    fireEvent.click(screen.getByText('Export to Excel'));
    expect(onExportExcel).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTestId('history-audit-trail-export-button'));
    fireEvent.click(screen.getByText('Export to CSV'));
    expect(onExportCsv).toHaveBeenCalledTimes(1);
  });

  it('renders export button', () => {
    render(<HistoryAuditExport />);
    expect(screen.getByRole('button', { name: 'Export' })).toBeTruthy();
  });
});
