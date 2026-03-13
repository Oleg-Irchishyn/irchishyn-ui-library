import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { ICellRendererParams } from 'ag-grid-community';

import type { HistoryAuditTrailTableRow } from '../../../types';
import { HistoryAuditTimestampColumn } from '../HistoryAuditTimestampColumn';

describe('HistoryAuditTimestampColumn', () => {
  it('returns null when no row data is provided', () => {
    const params = { data: undefined } as unknown as ICellRendererParams<HistoryAuditTrailTableRow>;
    const { container } = render(<HistoryAuditTimestampColumn {...params} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders relative and absolute timestamps when data exists', () => {
    const params = {
      data: {
        id: 'row-1',
        event: {
          id: 'evt-1',
          username: 'SYSTEM',
          auditEventType: 'OTHER',
          timestamp: '2026-01-01T00:00:00.000Z',
        },
        actor: 'System',
        action: 'Updated',
        timeAgo: '2 hours ago',
        timestamp: 'Jan 01, 10:00 AM',
      },
    } as unknown as ICellRendererParams<HistoryAuditTrailTableRow>;

    const { container } = render(<HistoryAuditTimestampColumn {...params} />);

    expect(screen.getByText('2 hours ago')).toBeTruthy();
    expect(screen.getByText('Jan 01, 10:00 AM')).toBeTruthy();
    expect(container.querySelector('svg')).toBeTruthy();
  });
});
