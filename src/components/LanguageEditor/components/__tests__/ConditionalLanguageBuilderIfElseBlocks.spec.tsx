import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ConditionalLanguageBuilderElseBlock } from '../ConditionalLanguageBuilderElseBlock';
import { ConditionalLanguageBuilderElseIfBlock } from '../ConditionalLanguageBuilderElseIfBlock';
import { ConditionalLanguageBuilderIfBlock } from '../ConditionalLanguageBuilderIfBlock';

vi.mock('../ConditionalLanguageBuilderClauseRow', () => ({
  ConditionalLanguageBuilderClauseRow: () => <div data-testid="clause-row-mock">clause-row</div>,
}));

vi.mock('../LanguageEditor', () => ({
  LanguageEditor: ({
    content,
    onChange,
  }: {
    content: string;
    onChange: (value: string) => void;
  }) => (
    <input
      data-testid="language-editor-mock"
      value={content}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Content"
    />
  ),
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

    const input = screen.getByTestId('language-editor-mock');
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

    const input = screen.getByTestId('language-editor-mock');
    fireEvent.change(input, { target: { value: 'updated else-if content' } });
    expect(onClauseChange).toHaveBeenCalledWith({ ...clause, content: 'updated else-if content' });
  });

  it('renders ELSE block with Enabled/Disabled button and updates content when enabled', () => {
    const onContentChange = vi.fn();
    const onIncludeElseChange = vi.fn();
    const { rerender } = render(
      <ConditionalLanguageBuilderElseBlock
        includeElse={false}
        onIncludeElseChange={onIncludeElseChange}
        content="else content"
        onContentChange={onContentChange}
        fieldConfig={fieldConfig}
      />,
    );

    expect(screen.getByText(/Default content/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Disabled' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Disabled' }));
    expect(onIncludeElseChange).toHaveBeenCalledWith(true);

    rerender(
      <ConditionalLanguageBuilderElseBlock
        includeElse
        onIncludeElseChange={onIncludeElseChange}
        content="else content"
        onContentChange={onContentChange}
        fieldConfig={fieldConfig}
      />,
    );

    expect(screen.getByRole('button', { name: 'Enabled' })).toBeTruthy();
    const input = screen.getByTestId('language-editor-mock');
    fireEvent.change(input, { target: { value: 'updated else content' } });
    expect(onContentChange).toHaveBeenCalledWith('updated else content');
  });
});
