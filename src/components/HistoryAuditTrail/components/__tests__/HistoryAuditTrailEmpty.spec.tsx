import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { HistoryAuditTrailEmpty } from '../HistoryAuditTrailEmpty';

describe('HistoryAuditTrailEmpty', () => {
  it('renders default message', () => {
    render(<HistoryAuditTrailEmpty />);
    expect(screen.getByTestId('history-audit-trail-empty-message').textContent).toBe(
      'No activity yet.',
    );
  });

  it('renders custom message', () => {
    render(<HistoryAuditTrailEmpty message="No records found" />);
    expect(screen.getByText('No records found')).toBeTruthy();
  });
});
