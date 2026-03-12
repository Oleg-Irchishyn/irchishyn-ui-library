import '@testing-library/jest-dom/vitest';
import React from 'react';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { useSearchTextBox } from '../useSearchTextBox';

describe('useSearchTextBox', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns localValue synced to value and showClearButton false when empty', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useSearchTextBox({ value: '', onChange }));

    expect(result.current.localValue).toBe('');
    expect(result.current.showClearButton).toBe(false);
  });

  it('syncs localValue when value prop changes', () => {
    const onChange = vi.fn();
    const { result, rerender } = renderHook((props) => useSearchTextBox(props), {
      initialProps: { value: '', onChange },
    });

    expect(result.current.localValue).toBe('');

    rerender({ value: 'external', onChange });
    expect(result.current.localValue).toBe('external');
  });

  it('updates localValue and calls onChange after debounce when handleChange is called', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useSearchTextBox({ value: '', onChange, debounceMs: 300 }));

    act(() => {
      result.current.handleChange({
        target: { value: 'hello' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.localValue).toBe('hello');
    expect(onChange).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('hello');
  });

  it('calls onChange immediately when debounceMs is 0', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useSearchTextBox({ value: '', onChange, debounceMs: 0 }));

    act(() => {
      result.current.handleChange({
        target: { value: 'instant' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.localValue).toBe('instant');
    expect(onChange).toHaveBeenCalledWith('instant');
  });

  it('handleClear clears localValue, calls onChange with empty string and onClear', () => {
    const onChange = vi.fn();
    const onClear = vi.fn();
    const { result } = renderHook(() =>
      useSearchTextBox({ value: 'some text', onChange, onClear }),
    );

    expect(result.current.localValue).toBe('some text');
    expect(result.current.showClearButton).toBe(true);

    act(() => {
      result.current.handleClear();
    });

    expect(result.current.localValue).toBe('');
    expect(result.current.showClearButton).toBe(false);
    expect(onChange).toHaveBeenCalledWith('');
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('showClearButton is true when localValue is non-empty', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useSearchTextBox({ value: 'x', onChange }));

    expect(result.current.showClearButton).toBe(true);
  });

  it('clears pending debounce timer on unmount', () => {
    const onChange = vi.fn();
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
    const { result, unmount } = renderHook(() =>
      useSearchTextBox({ value: '', onChange, debounceMs: 300 }),
    );

    act(() => {
      result.current.handleChange({
        target: { value: 'pending' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('clears pending debounce timer when handleClear is called', () => {
    const onChange = vi.fn();
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
    const { result } = renderHook(() => useSearchTextBox({ value: '', onChange, debounceMs: 300 }));

    act(() => {
      result.current.handleChange({
        target: { value: 'queued-value' },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(onChange).not.toHaveBeenCalled();

    act(() => {
      result.current.handleClear();
    });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(clearTimeoutSpy).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith('');
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
