import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const utilsMock = vi.hoisted(() => ({
  formatConditionalSyntax: vi.fn((value: string) => `<b>${value}</b>`),
  formatFieldReference: vi.fn((value: string) => `<<${value}>>`),
  stripConditionalFormatting: vi.fn((value: string) => value.replace(/<[^>]+>/g, '')),
  validateContent: vi.fn(() => ({ valid: true })),
}));

vi.mock('../../utils/languageEditorUtils', () => utilsMock);

import { useLanguageEditor } from '../useLanguageEditor';

type SelectionLike = {
  rangeCount: number;
  getRangeAt: (index: number) => Range;
  removeAllRanges: () => void;
  addRange: (range: Range) => void;
};

function createMockSelection(range: Range): SelectionLike {
  return {
    rangeCount: 1,
    getRangeAt: () => range,
    removeAllRanges: vi.fn(),
    addRange: vi.fn(),
  };
}

describe('useLanguageEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('opens/closes field dropdown and condition builder', () => {
    const { result } = renderHook(() =>
      useLanguageEditor({
        content: 'hello',
        fieldConfig: [],
      }),
    );

    const button = document.createElement('button');
    act(() => {
      result.current.handleInsertFieldClick({ currentTarget: button } as never);
    });
    expect(result.current.fieldDropdownOpen).toBe(true);

    act(() => {
      result.current.handleFieldDropdownClose();
    });
    expect(result.current.fieldDropdownOpen).toBe(false);

    act(() => {
      result.current.handleConditionalClick();
    });
    expect(result.current.showConditionBuilder).toBe(true);

    act(() => {
      result.current.handleConditionalClose();
    });
    expect(result.current.showConditionBuilder).toBe(false);
  });

  it('validates content and clears validation result', () => {
    const onValidate = vi.fn();
    const { result } = renderHook(() =>
      useLanguageEditor({
        content: 'hello',
        fieldConfig: [],
        onValidate,
      }),
    );

    act(() => {
      result.current.handleValidateClick();
    });

    expect(utilsMock.validateContent).toHaveBeenCalledWith('hello', []);
    expect(result.current.validationResult?.valid).toBe(true);
    expect(onValidate).toHaveBeenCalledWith({ valid: true });

    act(() => {
      result.current.handleClearValidation();
    });
    expect(result.current.validationResult).toBeNull();
  });

  it('syncs editor HTML from formatted content', () => {
    const { result } = renderHook(() =>
      useLanguageEditor({
        content: 'hello',
        fieldConfig: [],
      }),
    );

    const editor = document.createElement('div');
    editor.innerHTML = '';
    (result.current.editorRef as unknown as { current: HTMLDivElement | null }).current = editor;

    act(() => {
      result.current.syncEditorContent();
    });

    expect(utilsMock.formatConditionalSyntax).toHaveBeenCalledWith('hello');
    expect(editor.innerHTML).toBe('<b>hello</b>');
  });

  it('executes formatting and input/blur handlers with onChange updates', () => {
    const onChange = vi.fn();
    const execCommandMock = vi.fn();
    const originalExecCommand = document.execCommand;
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: execCommandMock,
    });

    const { result } = renderHook(() =>
      useLanguageEditor({
        content: 'hello',
        fieldConfig: [],
        onChange,
      }),
    );

    const editor = document.createElement('div');
    editor.innerHTML = '<div>hello</div>';
    (result.current.editorRef as unknown as { current: HTMLDivElement | null }).current = editor;

    act(() => {
      result.current.handleBold();
      result.current.handleItalic();
      result.current.handleUnderline();
    });

    expect(execCommandMock).toHaveBeenCalledWith('bold', false);
    expect(execCommandMock).toHaveBeenCalledWith('italic', false);
    expect(execCommandMock).toHaveBeenCalledWith('underline', false);
    expect(onChange).toHaveBeenCalled();

    act(() => {
      result.current.handleInput();
    });
    expect(onChange).toHaveBeenCalledWith('hello');

    editor.innerHTML = '<div>changed</div>';
    act(() => {
      result.current.handleBlur();
    });
    expect(utilsMock.formatConditionalSyntax).toHaveBeenCalledWith('changed');
    expect(editor.innerHTML).toBe('<b>changed</b>');

    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: originalExecCommand,
    });
  });

  it('inserts field token using saved/restored selection', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useLanguageEditor({
        content: 'hello',
        fieldConfig: [],
        onChange,
      }),
    );

    const editor = document.createElement('div');
    const textNode = document.createTextNode('start');
    editor.appendChild(textNode);
    document.body.appendChild(editor);
    (result.current.editorRef as unknown as { current: HTMLDivElement | null }).current = editor;

    const range = document.createRange();
    range.setStart(textNode, textNode.textContent?.length ?? 0);
    range.setEnd(textNode, textNode.textContent?.length ?? 0);
    const selection = createMockSelection(range);
    const originalGetSelection = window.getSelection;
    Object.defineProperty(window, 'getSelection', {
      configurable: true,
      value: () => selection,
    });

    const button = document.createElement('button');
    act(() => {
      result.current.handleInsertFieldClick({ currentTarget: button } as never);
    });

    act(() => {
      result.current.handleInsertField('Region');
    });

    expect(utilsMock.formatFieldReference).toHaveBeenCalledWith('Region');
    expect(editor.textContent?.includes('<<Region>>')).toBe(true);
    expect(onChange).toHaveBeenCalled();
    expect(result.current.fieldDropdownOpen).toBe(false);

    Object.defineProperty(window, 'getSelection', {
      configurable: true,
      value: originalGetSelection,
    });
  });

  it('inserts conditional text with and without selection, then formats asynchronously', () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useLanguageEditor({
        content: 'hello',
        fieldConfig: [],
        onChange,
      }),
    );

    const editor = document.createElement('div');
    const textNode = document.createTextNode('abc');
    editor.appendChild(textNode);
    document.body.appendChild(editor);
    (result.current.editorRef as unknown as { current: HTMLDivElement | null }).current = editor;

    const range = document.createRange();
    range.setStart(textNode, 1);
    range.setEnd(textNode, 1);
    const selectionWithRange = createMockSelection(range);
    const originalGetSelection = window.getSelection;
    Object.defineProperty(window, 'getSelection', {
      configurable: true,
      value: () => selectionWithRange,
    });

    act(() => {
      result.current.handleConditionalClick();
      result.current.handleInsertConditional('{{IF X EQUALS Y}}ok{{ELSE}}no{{ENDIF}}');
    });

    expect(onChange).toHaveBeenCalled();
    expect(result.current.showConditionBuilder).toBe(false);

    const noRangeSelection = {
      rangeCount: 0,
      getRangeAt: () => range,
      removeAllRanges: vi.fn(),
      addRange: vi.fn(),
    };
    Object.defineProperty(window, 'getSelection', {
      configurable: true,
      value: () => noRangeSelection,
    });

    act(() => {
      result.current.handleInsertConditional('SECOND');
    });

    act(() => {
      vi.runAllTimers();
    });
    expect(utilsMock.formatConditionalSyntax).toHaveBeenCalled();

    Object.defineProperty(window, 'getSelection', {
      configurable: true,
      value: originalGetSelection,
    });
    vi.useRealTimers();
  });

  it('returns formatted content helper result', () => {
    const { result } = renderHook(() =>
      useLanguageEditor({
        content: 'raw',
        fieldConfig: [],
      }),
    );

    expect(result.current.getFormattedContent()).toBe('<b>raw</b>');
  });

  it('respects readOnly mode by ignoring write actions', () => {
    const onChange = vi.fn();
    const execCommandMock = vi.fn();
    const originalExecCommand = document.execCommand;
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: execCommandMock,
    });

    const { result } = renderHook(() =>
      useLanguageEditor({
        content: 'readonly',
        fieldConfig: [],
        onChange,
        readOnly: true,
      }),
    );

    const button = document.createElement('button');
    act(() => {
      result.current.handleInsertFieldMouseDown();
      result.current.handleInsertFieldClick({ currentTarget: button } as never);
      result.current.handleConditionalClick();
      result.current.handleBold();
      result.current.handleItalic();
      result.current.handleUnderline();
      result.current.handleInsertField('Region');
      result.current.handleInsertConditional('IF BLOCK');
    });

    expect(result.current.fieldDropdownOpen).toBe(false);
    expect(result.current.showConditionBuilder).toBe(false);
    expect(execCommandMock).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();

    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: originalExecCommand,
    });
  });

  it('closes dropdown when insert-field is requested without editor or selection', () => {
    const { result } = renderHook(() =>
      useLanguageEditor({
        content: 'hello',
        fieldConfig: [],
      }),
    );

    const button = document.createElement('button');
    act(() => {
      result.current.handleInsertFieldClick({ currentTarget: button } as never);
    });
    expect(result.current.fieldDropdownOpen).toBe(true);

    act(() => {
      result.current.handleInsertField('Region');
    });
    expect(result.current.fieldDropdownOpen).toBe(false);

    const editor = document.createElement('div');
    (result.current.editorRef as unknown as { current: HTMLDivElement | null }).current = editor;
    const originalGetSelection = window.getSelection;
    Object.defineProperty(window, 'getSelection', {
      configurable: true,
      value: () => null,
    });

    act(() => {
      result.current.handleInsertFieldClick({ currentTarget: button } as never);
      result.current.handleInsertField('Amount');
    });
    expect(result.current.fieldDropdownOpen).toBe(false);

    Object.defineProperty(window, 'getSelection', {
      configurable: true,
      value: originalGetSelection,
    });
  });

  it('syncEditorContent keeps innerHTML unchanged when stripped content already matches', () => {
    const { result } = renderHook(() =>
      useLanguageEditor({
        content: 'same-content',
        fieldConfig: [],
      }),
    );

    const editor = document.createElement('div');
    editor.innerHTML = '<i>same-content</i>';
    (result.current.editorRef as unknown as { current: HTMLDivElement | null }).current = editor;

    act(() => {
      result.current.syncEditorContent();
    });

    expect(editor.innerHTML).toBe('<i>same-content</i>');
  });
});
