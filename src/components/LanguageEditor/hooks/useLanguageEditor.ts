import { useCallback, useRef, useState } from 'react';

import type { FieldDefinition, ValidationResult } from '../types';
import {
  formatConditionalSyntax,
  formatFieldReference,
  stripConditionalFormatting,
  validateContent,
} from '../utils/languageEditorUtils';

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

  const [fieldDropdownAnchor, setFieldDropdownAnchor] = useState<HTMLElement | null>(null);
  const [showConditionBuilder, setShowConditionBuilder] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  const fieldDropdownOpen = Boolean(fieldDropdownAnchor);

  const saveSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedSelectionRef.current = selection.getRangeAt(0).cloneRange();
    }
  }, []);

  const restoreSelection = useCallback(() => {
    if (savedSelectionRef.current && editorRef.current) {
      editorRef.current.focus();
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(savedSelectionRef.current);
      }
    }
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
      }
    }
  }, []);

  const handleInsertFieldClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (readOnly) return;
      saveSelection();
      setFieldDropdownAnchor(event.currentTarget);
    },
    [readOnly, saveSelection],
  );

  const handleFieldDropdownClose = useCallback(() => {
    setFieldDropdownAnchor(null);
  }, []);

  const handleInsertField = useCallback(
    (fieldName: string) => {
      if (readOnly) return;
      restoreSelection();

      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const fieldText = document.createTextNode(formatFieldReference(fieldName));
        range.deleteContents();
        range.insertNode(fieldText);
        range.setStartAfter(fieldText);
        range.setEndAfter(fieldText);
        selection.removeAllRanges();
        selection.addRange(range);
      }

      setFieldDropdownAnchor(null);
      editorRef.current?.focus();

      if (editorRef.current && onChange) {
        onChange(stripConditionalFormatting(editorRef.current.innerHTML));
      }
    },
    [onChange, readOnly, restoreSelection],
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
      restoreSelection();

      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const textNode = document.createTextNode(conditionalText);
        range.deleteContents();
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
      } else if (editorRef.current) {
        editorRef.current.focus();
        const textNode = document.createTextNode(conditionalText);
        editorRef.current.appendChild(textNode);
      }

      setShowConditionBuilder(false);
      editorRef.current?.focus();
      savedSelectionRef.current = null;

      if (editorRef.current && onChange) {
        onChange(stripConditionalFormatting(editorRef.current.innerHTML));
      }

      setTimeout(() => {
        if (editorRef.current) {
          const plainContent = stripConditionalFormatting(editorRef.current.innerHTML);
          editorRef.current.innerHTML = formatConditionalSyntax(plainContent);
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
    if (editorRef.current) {
      const formattedValue = formatConditionalSyntax(content);
      const currentStripped = stripConditionalFormatting(editorRef.current.innerHTML);
      if (currentStripped !== content) {
        editorRef.current.innerHTML = formattedValue;
      }
    }
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
