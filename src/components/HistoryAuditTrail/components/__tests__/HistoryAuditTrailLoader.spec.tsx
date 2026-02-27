import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { HistoryAuditTrailLoader } from '../HistoryAuditTrailLoader';

describe('HistoryAuditTrailLoader', () => {
  it('renders default loader label', () => {
    render(<HistoryAuditTrailLoader />);
    expect(screen.getByTestId('history-audit-trail-loader')).toBeTruthy();
    expect(screen.getByText('Loading…')).toBeTruthy();
  });

  it('renders custom loader label', () => {
    render(<HistoryAuditTrailLoader label="Fetching history" />);
    expect(screen.getByText('Fetching history')).toBeTruthy();
  });
});
