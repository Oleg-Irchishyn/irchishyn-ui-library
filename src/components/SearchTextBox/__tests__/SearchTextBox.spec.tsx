import '@testing-library/jest-dom/vitest';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { IrchishynThemeProvider } from '../../../providers';
import { SearchTextBox } from '../SearchTextBox';
import { getSearchTextBoxBaseStyles } from '../styles';

const renderWithTheme = (ui: React.ReactElement) =>
  render(<IrchishynThemeProvider mode="light">{ui}</IrchishynThemeProvider>);

describe('SearchTextBox', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('AC1: renders with placeholder and leading search icon', () => {
    renderWithTheme(<SearchTextBox value="" onChange={vi.fn()} placeholder="Search reports..." />);

    expect(screen.getByTestId('search-text-box-input')).toBeInTheDocument();
    const input = screen.getByLabelText('Search reports...');
    expect(input).toHaveAttribute('placeholder', 'Search reports...');
    // Search icon is in start adornment (svg from lucide-react)
    const textField = screen.getByTestId('search-text-box-input').closest('.MuiTextField-root');
    expect(textField?.querySelector('.MuiInputAdornment-root')).toBeInTheDocument();
  });

  it('renders with default placeholder when not provided', () => {
    renderWithTheme(<SearchTextBox value="" onChange={vi.fn()} />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('AC2: calls onChange after debounce period elapses', () => {
    const onChange = vi.fn();

    renderWithTheme(
      <SearchTextBox value="" onChange={onChange} placeholder="Search..." debounceMs={300} />,
    );

    const input = screen.getByLabelText('Search...');
    fireEvent.change(input, { target: { value: 'hello' } });

    expect(onChange).not.toHaveBeenCalled();
    vi.advanceTimersByTime(300);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('hello');
  });

  it('resets debounce timer when user keeps typing', () => {
    const onChange = vi.fn();

    renderWithTheme(
      <SearchTextBox value="" onChange={onChange} placeholder="Search..." debounceMs={300} />,
    );

    const input = screen.getByLabelText('Search...');
    fireEvent.change(input, { target: { value: 'h' } });
    vi.advanceTimersByTime(100);
    fireEvent.change(input, { target: { value: 'he' } });
    vi.advanceTimersByTime(100);
    fireEvent.change(input, { target: { value: 'hey' } });
    vi.advanceTimersByTime(200);
    expect(onChange).not.toHaveBeenCalled();
    vi.advanceTimersByTime(100);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('hey');
  });

  it('AC3: clear button clears input and calls onClear when clicked', () => {
    const onChange = vi.fn();
    const onClear = vi.fn();

    renderWithTheme(
      <SearchTextBox
        value="some text"
        onChange={onChange}
        onClear={onClear}
        placeholder="Search..."
      />,
    );

    expect(screen.getByDisplayValue('some text')).toBeInTheDocument();
    const clearButton = screen.getByTestId('search-text-box-clear');
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);

    expect(onChange).toHaveBeenCalledWith('');
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText('Search...')).toHaveValue('');
  });

  it('shows clear button only when value is non-empty', () => {
    const { rerender } = renderWithTheme(
      <SearchTextBox value="" onChange={vi.fn()} placeholder="Search..." />,
    );
    expect(screen.queryByTestId('search-text-box-clear')).not.toBeInTheDocument();

    rerender(
      <IrchishynThemeProvider mode="light">
        <SearchTextBox value="x" onChange={vi.fn()} placeholder="Search..." />
      </IrchishynThemeProvider>,
    );
    expect(screen.getByTestId('search-text-box-clear')).toBeInTheDocument();
  });

  it('uses custom aria-label when provided', () => {
    renderWithTheme(
      <SearchTextBox
        value=""
        onChange={vi.fn()}
        placeholder="Search..."
        ariaLabel="Search data items"
      />,
    );
    expect(screen.getByLabelText('Search data items')).toBeInTheDocument();
  });

  it('syncs local value when controlled value changes from outside', () => {
    const onChange = vi.fn();

    const { rerender } = renderWithTheme(
      <SearchTextBox value="" onChange={onChange} placeholder="Search..." />,
    );
    const input = screen.getByLabelText('Search...');
    expect(input).toHaveValue('');

    rerender(
      <IrchishynThemeProvider mode="light">
        <SearchTextBox value="external" onChange={onChange} placeholder="Search..." />
      </IrchishynThemeProvider>,
    );
    expect(screen.getByLabelText('Search...')).toHaveValue('external');
  });

  it('invokes onChange immediately when debounceMs is 0', () => {
    const onChange = vi.fn();

    renderWithTheme(
      <SearchTextBox value="" onChange={onChange} placeholder="Search..." debounceMs={0} />,
    );
    const input = screen.getByLabelText('Search...');
    fireEvent.change(input, { target: { value: 'instant' } });
    expect(onChange).toHaveBeenCalledWith('instant');
  });

  it('returns mode-specific base styles for light and dark themes', () => {
    const styleFn = getSearchTextBoxBaseStyles() as (theme: {
      palette: {
        mode: 'light' | 'dark';
        background: { paper: string };
        common: { white: string };
        text: { primary: string; secondary: string };
        divider: string;
        primary: { main: string };
      };
    }) => Record<string, unknown>;

    const lightStyles = styleFn({
      palette: {
        mode: 'light',
        background: { paper: '#111' },
        common: { white: '#fff' },
        text: { primary: '#222', secondary: '#333' },
        divider: '#444',
        primary: { main: '#555' },
      },
    });

    const darkStyles = styleFn({
      palette: {
        mode: 'dark',
        background: { paper: '#111' },
        common: { white: '#fff' },
        text: { primary: '#222', secondary: '#333' },
        divider: '#444',
        primary: { main: '#555' },
      },
    });

    expect(lightStyles.backgroundColor).toBe('#fff');
    expect(darkStyles.backgroundColor).toBe('#111');
  });
});
