import React from 'react';
import { renderHook } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { describe, expect, it, vi } from 'vitest';

import {
  DEFAULT_SELECTED_FORMATS,
  DEFAULT_MIN_SELECTED_FORMATS,
  OUTPUT_FORMAT_ID_PDF,
  OUTPUT_FORMAT_ID_WORD,
} from '../constants';
import { useOutputConfigurationPanel } from '../useOutputConfigurationPanel';

function wrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={createTheme()}>{children}</ThemeProvider>;
}

describe('useOutputConfigurationPanel', () => {
  it('returns outputFormatProps with default formats when outputFormat is undefined', () => {
    const { result } = renderHook(() => useOutputConfigurationPanel({}), { wrapper });

    expect(result.current.outputFormatProps.formats).toHaveLength(2);
    expect(result.current.outputFormatProps.formats[0].id).toBe(OUTPUT_FORMAT_ID_PDF);
    expect(result.current.outputFormatProps.formats[0].label).toBe('PDF');
    expect(result.current.outputFormatProps.formats[1].id).toBe(OUTPUT_FORMAT_ID_WORD);
    expect(result.current.outputFormatProps.formats[1].label).toBe('Word');
    expect(result.current.outputFormatProps.selectedFormats).toEqual(DEFAULT_SELECTED_FORMATS);
    expect(result.current.outputFormatProps.minSelected).toBe(DEFAULT_MIN_SELECTED_FORMATS);
    expect(typeof result.current.outputFormatProps.onFormatsChange).toBe('function');
  });

  it('returns default formats with icons when outputFormat is undefined', () => {
    const { result } = renderHook(() => useOutputConfigurationPanel({}), { wrapper });

    expect(result.current.outputFormatProps.formats[0].icon).toBeDefined();
    expect(result.current.outputFormatProps.formats[1].icon).toBeDefined();
  });

  it('returns outputFormat as outputFormatProps when outputFormat is provided', () => {
    const onFormatsChange = vi.fn();
    const customFormats = [
      { id: 'pdf', label: 'PDF', description: 'Portable' },
      { id: 'word', label: 'Word', description: 'Document' },
    ];
    const { result } = renderHook(
      () =>
        useOutputConfigurationPanel({
          outputFormat: {
            formats: customFormats,
            selectedFormats: [OUTPUT_FORMAT_ID_WORD],
            onFormatsChange,
            minSelected: 1,
          },
        }),
      { wrapper },
    );

    expect(result.current.outputFormatProps.formats).toBe(customFormats);
    expect(result.current.outputFormatProps.selectedFormats).toEqual([OUTPUT_FORMAT_ID_WORD]);
    expect(result.current.outputFormatProps.onFormatsChange).toBe(onFormatsChange);
    expect(result.current.outputFormatProps.minSelected).toBe(1);
  });

  it('works with dark theme', () => {
    const darkWrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider theme={createTheme({ palette: { mode: 'dark' } })}>
        {children}
      </ThemeProvider>
    );
    const { result } = renderHook(() => useOutputConfigurationPanel({}), {
      wrapper: darkWrapper,
    });

    expect(result.current.outputFormatProps.formats).toHaveLength(2);
    expect(result.current.outputFormatProps.selectedFormats).toEqual(DEFAULT_SELECTED_FORMATS);
  });
});
