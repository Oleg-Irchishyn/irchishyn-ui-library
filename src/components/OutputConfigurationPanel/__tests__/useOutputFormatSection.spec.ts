import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  OUTPUT_FORMAT_MIN_SELECTED_MESSAGE,
  OUTPUT_FORMAT_ID_PDF,
  OUTPUT_FORMAT_ID_WORD,
} from '../constants';
import { useOutputFormatSection } from '../useOutputFormatSection';

describe('useOutputFormatSection', () => {
  it('returns handleChange and displayError; displayError is undefined when no error and no violation', () => {
    const onFormatsChange = vi.fn();
    const { result } = renderHook(() =>
      useOutputFormatSection({
        selectedFormats: [OUTPUT_FORMAT_ID_PDF],
        onFormatsChange,
        minSelected: 1,
      }),
    );

    expect(typeof result.current.handleChange).toBe('function');
    expect(result.current.displayError).toBeUndefined();
  });

  it('displayError is the error prop when provided', () => {
    const onFormatsChange = vi.fn();
    const { result } = renderHook(() =>
      useOutputFormatSection({
        selectedFormats: [OUTPUT_FORMAT_ID_PDF],
        onFormatsChange,
        minSelected: 1,
        error: 'Custom validation error',
      }),
    );

    expect(result.current.displayError).toBe('Custom validation error');
  });

  it('handleChange with checked true adds format and calls onFormatsChange', () => {
    const onFormatsChange = vi.fn();
    const { result } = renderHook(() =>
      useOutputFormatSection({
        selectedFormats: [OUTPUT_FORMAT_ID_PDF],
        onFormatsChange,
        minSelected: 1,
      }),
    );

    act(() => {
      result.current.handleChange(OUTPUT_FORMAT_ID_WORD, true);
    });

    expect(onFormatsChange).toHaveBeenCalledTimes(1);
    expect(onFormatsChange).toHaveBeenCalledWith([OUTPUT_FORMAT_ID_PDF, OUTPUT_FORMAT_ID_WORD]);
  });

  it('handleChange with checked false removes format and calls onFormatsChange', () => {
    const onFormatsChange = vi.fn();
    const { result } = renderHook(() =>
      useOutputFormatSection({
        selectedFormats: [OUTPUT_FORMAT_ID_PDF, OUTPUT_FORMAT_ID_WORD],
        onFormatsChange,
        minSelected: 1,
      }),
    );

    act(() => {
      result.current.handleChange(OUTPUT_FORMAT_ID_WORD, false);
    });

    expect(onFormatsChange).toHaveBeenCalledTimes(1);
    expect(onFormatsChange).toHaveBeenCalledWith([OUTPUT_FORMAT_ID_PDF]);
  });

  it('when deselecting would go below minSelected, does not call onFormatsChange and sets displayError', () => {
    const onFormatsChange = vi.fn();
    const { result } = renderHook(() =>
      useOutputFormatSection({
        selectedFormats: [OUTPUT_FORMAT_ID_PDF],
        onFormatsChange,
        minSelected: 1,
      }),
    );

    act(() => {
      result.current.handleChange(OUTPUT_FORMAT_ID_PDF, false);
    });

    expect(onFormatsChange).not.toHaveBeenCalled();
    expect(result.current.displayError).toBe(OUTPUT_FORMAT_MIN_SELECTED_MESSAGE);
  });

  it('respects minSelected=2: deselecting one does not call onFormatsChange and shows displayError', () => {
    const onFormatsChange = vi.fn();
    const { result } = renderHook(() =>
      useOutputFormatSection({
        selectedFormats: [OUTPUT_FORMAT_ID_PDF, OUTPUT_FORMAT_ID_WORD],
        onFormatsChange,
        minSelected: 2,
      }),
    );

    act(() => {
      result.current.handleChange(OUTPUT_FORMAT_ID_WORD, false);
    });

    expect(onFormatsChange).not.toHaveBeenCalled();
    expect(result.current.displayError).toBe(OUTPUT_FORMAT_MIN_SELECTED_MESSAGE);
  });

  it('after showing min-selected error, selecting another format calls onFormatsChange and clears displayError', () => {
    const onFormatsChange = vi.fn();
    const { result, rerender } = renderHook(
      (props) =>
        useOutputFormatSection({
          selectedFormats: props.selectedFormats,
          onFormatsChange,
          minSelected: 1,
        }),
      { initialProps: { selectedFormats: [OUTPUT_FORMAT_ID_PDF] as string[] } },
    );

    act(() => {
      result.current.handleChange(OUTPUT_FORMAT_ID_PDF, false);
    });
    expect(onFormatsChange).not.toHaveBeenCalled();
    expect(result.current.displayError).toBe(OUTPUT_FORMAT_MIN_SELECTED_MESSAGE);

    rerender({ selectedFormats: [OUTPUT_FORMAT_ID_PDF] });
    act(() => {
      result.current.handleChange(OUTPUT_FORMAT_ID_WORD, true);
    });
    expect(onFormatsChange).toHaveBeenCalledWith([OUTPUT_FORMAT_ID_PDF, OUTPUT_FORMAT_ID_WORD]);
    expect(result.current.displayError).toBeUndefined();
  });

  it('error prop takes precedence over showMinSelectedError', () => {
    const onFormatsChange = vi.fn();
    const { result } = renderHook(() =>
      useOutputFormatSection({
        selectedFormats: [OUTPUT_FORMAT_ID_PDF],
        onFormatsChange,
        minSelected: 1,
        error: 'Prop error',
      }),
    );

    act(() => {
      result.current.handleChange(OUTPUT_FORMAT_ID_PDF, false);
    });

    expect(result.current.displayError).toBe('Prop error');
  });
});
