import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ConditionalLanguageBuilderClauseRow } from '../ConditionalLanguageBuilderClauseRow';

vi.mock('../ConditionalLanguageBuilderValueInput', () => ({
  ConditionalLanguageBuilderValueInput: ({
    placeholder,
    dataType,
    onChange,
  }: {
    placeholder?: string;
    dataType: string;
    onChange: (value: string) => void;
  }) => (
    <button type="button" data-testid="value-input-mock" onClick={() => onChange('changed')}>
      {`${dataType}:${placeholder ?? ''}`}
    </button>
  ),
}));

const fieldConfig = [
  { name: 'Region', displayName: 'Region', type: 'Dimension' as const, dataType: 'text' as const },
  { name: 'Amount', displayName: 'Amount', type: 'Measure' as const, dataType: 'number' as const },
  {
    name: 'IS_CAPITAL_CALL',
    displayName: 'Is Capital Call',
    type: 'Boolean' as const,
    dataType: 'boolean' as const,
  },
];

describe('ConditionalLanguageBuilderClauseRow', () => {
  it('renders single value input for regular operators', () => {
    const onChange = vi.fn();
    render(
      <ConditionalLanguageBuilderClauseRow
        clause={{ fieldName: 'Region', operatorKey: 'EQUALS', value: 'EMEA', content: 'text' }}
        onChange={onChange}
        fieldConfig={fieldConfig}
      />,
    );

    expect(screen.getAllByTestId('value-input-mock').length).toBe(1);
    fireEvent.click(screen.getAllByTestId('value-input-mock')[0]);
    expect(onChange).toHaveBeenCalledWith({
      fieldName: 'Region',
      operatorKey: 'EQUALS',
      value: 'changed',
      content: 'text',
    });
  });

  it('renders two value inputs for IS_BETWEEN and remove button when enabled', () => {
    const onRemove = vi.fn();
    const onChange = vi.fn();
    render(
      <ConditionalLanguageBuilderClauseRow
        clause={{
          fieldName: 'Amount',
          operatorKey: 'IS_BETWEEN',
          value: '10',
          value2: '20',
          content: 'text',
        }}
        onChange={onChange}
        fieldConfig={fieldConfig}
        onRemove={onRemove}
        showRemove
      />,
    );

    expect(screen.getAllByTestId('value-input-mock').length).toBe(2);
    fireEvent.click(screen.getAllByTestId('value-input-mock')[0]);
    fireEvent.click(screen.getAllByTestId('value-input-mock')[1]);
    expect(onChange).toHaveBeenCalled();
    fireEvent.click(screen.getByLabelText('Remove condition'));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('hides value input for value-less operators', () => {
    const onChange = vi.fn();
    render(
      <ConditionalLanguageBuilderClauseRow
        clause={{ fieldName: 'Region', operatorKey: 'IS_EMPTY', value: '', content: '' }}
        onChange={onChange}
        fieldConfig={fieldConfig}
      />,
    );

    expect(screen.queryByTestId('value-input-mock')).toBeNull();
  });

  it('hides value input for boolean field (e.g. IS_CAPITAL_CALL) even when operator not yet selected', () => {
    const onChange = vi.fn();
    render(
      <ConditionalLanguageBuilderClauseRow
        clause={{ fieldName: 'IS_CAPITAL_CALL', operatorKey: '', value: '', content: '' }}
        onChange={onChange}
        fieldConfig={fieldConfig}
      />,
    );

    expect(screen.queryByTestId('value-input-mock')).toBeNull();
  });

  it('resets operator and values when field changes', () => {
    const onChange = vi.fn();
    render(
      <ConditionalLanguageBuilderClauseRow
        clause={{ fieldName: 'Region', operatorKey: 'EQUALS', value: 'abc', content: 'text' }}
        onChange={onChange}
        fieldConfig={fieldConfig}
      />,
    );

    const comboboxes = screen.getAllByRole('combobox');
    fireEvent.mouseDown(comboboxes[0]);
    fireEvent.click(screen.getByText('Amount'));

    expect(onChange).toHaveBeenCalledWith({
      fieldName: 'Amount',
      operatorKey: '',
      value: '',
      value2: undefined,
      content: 'text',
    });
  });
});
