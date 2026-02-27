import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ConditionalLanguageBuilderValueInput } from '../ConditionalLanguageBuilderValueInput';

describe('ConditionalLanguageBuilderValueInput', () => {
  it('renders text/number/date inputs with expected type', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <ConditionalLanguageBuilderValueInput dataType="text" value="abc" onChange={onChange} />,
    );
    const textInput = screen.getByDisplayValue('abc');
    expect(textInput.getAttribute('type')).toBe('text');
    fireEvent.change(textInput, { target: { value: 'xyz' } });
    expect(onChange).toHaveBeenCalledWith('xyz');

    rerender(
      <ConditionalLanguageBuilderValueInput dataType="number" value="5" onChange={onChange} />,
    );
    const numberInput = screen.getByDisplayValue('5');
    expect(numberInput.getAttribute('type')).toBe('number');
    fireEvent.change(numberInput, { target: { value: '15' } });
    expect(onChange).toHaveBeenCalledWith('15');

    rerender(
      <ConditionalLanguageBuilderValueInput
        dataType="date"
        value="2026-02-01"
        onChange={onChange}
      />,
    );
    const dateInput = screen.getByDisplayValue('2026-02-01');
    expect(dateInput.getAttribute('type')).toBe('date');
    fireEvent.change(dateInput, { target: { value: '2026-02-10' } });
    expect(onChange).toHaveBeenCalledWith('2026-02-10');
  });

  it('renders boolean select and emits change', () => {
    const onChange = vi.fn();
    render(
      <ConditionalLanguageBuilderValueInput dataType="boolean" value="true" onChange={onChange} />,
    );

    const select = screen.getByRole('combobox');
    fireEvent.mouseDown(select);
    fireEvent.click(screen.getByText('false'));
    expect(onChange).toHaveBeenCalledWith('false');
  });
});
