import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { HistoryAuditTrailError } from '../HistoryAuditTrailError';

describe('HistoryAuditTrailError', () => {
  it('renders default error message', () => {
    render(<HistoryAuditTrailError />);
    expect(screen.getByTestId('history-audit-trail-error-message').textContent).toBe(
      'Error: Failed to load activity history.',
    );
  });

  it('renders custom error message', () => {
    render(<HistoryAuditTrailError message="Error: Audit Trail request failed (401)" />);
    expect(screen.getByText('Error: Audit Trail request failed (401)')).toBeTruthy();
  });
});
