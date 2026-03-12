import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const useConditionalLanguageBuilderMock = vi.hoisted(() => vi.fn());

vi.mock('../../useConditionalLanguageBuilder', () => ({
  useConditionalLanguageBuilder: useConditionalLanguageBuilderMock,
}));

vi.mock('../ConditionalLanguageBuilderIfBlock', () => ({
  ConditionalLanguageBuilderIfBlock: () => <div data-testid="if-block-mock">if-block</div>,
}));
vi.mock('../ConditionalLanguageBuilderElseIfBlock', () => ({
  ConditionalLanguageBuilderElseIfBlock: ({
    onClauseChange,
    onRemove,
  }: {
    onClauseChange: (clause: {
      fieldName: string;
      operatorKey: string;
      value: string;
      content: string;
    }) => void;
    onRemove: () => void;
  }) => (
    <div data-testid="else-if-block-mock">
      else-if-block
      <button
        type="button"
        onClick={() =>
          onClauseChange({
            fieldName: 'Region',
            operatorKey: 'equals',
            value: 'EU',
            content: 'changed',
          })
        }
      >
        change-else-if
      </button>
      <button type="button" onClick={onRemove}>
        remove-else-if
      </button>
    </div>
  ),
}));
vi.mock('../ConditionalLanguageBuilderElseBlock', () => ({
  ConditionalLanguageBuilderElseBlock: () => <div data-testid="else-block-mock">else-block</div>,
}));

import { ConditionalLanguageBuilder } from '../ConditionalLanguageBuilder';

const hookState = {
  ifClause: { fieldName: 'Region', operatorKey: 'equals', value: 'EMEA', content: 'if content' },
  setIfClause: vi.fn(),
  elseIfClauses: [{ fieldName: 'Amount', operatorKey: 'greaterThan', value: '10', content: 'x' }],
  includeElse: false,
  setIncludeElse: vi.fn(),
  elseContent: 'fallback',
  setElseContent: vi.fn(),
  handleClose: vi.fn(),
  handleInsert: vi.fn(),
  addElseIf: vi.fn(),
  removeElseIf: vi.fn(),
  updateElseIf: vi.fn(),
  canInsert: true,
  validationResult: null,
  handleValidateClick: vi.fn(),
  handleClearValidation: vi.fn(),
};

describe('ConditionalLanguageBuilder', () => {
  it('renders builder and triggers actions', { timeout: 15000 }, () => {
    useConditionalLanguageBuilderMock.mockReturnValue(hookState);

    render(
      <ConditionalLanguageBuilder
        open={true}
        onClose={vi.fn()}
        fieldConfig={[]}
        onInsertConditional={vi.fn()}
      />,
    );

    expect(screen.getByText('Conditional Language Builder')).toBeTruthy();
    expect(screen.getByTestId('if-block-mock')).toBeTruthy();
    expect(screen.getByTestId('else-if-block-mock')).toBeTruthy();
    expect(screen.getByTestId('else-block-mock')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Add Another Condition (Else If)' }));
    fireEvent.click(screen.getByRole('button', { name: 'change-else-if' }));
    fireEvent.click(screen.getByRole('button', { name: 'remove-else-if' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    fireEvent.click(screen.getByRole('button', { name: 'Insert Language' }));

    expect(hookState.addElseIf).toHaveBeenCalledTimes(1);
    expect(hookState.updateElseIf).toHaveBeenCalledWith(0, {
      fieldName: 'Region',
      operatorKey: 'equals',
      value: 'EU',
      content: 'changed',
    });
    expect(hookState.removeElseIf).toHaveBeenCalledWith(0);
    expect(hookState.handleClose).toHaveBeenCalledTimes(1);
    expect(hookState.handleInsert).toHaveBeenCalledTimes(1);
  });

  it('disables insert button when insertion is not allowed', () => {
    useConditionalLanguageBuilderMock.mockReturnValue({ ...hookState, canInsert: false });

    render(
      <ConditionalLanguageBuilder
        open={true}
        onClose={vi.fn()}
        fieldConfig={[]}
        onInsertConditional={vi.fn()}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Insert Language' }).getAttribute('disabled'),
    ).not.toBeNull();
  });

  it('renders validation error banner and allows clearing it', () => {
    useConditionalLanguageBuilderMock.mockReturnValue({
      ...hookState,
      validationResult: {
        valid: false,
        errors: [{ message: 'Mock validation error' }],
      },
    });

    render(
      <ConditionalLanguageBuilder
        open={true}
        onClose={vi.fn()}
        fieldConfig={[]}
        onInsertConditional={vi.fn()}
      />,
    );

    expect(screen.getByText('Errors:')).toBeTruthy();
    expect(screen.getByText('• Mock validation error')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Validate' }));
    expect(hookState.handleValidateClick).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'Clear validation' }));
    expect(hookState.handleClearValidation).toHaveBeenCalledTimes(1);
  });
});
