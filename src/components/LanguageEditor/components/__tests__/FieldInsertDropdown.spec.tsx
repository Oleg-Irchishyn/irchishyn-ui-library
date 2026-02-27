import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { FieldInsertDropdown } from '../FieldInsertDropdown';

const fieldConfig = [
  { name: 'region', displayName: 'Region', type: 'Dimension' as const, dataType: 'text' as const },
  { name: 'amount', displayName: 'Amount', type: 'Measure' as const, dataType: 'number' as const },
];

describe('FieldInsertDropdown', () => {
  it('renders fields and inserts selected field', () => {
    const onInsertField = vi.fn();
    const onClose = vi.fn();

    render(
      <FieldInsertDropdown
        fieldConfig={fieldConfig}
        anchorEl={document.body}
        open={true}
        onClose={onClose}
        onInsertField={onInsertField}
      />,
    );

    expect(screen.getByText('<<region>>')).toBeTruthy();
    expect(screen.getByText('<<amount>>')).toBeTruthy();

    fireEvent.click(screen.getByText('<<amount>>'));
    expect(onInsertField).toHaveBeenCalledWith('amount');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('filters fields by search input and shows empty state', () => {
    render(
      <FieldInsertDropdown
        fieldConfig={fieldConfig}
        anchorEl={document.body}
        open={true}
        onClose={vi.fn()}
        onInsertField={vi.fn()}
      />,
    );

    const searchInput = screen.getByLabelText('Search fields...');
    fireEvent.change(searchInput, { target: { value: 'region' } });
    expect(screen.getByText('<<region>>')).toBeTruthy();
    expect(screen.queryByText('<<amount>>')).toBeNull();

    fireEvent.change(searchInput, { target: { value: 'missing' } });
    expect(screen.getByText('No fields found')).toBeTruthy();
  });

  it('closes and resets search value on escape', () => {
    const onClose = vi.fn();
    render(
      <FieldInsertDropdown
        fieldConfig={fieldConfig}
        anchorEl={document.body}
        open={true}
        onClose={onClose}
        onInsertField={vi.fn()}
      />,
    );

    const searchInput = screen.getByLabelText('Search fields...');
    fireEvent.change(searchInput, { target: { value: 'region' } });
    fireEvent.keyDown(searchInput, { key: 'Escape' });

    expect(onClose).toHaveBeenCalled();
  });
});
