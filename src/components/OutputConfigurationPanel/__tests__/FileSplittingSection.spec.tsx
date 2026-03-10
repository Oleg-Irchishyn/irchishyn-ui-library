import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { describe, expect, it, vi } from 'vitest';

import { FileSplittingSection } from '../FileSplittingSection';
import { SPLIT_MODE_CONSOLIDATED, SPLIT_MODE_SPLIT_PER_INVESTOR } from '../constants';

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={createTheme()}>{ui}</ThemeProvider>);

describe('FileSplittingSection', () => {
  it('renders section heading and both options with titles and descriptions', () => {
    const onSplitModeChange = vi.fn();
    renderWithTheme(
      <FileSplittingSection
        splitMode={SPLIT_MODE_CONSOLIDATED}
        onSplitModeChange={onSplitModeChange}
      />,
    );

    expect(screen.getByTestId('file-splitting-section')).toBeTruthy();
    expect(screen.getByText('File Splitting')).toBeTruthy();
    expect(screen.getByText('Consolidated File')).toBeTruthy();
    expect(screen.getByText('Split Per Investor')).toBeTruthy();
    expect(screen.getByText(/Generate a single document containing all investors/)).toBeTruthy();
    expect(screen.getByText(/Generate separate documents for each investor/)).toBeTruthy();
  });

  it('renders Consolidated File selected by default when splitMode is consolidated', () => {
    renderWithTheme(
      <FileSplittingSection splitMode={SPLIT_MODE_CONSOLIDATED} onSplitModeChange={() => {}} />,
    );

    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(2);
    expect(radios[0]).toBeChecked();
    expect(radios[1]).not.toBeChecked();
  });

  it('calls onSplitModeChange with splitPerInvestor when selecting Split Per Investor', () => {
    const onSplitModeChange = vi.fn();
    renderWithTheme(
      <FileSplittingSection
        splitMode={SPLIT_MODE_CONSOLIDATED}
        onSplitModeChange={onSplitModeChange}
      />,
    );

    const splitPerInvestorRadio = screen.getByTestId(
      `file-splitting-radio-${SPLIT_MODE_SPLIT_PER_INVESTOR}`,
    );
    fireEvent.click(splitPerInvestorRadio);

    expect(onSplitModeChange).toHaveBeenCalledTimes(1);
    expect(onSplitModeChange).toHaveBeenCalledWith(SPLIT_MODE_SPLIT_PER_INVESTOR);
  });

  it('renders Split Per Investor as checked when splitMode is splitPerInvestor', () => {
    renderWithTheme(
      <FileSplittingSection
        splitMode={SPLIT_MODE_SPLIT_PER_INVESTOR}
        onSplitModeChange={() => {}}
      />,
    );

    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(2);
    expect(radios[0]).not.toBeChecked();
    expect(radios[1]).toBeChecked();
  });

  it('renders inside dark theme without crashing', () => {
    const darkTheme = createTheme({ palette: { mode: 'dark' } });
    render(
      <ThemeProvider theme={darkTheme}>
        <FileSplittingSection splitMode={SPLIT_MODE_CONSOLIDATED} onSplitModeChange={() => {}} />
      </ThemeProvider>,
    );
    expect(screen.getByText('File Splitting')).toBeTruthy();
  });

  it('calls onSplitModeChange with consolidated when selecting Consolidated File', () => {
    const onSplitModeChange = vi.fn();
    renderWithTheme(
      <FileSplittingSection
        splitMode={SPLIT_MODE_SPLIT_PER_INVESTOR}
        onSplitModeChange={onSplitModeChange}
      />,
    );

    const consolidatedRadio = screen.getByTestId(`file-splitting-radio-${SPLIT_MODE_CONSOLIDATED}`);
    fireEvent.click(consolidatedRadio);

    expect(onSplitModeChange).toHaveBeenCalledTimes(1);
    expect(onSplitModeChange).toHaveBeenCalledWith(SPLIT_MODE_CONSOLIDATED);
  });

  it('accepts sx as object and array', () => {
    const { unmount } = renderWithTheme(
      <FileSplittingSection
        splitMode={SPLIT_MODE_CONSOLIDATED}
        onSplitModeChange={() => {}}
        sx={{ border: '1px solid red' }}
      />,
    );
    expect(screen.getByTestId('file-splitting-section')).toBeTruthy();
    unmount();

    renderWithTheme(
      <FileSplittingSection
        splitMode={SPLIT_MODE_CONSOLIDATED}
        onSplitModeChange={() => {}}
        sx={[{ border: '1px solid blue' }]}
      />,
    );
    expect(screen.getByTestId('file-splitting-section')).toBeTruthy();
  });
});
