import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useConditionalLanguageBuilder } from '../useConditionalLanguageBuilder';

describe('useConditionalLanguageBuilder', () => {
  it('manages else-if clauses and close behavior', () => {
    const onClose = vi.fn();
    const onInsertConditional = vi.fn();

    const { result } = renderHook(() =>
      useConditionalLanguageBuilder({
        fieldConfig: [],
        onClose,
        onInsertConditional,
      }),
    );

    expect(result.current.elseIfClauses).toEqual([]);

    act(() => {
      result.current.addElseIf();
    });
    expect(result.current.elseIfClauses.length).toBe(1);

    act(() => {
      result.current.removeElseIf(0);
    });
    expect(result.current.elseIfClauses.length).toBe(0);

    act(() => {
      result.current.handleClose();
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('builds and inserts conditional text when IF clause is valid', () => {
    const onClose = vi.fn();
    const onInsertConditional = vi.fn();

    const { result } = renderHook(() =>
      useConditionalLanguageBuilder({
        fieldConfig: [],
        onClose,
        onInsertConditional,
      }),
    );

    act(() => {
      result.current.setIfClause({
        fieldName: 'Region',
        operatorKey: 'EQUALS',
        value: 'EMEA',
        content: 'Region text',
      });
      result.current.setIncludeElse(true);
      result.current.setElseContent('Fallback');
    });

    expect(result.current.canInsert).toBe(true);

    act(() => {
      result.current.handleInsert();
    });

    expect(onInsertConditional).toHaveBeenCalledWith(
      '{{IF Region = EMEA}}Region text{{ELSE}}Fallback{{ENDIF}}',
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not insert when IF field is empty and supports update/validation handlers', () => {
    const onClose = vi.fn();
    const onInsertConditional = vi.fn();
    const fieldConfig = [
      { name: 'Region', displayName: 'Region', type: 'Dimension', dataType: 'text' },
    ] as never;

    const { result } = renderHook(() =>
      useConditionalLanguageBuilder({
        fieldConfig,
        onClose,
        onInsertConditional,
      }),
    );

    act(() => {
      result.current.addElseIf();
    });
    act(() => {
      result.current.updateElseIf(0, {
        fieldName: 'Region',
        operatorKey: 'EQUALS',
        value: 'APAC',
        content: 'else if content',
      });
    });
    expect(result.current.elseIfClauses[0].value).toBe('APAC');

    act(() => {
      result.current.handleInsert();
    });
    expect(onInsertConditional).not.toHaveBeenCalled();

    act(() => {
      result.current.handleValidateClick();
    });
    expect(result.current.validationResult).toBeTruthy();

    act(() => {
      result.current.handleClearValidation();
    });
    expect(result.current.validationResult).toBeNull();
  });

  it('computes canInsert false for invalid else-if clauses and resets state', () => {
    const { result } = renderHook(() =>
      useConditionalLanguageBuilder({
        fieldConfig: [],
        onClose: vi.fn(),
        onInsertConditional: vi.fn(),
      }),
    );

    act(() => {
      result.current.setIfClause({
        fieldName: 'Region',
        operatorKey: 'IS_EMPTY',
        value: '',
        content: 'if content',
      });
      result.current.addElseIf();
      result.current.updateElseIf(0, {
        fieldName: 'Region',
        operatorKey: 'EQUALS',
        value: '',
        content: 'missing value',
      });
    });

    expect(result.current.canInsert).toBe(false);

    act(() => {
      result.current.resetState();
    });
    expect(result.current.ifClause.fieldName).toBe('');
    expect(result.current.elseIfClauses).toEqual([]);
    expect(result.current.includeElse).toBe(false);
    expect(result.current.elseContent).toBe('');
  });
});
