import React from 'react';
import { act, renderHook } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { describe, expect, it, vi } from 'vitest';

import {
  DEFAULT_FILE_NAMING_TOKENS,
  DEFAULT_FILE_NAMING_TOKENS_PER_INVESTOR,
  DEFAULT_FILE_NAMING_VARIABLES,
  DEFAULT_FILE_NAMING_VARIABLES_PER_INVESTOR,
  DEFAULT_MIN_SELECTED_FORMATS,
  DEFAULT_SELECTED_FORMATS,
  DEFAULT_SPLIT_MODE,
  FILE_NAMING_SUBTITLE_CONSOLIDATED,
  FILE_NAMING_SUBTITLE_PER_INVESTOR,
  OUTPUT_FORMAT_ID_PDF,
  OUTPUT_FORMAT_ID_WORD,
  SPLIT_MODE_SPLIT_PER_INVESTOR,
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

  it('provides a safe no-op default onFormatsChange handler', () => {
    const { result } = renderHook(() => useOutputConfigurationPanel({}), { wrapper });

    expect(() =>
      result.current.outputFormatProps.onFormatsChange([OUTPUT_FORMAT_ID_WORD]),
    ).not.toThrow();
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
      <ThemeProvider theme={createTheme({ palette: { mode: 'dark' } })}>{children}</ThemeProvider>
    );
    const { result } = renderHook(() => useOutputConfigurationPanel({}), {
      wrapper: darkWrapper,
    });

    expect(result.current.outputFormatProps.formats).toHaveLength(2);
    expect(result.current.outputFormatProps.selectedFormats).toEqual(DEFAULT_SELECTED_FORMATS);
  });

  it('when fileSplitting is undefined, internal state allows radio to toggle (AC4)', () => {
    const { result } = renderHook(() => useOutputConfigurationPanel({}), { wrapper });

    expect(result.current.fileSplittingProps.splitMode).toBe(DEFAULT_SPLIT_MODE);

    act(() => {
      result.current.fileSplittingProps.onSplitModeChange(SPLIT_MODE_SPLIT_PER_INVESTOR);
    });

    expect(result.current.fileSplittingProps.splitMode).toBe(SPLIT_MODE_SPLIT_PER_INVESTOR);
  });

  it('when fileSplitting is provided, returns it unchanged (controlled)', () => {
    const onSplitModeChange = vi.fn();
    const { result } = renderHook(
      () =>
        useOutputConfigurationPanel({
          fileSplitting: {
            splitMode: SPLIT_MODE_SPLIT_PER_INVESTOR,
            onSplitModeChange,
          },
        }),
      { wrapper },
    );

    expect(result.current.fileSplittingProps.splitMode).toBe(SPLIT_MODE_SPLIT_PER_INVESTOR);
    expect(result.current.fileSplittingProps.onSplitModeChange).toBe(onSplitModeChange);
  });

  it('when fileNaming is undefined, returns fileNamingProps with default tokens and computed preview', () => {
    const { result } = renderHook(() => useOutputConfigurationPanel({}), { wrapper });

    expect(result.current.fileNamingProps.tokens).toEqual(DEFAULT_FILE_NAMING_TOKENS);
    expect(result.current.fileNamingProps.availableVariables).toEqual(
      DEFAULT_FILE_NAMING_VARIABLES,
    );
    expect(result.current.fileNamingProps.previewFileNames).toHaveLength(1);
    expect(result.current.fileNamingProps.previewFileNames[0]).toContain('Global Fund II');
    expect(result.current.fileNamingProps.previewFileNames[0]).toContain('Capital Call');
    expect(result.current.fileNamingProps.previewFileNames[0]).toContain('2025-01-29');
    expect(result.current.fileNamingProps.previewFileNames[0]).toMatch(/\.pdf$/);
    expect(typeof result.current.fileNamingProps.onTokensChange).toBe('function');
    expect(typeof result.current.fileNamingProps.onReset).toBe('function');
  });

  it('when fileNaming is undefined, onTokensChange updates tokens and preview', () => {
    const { result } = renderHook(() => useOutputConfigurationPanel({}), { wrapper });

    const newTokens = result.current.fileNamingProps.tokens.slice(0, 2);
    act(() => {
      result.current.fileNamingProps.onTokensChange(newTokens);
    });

    expect(result.current.fileNamingProps.tokens).toEqual(newTokens);
    expect(result.current.fileNamingProps.previewFileNames[0]).not.toContain('Notice Date');
  });

  it('when fileNaming is undefined, onReset restores default tokens', () => {
    const { result } = renderHook(() => useOutputConfigurationPanel({}), { wrapper });

    act(() => {
      result.current.fileNamingProps.onTokensChange([result.current.fileNamingProps.tokens[0]]);
    });
    expect(result.current.fileNamingProps.tokens).toHaveLength(1);

    act(() => {
      result.current.fileNamingProps.onReset();
    });
    expect(result.current.fileNamingProps.tokens).toEqual(DEFAULT_FILE_NAMING_TOKENS);
  });

  it('when fileNaming is undefined and split mode changes to splitPerInvestor, resets tokens and uses per-investor variables and subtitle', () => {
    const { result } = renderHook(() => useOutputConfigurationPanel({}), { wrapper });

    expect(result.current.fileNamingProps.availableVariables).toEqual(
      DEFAULT_FILE_NAMING_VARIABLES,
    );
    expect(result.current.fileNamingProps.subtitle).toBe(FILE_NAMING_SUBTITLE_CONSOLIDATED);

    act(() => {
      result.current.fileSplittingProps.onSplitModeChange(SPLIT_MODE_SPLIT_PER_INVESTOR);
    });

    expect(result.current.fileNamingProps.tokens).toEqual(DEFAULT_FILE_NAMING_TOKENS_PER_INVESTOR);
    expect(result.current.fileNamingProps.availableVariables).toEqual(
      DEFAULT_FILE_NAMING_VARIABLES_PER_INVESTOR,
    );
    expect(result.current.fileNamingProps.subtitle).toBe(FILE_NAMING_SUBTITLE_PER_INVESTOR);
    expect(result.current.fileNamingProps.previewFileNames[0]).toMatch(/\.pdf$/);
  });

  it('when fileNaming is undefined and both formats selected, previewFileNames contains pdf and docx', () => {
    const { result } = renderHook(() => useOutputConfigurationPanel({}), { wrapper });

    act(() => {
      result.current.outputFormatProps.onFormatsChange([
        OUTPUT_FORMAT_ID_PDF,
        OUTPUT_FORMAT_ID_WORD,
      ]);
    });

    expect(result.current.fileNamingProps.previewFileNames).toHaveLength(2);
    expect(result.current.fileNamingProps.previewFileNames[0]).toMatch(/\.pdf$/);
    expect(result.current.fileNamingProps.previewFileNames[1]).toMatch(/\.docx$/);
  });

  it('when fileNaming is provided, returns it as fileNamingProps', () => {
    const onTokensChange = vi.fn();
    const onReset = vi.fn();
    const customFileNaming = {
      tokens: [{ type: 'static' as const, value: 'custom' }],
      availableVariables: [],
      onTokensChange,
      onReset,
      previewFileNames: ['custom.pdf'],
    };
    const { result } = renderHook(
      () => useOutputConfigurationPanel({ fileNaming: customFileNaming }),
      { wrapper },
    );

    expect(result.current.fileNamingProps).toBe(customFileNaming);
    expect(result.current.fileNamingProps.tokens).toHaveLength(1);
    expect(result.current.fileNamingProps.previewFileNames).toEqual(['custom.pdf']);
  });
});
