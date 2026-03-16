import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { describe, expect, it, vi } from 'vitest';

import { FileNamingSection } from '../FileNamingSection';
import {
  DEFAULT_FILE_NAMING_VARIABLES,
  FILE_NAMING_VAR_FUND_GROUP,
  FILE_NAMING_VAR_EVENT_TYPE,
} from '../constants';
import type { FileNamingToken } from '../types';

const defaultTokens: FileNamingToken[] = [
  { type: 'variable', value: FILE_NAMING_VAR_FUND_GROUP },
  { type: 'static', value: '_' },
  { type: 'variable', value: FILE_NAMING_VAR_EVENT_TYPE },
];

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={createTheme()}>{ui}</ThemeProvider>);

describe('FileNamingSection', () => {
  it('renders section with preview, token chips, Add button, and Reset link (AC5)', () => {
    const onTokensChange = vi.fn();
    const onReset = vi.fn();
    renderWithTheme(
      <FileNamingSection
        tokens={defaultTokens}
        availableVariables={DEFAULT_FILE_NAMING_VARIABLES}
        onTokensChange={onTokensChange}
        onReset={onReset}
        previewFileNames={['Global Fund II_Capital Call.pdf']}
      />,
    );

    expect(screen.getByTestId('file-naming-section')).toBeTruthy();
    expect(screen.getByText('File Naming Convention')).toBeTruthy();
    expect(screen.getByText('Preview')).toBeTruthy();
    expect(screen.getByTestId('file-naming-preview')).toHaveTextContent(
      'Global Fund II_Capital Call.pdf',
    );
    expect(screen.getByText('File Name Structure')).toBeTruthy();
    expect(screen.getByTestId('file-naming-add-button')).toHaveTextContent('Add');
    expect(screen.getByTestId('file-naming-reset')).toHaveTextContent('Reset to Default');
  });

  it('renders token chips with variable labels and static values', () => {
    renderWithTheme(
      <FileNamingSection
        tokens={defaultTokens}
        availableVariables={DEFAULT_FILE_NAMING_VARIABLES}
        onTokensChange={() => {}}
        onReset={() => {}}
        previewFileNames={['preview.pdf']}
      />,
    );

    expect(screen.getByTestId('file-naming-token-0')).toHaveTextContent('Fund Group');
    expect(screen.getByTestId('file-naming-token-1')).toHaveTextContent('_');
    expect(screen.getByTestId('file-naming-token-2')).toHaveTextContent('Event Type');
  });

  it('calls onTokensChange with array without removed token when chip delete is clicked (AC6)', () => {
    const onTokensChange = vi.fn();
    renderWithTheme(
      <FileNamingSection
        tokens={defaultTokens}
        availableVariables={DEFAULT_FILE_NAMING_VARIABLES}
        onTokensChange={onTokensChange}
        onReset={() => {}}
        previewFileNames={['preview.pdf']}
      />,
    );

    const chip1 = screen.getByTestId('file-naming-token-1');
    const deleteIcon = within(chip1).getByTestId('CancelIcon');
    fireEvent.click(deleteIcon);

    expect(onTokensChange).toHaveBeenCalledTimes(1);
    expect(onTokensChange).toHaveBeenCalledWith([
      { type: 'variable', value: FILE_NAMING_VAR_FUND_GROUP },
      { type: 'variable', value: FILE_NAMING_VAR_EVENT_TYPE },
    ]);
  });

  it('opens Add Segment popover when Add is clicked (AC7)', () => {
    renderWithTheme(
      <FileNamingSection
        tokens={defaultTokens}
        availableVariables={DEFAULT_FILE_NAMING_VARIABLES}
        onTokensChange={() => {}}
        onReset={() => {}}
        previewFileNames={['preview.pdf']}
      />,
    );

    expect(screen.queryByTestId('file-naming-add-popover')).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId('file-naming-add-button'));

    expect(screen.getByTestId('file-naming-add-popover')).toBeInTheDocument();
    expect(screen.getByText('Add Segment')).toBeInTheDocument();
    expect(screen.getByText('Choose segment type to add')).toBeInTheDocument();
    expect(screen.getByTestId('add-segment-tab-variable')).toBeInTheDocument();
    expect(screen.getByTestId('add-segment-tab-static')).toBeInTheDocument();
    expect(screen.getByTestId('file-naming-add-variable-fundGroup')).toBeInTheDocument();
    expect(screen.getByTestId('file-naming-add-variable-eventType')).toBeInTheDocument();
  });

  it('appends variable token and calls onTokensChange when variable is selected from Add menu (AC7)', () => {
    const onTokensChange = vi.fn();
    renderWithTheme(
      <FileNamingSection
        tokens={defaultTokens}
        availableVariables={DEFAULT_FILE_NAMING_VARIABLES}
        onTokensChange={onTokensChange}
        onReset={() => {}}
        previewFileNames={['preview.pdf']}
      />,
    );

    fireEvent.click(screen.getByTestId('file-naming-add-button'));
    fireEvent.click(screen.getByTestId('file-naming-add-variable-eventType'));

    expect(onTokensChange).toHaveBeenCalledTimes(1);
    expect(onTokensChange).toHaveBeenCalledWith([
      ...defaultTokens,
      { type: 'variable', value: FILE_NAMING_VAR_EVENT_TYPE },
    ]);
  });

  it('appends static token when user enters text and clicks Add Static Text (AC7)', () => {
    const onTokensChange = vi.fn();
    renderWithTheme(
      <FileNamingSection
        tokens={defaultTokens}
        availableVariables={DEFAULT_FILE_NAMING_VARIABLES}
        onTokensChange={onTokensChange}
        onReset={() => {}}
        previewFileNames={['preview.pdf']}
      />,
    );

    fireEvent.click(screen.getByTestId('file-naming-add-button'));
    fireEvent.click(screen.getByTestId('add-segment-tab-static'));
    fireEvent.change(screen.getByTestId('file-naming-static-input'), { target: { value: '_' } });
    fireEvent.click(screen.getByTestId('add-segment-add-static'));

    expect(onTokensChange).toHaveBeenCalledWith([...defaultTokens, { type: 'static', value: '_' }]);
  });

  it('calls onReset when Reset to Default is clicked (AC8)', () => {
    const onReset = vi.fn();
    renderWithTheme(
      <FileNamingSection
        tokens={defaultTokens}
        availableVariables={DEFAULT_FILE_NAMING_VARIABLES}
        onTokensChange={() => {}}
        onReset={onReset}
        previewFileNames={['preview.pdf']}
      />,
    );

    fireEvent.click(screen.getByTestId('file-naming-reset'));

    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('shows — when previewFileNames is empty', () => {
    renderWithTheme(
      <FileNamingSection
        tokens={[]}
        availableVariables={DEFAULT_FILE_NAMING_VARIABLES}
        onTokensChange={() => {}}
        onReset={() => {}}
        previewFileNames={[]}
      />,
    );

    expect(screen.getByTestId('file-naming-preview')).toHaveTextContent('—');
  });

  it('renders inside dark theme without crashing', () => {
    const darkTheme = createTheme({ palette: { mode: 'dark' } });
    render(
      <ThemeProvider theme={darkTheme}>
        <FileNamingSection
          tokens={defaultTokens}
          availableVariables={DEFAULT_FILE_NAMING_VARIABLES}
          onTokensChange={() => {}}
          onReset={() => {}}
          previewFileNames={['preview.pdf']}
        />
      </ThemeProvider>,
    );
    expect(screen.getByText('File Naming Convention')).toBeTruthy();
  });
});
