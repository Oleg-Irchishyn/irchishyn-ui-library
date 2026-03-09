import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { describe, expect, it } from 'vitest';

import { OutputConfigurationPanel } from '../OutputConfigurationPanel';

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={createTheme()}>{ui}</ThemeProvider>);

describe('OutputConfigurationPanel', () => {
  it('renders panel with output format section and placeholders', () => {
    renderWithTheme(<OutputConfigurationPanel />);

    expect(screen.getByTestId('output-configuration-panel')).toBeTruthy();
    expect(screen.getByTestId('output-format-section')).toBeTruthy();
    expect(screen.getByText('Output Format')).toBeTruthy();
    expect(screen.getByText(/File Splitting — coming soon/)).toBeTruthy();
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

  it('renders inside dark theme without crashing', () => {
    const darkTheme = createTheme({ palette: { mode: 'dark' } });
    render(
      <ThemeProvider theme={darkTheme}>
        <OutputConfigurationPanel />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('output-configuration-panel')).toBeTruthy();
  });
});
