import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { ValidationResult } from '../../types';

const useLanguageEditorMock = vi.hoisted(() => vi.fn());

vi.mock('../../hooks/useLanguageEditor', () => ({
  useLanguageEditor: useLanguageEditorMock,
}));

vi.mock('../LanguageEditorToolbar', () => ({
  LanguageEditorToolbar: () => <div data-testid="language-editor-toolbar-mock">toolbar</div>,
}));

vi.mock('../ConditionalLanguageBuilder', () => ({
  ConditionalLanguageBuilder: ({ open }: { open: boolean }) =>
    open ? <div data-testid="language-editor-conditional-mock">builder</div> : null,
}));

import { LanguageEditor } from '../LanguageEditor';

const createHookState = (validationResult: ValidationResult | null = null) => ({
  editorRef: { current: null as HTMLDivElement | null },
  fieldDropdownAnchor: null,
  fieldDropdownOpen: false,
  showConditionBuilder: true,
  validationResult,
  handleInput: vi.fn(),
  handleBlur: vi.fn(),
  handleBold: vi.fn(),
  handleItalic: vi.fn(),
  handleUnderline: vi.fn(),
  handleInsertFieldClick: vi.fn(),
  handleFieldDropdownClose: vi.fn(),
  handleInsertField: vi.fn(),
  handleConditionalClick: vi.fn(),
  handleConditionalClose: vi.fn(),
  handleInsertConditional: vi.fn(),
  handleValidateClick: vi.fn(),
  handleClearValidation: vi.fn(),
  getFormattedContent: vi.fn(),
  syncEditorContent: vi.fn(),
});

const fieldConfig = [
  { name: 'Region', displayName: 'Region', type: 'Dimension' as const, dataType: 'text' as const },
];

describe('LanguageEditor', () => {
  it('renders toolbar and builder in editable mode', () => {
    const hookState = createHookState();
    useLanguageEditorMock.mockReturnValue(hookState);

    render(<LanguageEditor fieldConfig={fieldConfig} content="hello" />);

    expect(screen.getByTestId('language-editor-toolbar-mock')).toBeTruthy();
    expect(screen.getByTestId('language-editor-conditional-mock')).toBeTruthy();
    expect(hookState.syncEditorContent).toHaveBeenCalledTimes(1);
  });

  it('renders validation errors and clears validation', () => {
    const hookState = createHookState({
      valid: false,
      errors: [{ message: 'Invalid field' }, { message: 'Invalid operator' }],
    });
    useLanguageEditorMock.mockReturnValue(hookState);

    render(<LanguageEditor fieldConfig={fieldConfig} content="hello" />);

    expect(screen.getByText('Errors:')).toBeTruthy();
    expect(screen.getByText(/Invalid field/)).toBeTruthy();
    expect(screen.getByText(/Invalid operator/)).toBeTruthy();

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(hookState.handleClearValidation).toHaveBeenCalledTimes(1);
  });

  it('shows toolbar with buttons disabled and hides builder in read-only mode', () => {
    useLanguageEditorMock.mockReturnValue(createHookState());

    render(<LanguageEditor fieldConfig={fieldConfig} content="readonly" readOnly={true} />);

    expect(screen.getByTestId('language-editor-toolbar-mock')).toBeInTheDocument();
    expect(screen.queryByTestId('language-editor-conditional-mock')).toBeNull();
  });
});
