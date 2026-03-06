import '@testing-library/jest-dom/vitest';
import React from 'react';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useFileUpload } from '../useFileUpload';

function createFile(name: string, size: number, type = ''): File {
  return new File([new ArrayBuffer(size)], name, { type });
}

const defaultParams = {
  onFileSelect: vi.fn(),
  accept: '*/*',
  multiple: false,
  disabled: false,
};

describe('useFileUpload', () => {
  it('returns initial state: isDragOver false, error null, and stable handlers', () => {
    const { result } = renderHook(() => useFileUpload(defaultParams));

    expect(result.current.isDragOver).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.inputRef).toBeDefined();
    expect(result.current.inputRef.current).toBe(null);
    expect(typeof result.current.handleDragOver).toBe('function');
    expect(typeof result.current.handleDrop).toBe('function');
    expect(typeof result.current.handleBrowseClick).toBe('function');
  });

  it('handleDragOver sets isDragOver to true when not disabled', () => {
    const { result } = renderHook(() => useFileUpload({ ...defaultParams, disabled: false }));

    act(() => {
      result.current.handleDragOver({
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {},
      } as unknown as React.DragEvent);
    });

    expect(result.current.isDragOver).toBe(true);
  });

  it('handleDragOver does not set isDragOver when disabled', () => {
    const { result } = renderHook(() => useFileUpload({ ...defaultParams, disabled: true }));

    act(() => {
      result.current.handleDragOver({
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {},
      } as unknown as React.DragEvent);
    });

    expect(result.current.isDragOver).toBe(false);
  });

  it('handleDragLeave sets isDragOver to false', () => {
    const { result } = renderHook(() => useFileUpload(defaultParams));

    act(() => {
      result.current.handleDragOver({
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {},
      } as unknown as React.DragEvent);
    });
    expect(result.current.isDragOver).toBe(true);

    act(() => {
      result.current.handleDragLeave({
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.DragEvent);
    });
    expect(result.current.isDragOver).toBe(false);
  });

  it('handleDrop with valid file calls onFileSelect and clears drag state', () => {
    const onFileSelect = vi.fn();
    const file = createFile('doc.pdf', 100);
    const { result } = renderHook(() => useFileUpload({ ...defaultParams, onFileSelect }));

    act(() => {
      result.current.handleDragOver({
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {},
      } as unknown as React.DragEvent);
    });

    act(() => {
      result.current.handleDrop({
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: { files: [file] },
      } as unknown as React.DragEvent);
    });

    expect(result.current.isDragOver).toBe(false);
    expect(onFileSelect).toHaveBeenCalledWith(file);
    expect(result.current.error).toBe(null);
  });

  it('handleDrop when disabled does not call onFileSelect', () => {
    const onFileSelect = vi.fn();
    const file = createFile('doc.pdf', 100);
    const { result } = renderHook(() =>
      useFileUpload({ ...defaultParams, onFileSelect, disabled: true }),
    );

    act(() => {
      result.current.handleDrop({
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: { files: [file] },
      } as unknown as React.DragEvent);
    });

    expect(onFileSelect).not.toHaveBeenCalled();
  });

  it('handleInputChange with valid file calls onFileSelect', () => {
    const onFileSelect = vi.fn();
    const file = createFile('doc.pdf', 100);
    const { result } = renderHook(() => useFileUpload({ ...defaultParams, onFileSelect }));

    act(() => {
      result.current.handleInputChange({
        target: { files: [file], value: '' },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    expect(onFileSelect).toHaveBeenCalledWith(file);
  });

  it('handleInputChange with file over maxSizeBytes sets error', () => {
    const onFileSelect = vi.fn();
    const file = createFile('big.pdf', 1025);
    const { result } = renderHook(() =>
      useFileUpload({ ...defaultParams, onFileSelect, maxSizeBytes: 1024 }),
    );

    act(() => {
      result.current.handleInputChange({
        target: { files: [file], value: '' },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    expect(onFileSelect).not.toHaveBeenCalled();
    expect(result.current.error).toBe('File exceeds maximum size');
  });

  it('handleBrowseClick calls inputRef.current.click when not disabled', () => {
    const { result } = renderHook(() => useFileUpload(defaultParams));
    const input = document.createElement('input');
    const clickSpy = vi.spyOn(input, 'click');
    (result.current.inputRef as React.MutableRefObject<HTMLInputElement | null>).current = input;

    act(() => {
      result.current.handleBrowseClick();
    });

    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  it('handleBrowseClick does not call input click when disabled', () => {
    const { result } = renderHook(() => useFileUpload({ ...defaultParams, disabled: true }));
    const input = document.createElement('input');
    const clickSpy = vi.spyOn(input, 'click');
    (result.current.inputRef as React.MutableRefObject<HTMLInputElement | null>).current = input;

    act(() => {
      result.current.handleBrowseClick();
    });

    expect(clickSpy).not.toHaveBeenCalled();
    clickSpy.mockRestore();
  });
});
