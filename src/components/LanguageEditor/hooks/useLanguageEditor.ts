import { useCallback, useEffect, useRef, useState } from 'react';

import type { FieldDefinition, ValidationResult } from '../types';
import {
  formatConditionalSyntax,
  formatFieldReference,
  stripConditionalFormatting,
  validateContent,
} from '../utils/languageEditorUtils';

/** Get character offsets of the selection within the editor (so we can restore after DOM is replaced on blur). */
function getSelectionOffsets(editor: HTMLElement, range: Range): { start: number; end: number } {
  const pre = document.createRange();
  pre.setStart(editor, 0);
  pre.setEnd(range.startContainer, range.startOffset);
  const start = pre.toString().length;
  const end = start + range.toString().length;
  return { start, end };
}

/** Set selection in editor at the given character offsets (works after innerHTML replace). */
function setSelectionAtOffsets(
  editor: HTMLElement,
  startOffset: number,
  endOffset: number,
): boolean {
  const start = getNodeAndOffsetAtCharOffset(editor, startOffset);
  const end = getNodeAndOffsetAtCharOffset(editor, endOffset);
  if (!start || !end) return false;
  try {
    const range = document.createRange();
    range.setStart(start.node, start.offset);
    range.setEnd(end.node, end.offset);
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
      return true;
    }
  } catch {
    // Invalid range (e.g. reversed)
  }
  return false;
}

function getNodeAndOffsetAtCharOffset(
  editor: HTMLElement,
  charOffset: number,
): { node: Node; offset: number } | null {
  let count = 0;
  function walk(node: Node): { node: Node; offset: number } | null {
    if (node.nodeType === Node.TEXT_NODE) {
      const len = (node.textContent ?? '').length;
      if (charOffset <= count + len) return { node, offset: Math.min(charOffset - count, len) };
      count += len;
      return null;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      if (el.tagName === 'BR') {
        if (charOffset <= count) return { node: node.parentNode!, offset: getChildIndex(node) };
        count += 1;
        return null;
      }
    }
    for (let i = 0; i < node.childNodes.length; i++) {
      const found = walk(node.childNodes[i]);
      if (found) return found;
    }
    return null;
  }
  const found = walk(editor);
  if (found) return found;
  if (charOffset <= count) return { node: editor, offset: editor.childNodes.length };
  return null;
}

function getChildIndex(node: Node): number {
  const parent = node.parentNode;
  if (!parent) return 0;
  for (let i = 0; i < parent.childNodes.length; i++) {
    if (parent.childNodes[i] === node) return i;
  }
  return 0;
}

function getEditorTextLength(editor: HTMLElement): number {
  let count = 0;
  function walk(node: Node): void {
    if (node.nodeType === Node.TEXT_NODE) {
      count += (node.textContent ?? '').length;
      return;
    }
    if (node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName === 'BR') {
      count += 1;
      return;
    }
    for (let i = 0; i < node.childNodes.length; i++) walk(node.childNodes[i]);
  }
  walk(editor);
  return count;
}

export interface UseLanguageEditorParams {
  content: string;
  onChange?: (content: string) => void;
  onValidate?: (result: ValidationResult) => void;
  fieldConfig: FieldDefinition[];
  readOnly?: boolean;
}

export interface UseLanguageEditorReturn {
  editorRef: React.RefObject<HTMLDivElement | null>;
  fieldDropdownAnchor: HTMLElement | null;
  fieldDropdownOpen: boolean;
  showConditionBuilder: boolean;
  validationResult: ValidationResult | null;
  handleInput: () => void;
  handleBlur: () => void;
  handleBold: () => void;
  handleItalic: () => void;
  handleUnderline: () => void;
  handleInsertFieldMouseDown: () => void;
  handleInsertFieldClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleFieldDropdownClose: () => void;
  handleInsertField: (fieldName: string) => void;
  handleConditionalClick: () => void;
  handleConditionalClose: () => void;
  handleInsertConditional: (conditionalText: string) => void;
  handleValidateClick: () => void;
  handleClearValidation: () => void;
  getFormattedContent: () => string;
  syncEditorContent: () => void;
}

