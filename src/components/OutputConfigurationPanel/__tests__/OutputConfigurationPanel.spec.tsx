import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { describe, expect, it, vi } from 'vitest';

import { OutputConfigurationPanel } from '../OutputConfigurationPanel';

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={createTheme()}>{ui}</ThemeProvider>);

describe('OutputConfigurationPanel', () => {
  it('renders panel with output format section, file splitting section, and placeholder', () => {
    renderWithTheme(<OutputConfigurationPanel />);

    expect(screen.getByTestId('output-configuration-panel')).toBeTruthy();
    expect(screen.getByTestId('output-format-section')).toBeTruthy();
    expect(screen.getByText('Output Format')).toBeTruthy();
    expect(screen.getByTestId('file-splitting-section')).toBeTruthy();
    expect(screen.getByText('File Splitting')).toBeTruthy();
    expect(screen.getByText('Consolidated File')).toBeTruthy();
    expect(screen.getByText('Split Per Investor')).toBeTruthy();
    expect(screen.getByText(/File Naming Convention — coming soon/)).toBeTruthy();
  });

  it('renders with custom outputFormat props', () => {
    const onFormatsChange = () => {};
    renderWithTheme(
      <OutputConfigurationPanel
        outputFormat={{
          formats: [
            { id: 'pdf', label: 'PDF', description: 'Portable' },
            { id: 'word', label: 'Word', description: 'Document' },
          ],
          selectedFormats: ['pdf'],
          onFormatsChange,
          minSelected: 1,
        }}
      />,
    );

    expect(screen.getByText('Output Format')).toBeTruthy();
    expect(screen.getByText('PDF')).toBeTruthy();
    expect(screen.getByText('Word')).toBeTruthy();
  });

  it('renders with custom fileSplitting props', () => {
    const onSplitModeChange = vi.fn();
    renderWithTheme(
      <OutputConfigurationPanel
        fileSplitting={{
          splitMode: 'splitPerInvestor',
          onSplitModeChange,
        }}
      />,
    );

    expect(screen.getByText('File Splitting')).toBeTruthy();
    const radios = screen.getAllByRole('radio');
    expect(radios[1]).toBeChecked();
  });

  it('renders inside dark theme without crashing', () => {
    const darkTheme = createTheme({ palette: { mode: 'dark' } });
    render(
      <ThemeProvider theme={darkTheme}>
        <OutputConfigurationPanel />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('output-configuration-panel')).toBeTruthy();
  });

  it('accepts sx as object and array', () => {
    const { unmount } = renderWithTheme(
      <OutputConfigurationPanel sx={{ border: '1px solid red' }} />,
    );
    expect(screen.getByTestId('output-configuration-panel')).toBeTruthy();
    unmount();

    renderWithTheme(<OutputConfigurationPanel sx={[{ border: '1px solid blue' }]} />);
    expect(screen.getByTestId('output-configuration-panel')).toBeTruthy();
  });
});
