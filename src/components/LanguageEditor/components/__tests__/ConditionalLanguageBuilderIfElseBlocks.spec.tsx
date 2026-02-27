import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ConditionalLanguageBuilderElseBlock } from '../ConditionalLanguageBuilderElseBlock';
import { ConditionalLanguageBuilderElseIfBlock } from '../ConditionalLanguageBuilderElseIfBlock';
import { ConditionalLanguageBuilderIfBlock } from '../ConditionalLanguageBuilderIfBlock';

vi.mock('../ConditionalLanguageBuilderClauseRow', () => ({
  ConditionalLanguageBuilderClauseRow: () => <div data-testid="clause-row-mock">clause-row</div>,
}));

const clause = {
  fieldName: 'Region',
  operatorKey: 'equals',
  value: 'EMEA',
  content: 'initial content',
};

const fieldConfig = [
  { name: 'Region', displayName: 'Region', type: 'Dimension' as const, dataType: 'text' as const },
];

describe('ConditionalLanguageBuilder blocks', () => {
  it('renders IF block and updates content', () => {
    const onClauseChange = vi.fn();
    render(
      <ConditionalLanguageBuilderIfBlock
        clause={clause}
        onClauseChange={onClauseChange}
        fieldConfig={fieldConfig}
      />,
    );

    expect(screen.getByText('IF')).toBeTruthy();
    expect(screen.getByTestId('clause-row-mock')).toBeTruthy();

    const input = screen.getByDisplayValue('initial content');
    fireEvent.change(input, { target: { value: 'updated if content' } });
    expect(onClauseChange).toHaveBeenCalledWith({ ...clause, content: 'updated if content' });
  });

  it('renders ELSE IF block and supports remove + content change', () => {
    const onClauseChange = vi.fn();
    const onRemove = vi.fn();
    render(
      <ConditionalLanguageBuilderElseIfBlock
        clause={clause}
        onClauseChange={onClauseChange}
        fieldConfig={fieldConfig}
        onRemove={onRemove}
      />,
    );

    expect(screen.getByText('ELSE IF')).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Remove else if'));
    expect(onRemove).toHaveBeenCalledTimes(1);

    const input = screen.getByDisplayValue('initial content');
    fireEvent.change(input, { target: { value: 'updated else-if content' } });
    expect(onClauseChange).toHaveBeenCalledWith({ ...clause, content: 'updated else-if content' });
  });

  it('renders ELSE block and updates content', () => {
    const onContentChange = vi.fn();
    render(
      <ConditionalLanguageBuilderElseBlock
        content="else content"
        onContentChange={onContentChange}
      />,
    );

    expect(screen.getByText(/Default content/)).toBeTruthy();
    fireEvent.change(screen.getByDisplayValue('else content'), {
      target: { value: 'updated else content' },
    });
    expect(onContentChange).toHaveBeenCalledWith('updated else content');
  });
});
