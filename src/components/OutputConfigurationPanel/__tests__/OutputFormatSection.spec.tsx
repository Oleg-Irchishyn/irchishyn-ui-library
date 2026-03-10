import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { describe, expect, it, vi } from 'vitest';

import { OutputFormatSection } from '../OutputFormatSection';
import {
  DEFAULT_OUTPUT_FORMATS,
  DEFAULT_SELECTED_FORMATS,
  OUTPUT_FORMAT_ID_PDF,
  OUTPUT_FORMAT_ID_WORD,
  OUTPUT_FORMAT_MIN_SELECTED_MESSAGE,
} from '../constants';

const defaultFormats = DEFAULT_OUTPUT_FORMATS.map((f) => ({ ...f }));

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={createTheme()}>{ui}</ThemeProvider>);

describe('OutputFormatSection', () => {
  it('renders section with heading and format options', () => {
    const onFormatsChange = vi.fn();
    renderWithTheme(
      <OutputFormatSection
        formats={defaultFormats}
        selectedFormats={DEFAULT_SELECTED_FORMATS}
        onFormatsChange={onFormatsChange}
      />,
    );

    expect(screen.getByTestId('output-format-section')).toBeTruthy();
    expect(screen.getByText('Output Format')).toBeTruthy();
    expect(screen.getByTestId(`output-format-option-${OUTPUT_FORMAT_ID_PDF}`)).toBeTruthy();
    expect(screen.getByTestId(`output-format-option-${OUTPUT_FORMAT_ID_WORD}`)).toBeTruthy();
  });

  it('renders PDF checked by default and Word unchecked', () => {
    renderWithTheme(
      <OutputFormatSection
        formats={defaultFormats}
        selectedFormats={DEFAULT_SELECTED_FORMATS}
        onFormatsChange={() => {}}
      />,
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(2);
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it('calls onFormatsChange when selecting Word', () => {
    const onFormatsChange = vi.fn();
    renderWithTheme(
      <OutputFormatSection
        formats={defaultFormats}
        selectedFormats={[OUTPUT_FORMAT_ID_PDF]}
        onFormatsChange={onFormatsChange}
      />,
    );

    const wordCheckbox = screen.getByTestId(`output-format-checkbox-${OUTPUT_FORMAT_ID_WORD}`);
    fireEvent.click(wordCheckbox);
    expect(onFormatsChange).toHaveBeenCalledTimes(1);
    expect(onFormatsChange).toHaveBeenCalledWith([OUTPUT_FORMAT_ID_PDF, OUTPUT_FORMAT_ID_WORD]);
  });

  it('calls onFormatsChange when deselecting Word when both are selected', () => {
    const onFormatsChange = vi.fn();
    renderWithTheme(
      <OutputFormatSection
        formats={defaultFormats}
        selectedFormats={[OUTPUT_FORMAT_ID_PDF, OUTPUT_FORMAT_ID_WORD]}
        onFormatsChange={onFormatsChange}
      />,
    );

    const wordCheckbox = screen.getByTestId(`output-format-checkbox-${OUTPUT_FORMAT_ID_WORD}`);
    fireEvent.click(wordCheckbox);
    expect(onFormatsChange).toHaveBeenCalledTimes(1);
    expect(onFormatsChange).toHaveBeenCalledWith([OUTPUT_FORMAT_ID_PDF]);
  });

  it('does not call onFormatsChange when deselecting the last format and shows validation message', () => {
    const onFormatsChange = vi.fn();
    renderWithTheme(
      <OutputFormatSection
        formats={defaultFormats}
        selectedFormats={[OUTPUT_FORMAT_ID_PDF]}
        onFormatsChange={onFormatsChange}
        minSelected={1}
      />,
    );

    const pdfCheckbox = screen.getByTestId(`output-format-checkbox-${OUTPUT_FORMAT_ID_PDF}`);
    fireEvent.click(pdfCheckbox);
    expect(onFormatsChange).not.toHaveBeenCalled();
    expect(screen.getByText(OUTPUT_FORMAT_MIN_SELECTED_MESSAGE)).toBeTruthy();
  });

  it('both formats can be selected and callback receives both ids', () => {
    const onFormatsChange = vi.fn();
    renderWithTheme(
      <OutputFormatSection
        formats={defaultFormats}
        selectedFormats={[OUTPUT_FORMAT_ID_PDF]}
        onFormatsChange={onFormatsChange}
      />,
    );

    const wordCheckbox = screen.getByTestId(`output-format-checkbox-${OUTPUT_FORMAT_ID_WORD}`);
    fireEvent.click(wordCheckbox);
    expect(onFormatsChange).toHaveBeenCalledWith([OUTPUT_FORMAT_ID_PDF, OUTPUT_FORMAT_ID_WORD]);
  });

  it('respects minSelected=2: cannot reduce to one selection', () => {
    const onFormatsChange = vi.fn();
    renderWithTheme(
      <OutputFormatSection
        formats={defaultFormats}
        selectedFormats={[OUTPUT_FORMAT_ID_PDF, OUTPUT_FORMAT_ID_WORD]}
        onFormatsChange={onFormatsChange}
        minSelected={2}
      />,
    );

    const wordCheckbox = screen.getByTestId(`output-format-checkbox-${OUTPUT_FORMAT_ID_WORD}`);
    fireEvent.click(wordCheckbox);
    expect(onFormatsChange).not.toHaveBeenCalled();
    expect(screen.getByText(OUTPUT_FORMAT_MIN_SELECTED_MESSAGE)).toBeTruthy();
  });

  it('renders inside dark theme without crashing', () => {
    const darkTheme = createTheme({ palette: { mode: 'dark' } });
    render(
      <ThemeProvider theme={darkTheme}>
        <OutputFormatSection
          formats={defaultFormats}
          selectedFormats={DEFAULT_SELECTED_FORMATS}
          onFormatsChange={() => {}}
        />
      </ThemeProvider>,
    );
    expect(screen.getByText('Output Format')).toBeTruthy();
  });

  it('shows helper text without alert role when no error is present', () => {
    renderWithTheme(
      <OutputFormatSection
        formats={defaultFormats}
        selectedFormats={DEFAULT_SELECTED_FORMATS}
        onFormatsChange={() => {}}
        helperText="Choose at least one format"
      />,
    );

    const section = screen.getByTestId('output-format-section');
    const helper = screen.getByText('Choose at least one format');

    expect(section.getAttribute('aria-describedby')).toBe('output-format-helper');
    expect(helper.getAttribute('role')).toBeNull();
  });

  it('shows external error with alert role and prefers it over helper text', () => {
    renderWithTheme(
      <OutputFormatSection
        formats={defaultFormats}
        selectedFormats={DEFAULT_SELECTED_FORMATS}
        onFormatsChange={() => {}}
        error="External validation failed"
        helperText="helper"
      />,
    );

    const helper = screen.getByText('External validation failed');
    expect(helper).toBeTruthy();
    expect(helper.getAttribute('role')).toBe('alert');
  });

  it('renders option label without description suffix in aria-label when description is missing', () => {
    renderWithTheme(
      <OutputFormatSection
        formats={[{ id: OUTPUT_FORMAT_ID_PDF, label: 'PDF' }]}
        selectedFormats={[OUTPUT_FORMAT_ID_PDF]}
        onFormatsChange={() => {}}
      />,
    );

    const checkbox = screen.getByLabelText('PDF');
    expect(checkbox).toBeTruthy();
  });

  it('accepts sx as object and array', () => {
    const { unmount } = renderWithTheme(
      <OutputFormatSection
        formats={defaultFormats}
        selectedFormats={DEFAULT_SELECTED_FORMATS}
        onFormatsChange={() => {}}
        sx={{ border: '1px solid red' }}
      />,
    );
    expect(screen.getByTestId('output-format-section')).toBeTruthy();
    unmount();

    renderWithTheme(
      <OutputFormatSection
        formats={defaultFormats}
        selectedFormats={DEFAULT_SELECTED_FORMATS}
        onFormatsChange={() => {}}
        sx={[{ border: '1px solid blue' }]}
      />,
    );
    expect(screen.getByTestId('output-format-section')).toBeTruthy();
  });
});