export function useLanguageEditor({
  content,
  onChange,
  onValidate,
  fieldConfig,
  readOnly,
}: UseLanguageEditorParams): UseLanguageEditorReturn {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const savedSelectionRef = useRef<Range | null>(null);
  /** Character offsets survive blur (innerHTML replace); range does not. */
  const savedOffsetsRef = useRef<{ start: number; end: number } | null>(null);
  /** After insert we set refs to "end"; ignore selectionchange briefly so we don't overwrite with wrong position when dropdown closes. */
  const lastInsertAtRef = useRef<number>(0);
  const SELECTION_SAVE_DEBOUNCE_MS = 400;
  /** True only after the user has clicked/typed in the editor since the last insert. If false, we insert at end (don't trust refs). */
  const userMovedCursorAfterInsertRef = useRef<boolean>(false);

  const [fieldDropdownAnchor, setFieldDropdownAnchor] = useState<HTMLElement | null>(null);
  const [showConditionBuilder, setShowConditionBuilder] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  const fieldDropdownOpen = Boolean(fieldDropdownAnchor);

  /** Save selection when it's in the editor and editor has focus (user moved cursor). Skip right after an insert. */
  useEffect(() => {
    if (readOnly) return;
    const onSelectionChange = () => {
      if (Date.now() - lastInsertAtRef.current < SELECTION_SAVE_DEBOUNCE_MS) return;
      const editor = editorRef.current;
      if (!editor || document.activeElement !== editor) return;
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);
      if (editor.contains(range.startContainer)) {
        savedSelectionRef.current = range.cloneRange();
        savedOffsetsRef.current = getSelectionOffsets(editor, range);
        userMovedCursorAfterInsertRef.current = true;
      }
    };
    document.addEventListener('selectionchange', onSelectionChange);
    return () => document.removeEventListener('selectionchange', onSelectionChange);
  }, [readOnly]);

  const saveSelection = useCallback(() => {
    const editor = editorRef.current;
    const selection = window.getSelection();
    if (editor && selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (editor.contains(range.startContainer)) {
        savedSelectionRef.current = range.cloneRange();
        savedOffsetsRef.current = getSelectionOffsets(editor, range);
      }
    }
  }, []);

  const restoreSelection = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    const len = getEditorTextLength(editor);
    const offsets = savedOffsetsRef.current;
    if (offsets) {
      const start = Math.min(offsets.start, len);
      const end = Math.min(offsets.end, len);
      if (setSelectionAtOffsets(editor, start, end)) return;
    }
    if (savedSelectionRef.current) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        try {
          selection.addRange(savedSelectionRef.current);
          if (editor.contains(selection.getRangeAt(0).startContainer)) return;
        } catch {
          // Range may be detached after blur
        }
      }
    }
    // Default: paste at end of editor when user hasn't clicked elsewhere after last insert
    setSelectionAtOffsets(editor, len, len);
    savedOffsetsRef.current = { start: len, end: len };
    savedSelectionRef.current = null;
  }, []);

  const execCommand = useCallback(
    (command: string) => {
      if (readOnly) return;
      document.execCommand(command, false);
      editorRef.current?.focus();
      if (editorRef.current && onChange) {
        onChange(stripConditionalFormatting(editorRef.current.innerHTML));
      }
    },
    [onChange, readOnly],
  );

  const handleBold = useCallback(() => execCommand('bold'), [execCommand]);
  const handleItalic = useCallback(() => execCommand('italic'), [execCommand]);
  const handleUnderline = useCallback(() => execCommand('underline'), [execCommand]);

  const handleInput = useCallback(() => {
    if (editorRef.current && onChange) {
      const plainContent = stripConditionalFormatting(editorRef.current.innerHTML);
      onChange(plainContent);
    }
  }, [onChange]);

  const handleBlur = useCallback(() => {
    if (editorRef.current) {
      const plainContent = stripConditionalFormatting(editorRef.current.innerHTML);
      const formattedContent = formatConditionalSyntax(plainContent);
      if (editorRef.current.innerHTML !== formattedContent) {
        editorRef.current.innerHTML = formattedContent;
        // Range is now detached; keep offsets (they still match the new DOM’s logical content)
        savedSelectionRef.current = null;
      }
    }
  }, []);

  /** Save selection on mousedown so it's captured before the button takes focus (insert at cursor). */
  const handleInsertFieldMouseDown = useCallback(() => {
    if (readOnly) return;
    saveSelection();
  }, [readOnly, saveSelection]);

  const handleInsertFieldClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (readOnly) return;
      setFieldDropdownAnchor(event.currentTarget);
    },
    [readOnly],
  );

  const handleFieldDropdownClose = useCallback(() => {
    setFieldDropdownAnchor(null);
  }, []);

  /** If range is inside a non-editable token (condition/field), move it to after that token. */
  const ensureRangeOutsideTokens = useCallback((range: Range): void => {
    let node: Node | null = range.startContainer;
    if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
      node = node.parentElement;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    let el: Element | null = node as Element;
    const editor = editorRef.current;
    if (!editor) return;
    while (el && el !== editor) {
      if (
        el.getAttribute?.('data-condition') != null ||
        el.getAttribute?.('data-field') === 'true'
      ) {
        range.setStartAfter(el);
        range.setEndAfter(el);
        return;
      }
      el = el.parentElement;
    }
  }, []);

  const handleInsertField = useCallback(
    (fieldName: string) => {
      if (readOnly) return;

      const editor = editorRef.current;
      if (!editor) {
        setFieldDropdownAnchor(null);
        return;
      }

      if (!userMovedCursorAfterInsertRef.current) {
        const len = getEditorTextLength(editor);
        setSelectionAtOffsets(editor, len, len);
        savedOffsetsRef.current = { start: len, end: len };
        savedSelectionRef.current = null;
      } else {
        restoreSelection();
      }

      const selection = window.getSelection();
      if (!selection) {
        setFieldDropdownAnchor(null);
        return;
      }

      let range: Range;
      if (selection.rangeCount > 0) {
        range = selection.getRangeAt(0);
        const rangeInEditor =
          editor.contains(range.startContainer) && editor.contains(range.endContainer);
        if (!rangeInEditor) {
          range = document.createRange();
          range.selectNodeContents(editor);
          range.collapse(false);
        } else {
          ensureRangeOutsideTokens(range);
          if (!editor.contains(range.startContainer) || !editor.contains(range.endContainer)) {
            range = document.createRange();
            range.selectNodeContents(editor);
            range.collapse(false);
          }
        }
      } else {
        range = document.createRange();
        range.selectNodeContents(editor);
        range.collapse(false);
      }

      const fieldText = document.createTextNode(formatFieldReference(fieldName));
      range.deleteContents();
      range.insertNode(fieldText);
      range.setStartAfter(fieldText);
      range.setEndAfter(fieldText);
      selection.removeAllRanges();
      selection.addRange(range);

      setFieldDropdownAnchor(null);
      editor.focus();

      const len = getEditorTextLength(editor);
      savedOffsetsRef.current = { start: len, end: len };
      savedSelectionRef.current = null;
      lastInsertAtRef.current = Date.now();
      userMovedCursorAfterInsertRef.current = false;

      if (onChange) {
        onChange(stripConditionalFormatting(editor.innerHTML));
      }
    },
    [onChange, readOnly, restoreSelection, ensureRangeOutsideTokens],
  );

  const handleConditionalClick = useCallback(() => {
    if (readOnly) return;
    saveSelection();
    setShowConditionBuilder(true);
  }, [readOnly, saveSelection]);

  const handleConditionalClose = useCallback(() => {
    setShowConditionBuilder(false);
  }, []);

  const handleInsertConditional = useCallback(
    (conditionalText: string) => {
      if (readOnly) return;

      const editor = editorRef.current;
      if (!editor) return;

      if (!userMovedCursorAfterInsertRef.current) {
        const len = getEditorTextLength(editor);
        setSelectionAtOffsets(editor, len, len);
        savedOffsetsRef.current = { start: len, end: len };
        savedSelectionRef.current = null;
      } else {
        restoreSelection();
      }

      const selection = window.getSelection();
      if (
        selection &&
        selection.rangeCount > 0 &&
        editor.contains(selection.getRangeAt(0).startContainer)
      ) {
        const range = selection.getRangeAt(0);
        const textNode = document.createTextNode(conditionalText);
        range.deleteContents();
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
      } else if (editor) {
        editor.focus();
        const textNode = document.createTextNode(conditionalText);
        editor.appendChild(textNode);
      }

      setShowConditionBuilder(false);
      editor?.focus();

      if (editor && onChange) {
        onChange(stripConditionalFormatting(editor.innerHTML));
      }

      userMovedCursorAfterInsertRef.current = false;

      setTimeout(() => {
        if (editorRef.current) {
          const plainContent = stripConditionalFormatting(editorRef.current.innerHTML);
          editorRef.current.innerHTML = formatConditionalSyntax(plainContent);
          const len = getEditorTextLength(editorRef.current);
          setSelectionAtOffsets(editorRef.current, len, len);
          savedOffsetsRef.current = { start: len, end: len };
          savedSelectionRef.current = null;
          lastInsertAtRef.current = Date.now();
        }
      }, 10);
    },
    [onChange, readOnly, restoreSelection],
  );

  const handleValidateClick = useCallback(() => {
    const result = validateContent(content, fieldConfig);
    setValidationResult(result);
    onValidate?.(result);
  }, [content, fieldConfig, onValidate]);

  const handleClearValidation = useCallback(() => {
    setValidationResult(null);
  }, []);

  const getFormattedContent = useCallback(() => {
    return formatConditionalSyntax(content);
  }, [content]);

  const syncEditorContent = useCallback(() => {
    if (!editorRef.current) return;
    const currentStripped = stripConditionalFormatting(editorRef.current.innerHTML);
    if (currentStripped === content) return;
    // Never overwrite with shorter content: parent may not have flushed onChange yet (e.g. after Insert Field), so we’d truncate and break “paste at end”
    if (content.length < currentStripped.length) return;
    const formattedValue = formatConditionalSyntax(content);
    editorRef.current.innerHTML = formattedValue;
    savedSelectionRef.current = null;
    const len = getEditorTextLength(editorRef.current);
    savedOffsetsRef.current = { start: len, end: len };
  }, [content]);

  return {
    editorRef,
    fieldDropdownAnchor,
    fieldDropdownOpen,
    showConditionBuilder,
    validationResult,
    handleInput,
    handleBlur,
    handleBold,
    handleItalic,
    handleUnderline,
    handleInsertFieldMouseDown,
    handleInsertFieldClick,
    handleFieldDropdownClose,
    handleInsertField,
    handleConditionalClick,
    handleConditionalClose,
    handleInsertConditional,
    handleValidateClick,
    handleClearValidation,
    getFormattedContent,
    syncEditorContent,
  };
}
