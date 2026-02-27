import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { HistoryAuditTrailSearch } from '../HistoryAuditTrailSearch';

describe('HistoryAuditTrailSearch', () => {
  it('renders with provided value and emits changes', () => {
    const onSearchValueChange = vi.fn();

    render(
      <HistoryAuditTrailSearch
        searchValue="initial value"
        onSearchValueChange={onSearchValueChange}
      />,
    );

    const input = screen.getByLabelText('Search activity history');
    expect((input as HTMLInputElement).value).toBe('initial value');

    fireEvent.change(input, { target: { value: 'updated value' } });
    expect(onSearchValueChange).toHaveBeenCalledWith('updated value');
  });

  it('renders with default empty value', () => {
    render(<HistoryAuditTrailSearch />);
    expect((screen.getByLabelText('Search activity history') as HTMLInputElement).value).toBe('');
  });
});
