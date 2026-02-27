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
        operatorKey: 'equals',
        value: 'EMEA',
        content: 'Region text',
      });
      result.current.setElseContent('Fallback');
    });

    expect(result.current.canInsert).toBe(true);

    act(() => {
      result.current.handleInsert();
    });

    expect(onInsertConditional).toHaveBeenCalledWith(
      '{{IF Region equals EMEA}}Region text{{ELSE}}Fallback{{ENDIF}}',
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
