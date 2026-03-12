import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { LanguageEditorToolbar } from '../LanguageEditorToolbar';

vi.mock('../FieldInsertDropdown', () => ({
  FieldInsertDropdown: () => <div data-testid="field-dropdown-mock">dropdown</div>,
}));

const props = {
  onBold: vi.fn(),
  onItalic: vi.fn(),
  onUnderline: vi.fn(),
  onInsertFieldMouseDown: vi.fn(),
  onInsertFieldClick: vi.fn(),
  onConditionalClick: vi.fn(),
  onValidateClick: vi.fn(),
  fieldDropdownAnchor: null,
  fieldDropdownOpen: false,
  onFieldDropdownClose: vi.fn(),
  onInsertField: vi.fn(),
  fieldConfig: [
    {
      name: 'Region',
      displayName: 'Region',
      type: 'Dimension' as const,
      dataType: 'text' as const,
    },
  ],
  validationResult: null,
  disabled: false,
};

describe('LanguageEditorToolbar', () => {
  it('renders action buttons and triggers callbacks', { timeout: 15000 }, () => {
    render(<LanguageEditorToolbar {...props} />);

    expect(screen.getByTestId('field-dropdown-mock')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Insert Field' }));
    fireEvent.click(screen.getByRole('button', { name: 'Conditional Language Builder' }));
    fireEvent.click(screen.getByRole('button', { name: 'Validate' }));

    expect(props.onInsertFieldClick).toHaveBeenCalledTimes(1);
    expect(props.onConditionalClick).toHaveBeenCalledTimes(1);
    expect(props.onValidateClick).toHaveBeenCalledTimes(1);

    const iconButtons = screen
      .getAllByRole('button')
      .filter((btn) => btn.getAttribute('aria-label') === null);
    fireEvent.click(iconButtons[0]);
    fireEvent.click(iconButtons[1]);
    fireEvent.click(iconButtons[2]);
    expect(props.onBold).toHaveBeenCalledTimes(1);
    expect(props.onItalic).toHaveBeenCalledTimes(1);
    expect(props.onUnderline).toHaveBeenCalledTimes(1);
  });

  it('disables interactive controls when disabled is true', () => {
    render(<LanguageEditorToolbar {...props} disabled={true} />);

    expect(
      screen.getByRole('button', { name: 'Insert Field' }).getAttribute('disabled'),
    ).not.toBeNull();
    expect(
      screen.getByRole('button', { name: 'Conditional Language Builder' }).getAttribute('disabled'),
    ).not.toBeNull();
    expect(
      screen.getByRole('button', { name: 'Validate' }).getAttribute('disabled'),
    ).not.toBeNull();
  });

  it('uses success color for validate button when validation passed', () => {
    render(<LanguageEditorToolbar {...props} validationResult={{ valid: true }} />);
    const validateBtn = screen.getByRole('button', { name: 'Validate' });
    expect((validateBtn.className ?? '').includes('MuiButton-colorSuccess')).toBe(true);
  });

  it('uses error color for validate button when validation failed', () => {
    render(
      <LanguageEditorToolbar
        {...props}
        validationResult={{ valid: false, errors: [{ message: 'bad syntax' }] }}
      />,
    );
    const validateBtn = screen.getByRole('button', { name: 'Validate' });
    expect((validateBtn.className ?? '').includes('MuiButton-colorError')).toBe(true);
  });
});
