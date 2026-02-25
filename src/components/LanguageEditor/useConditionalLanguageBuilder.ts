import { useCallback, useMemo, useState } from 'react';

import { isInRangeOperator, isValueLessOperator } from './constants';
import type { ConditionClause, UseConditionalLanguageBuilderParams } from './types';
import { buildConditionalString } from './utils/buildConditionalString';

const EMPTY_CLAUSE: ConditionClause = {
  fieldName: '',
  operatorKey: 'equals',
  value: '',
  content: '',
};

function isClauseValid(clause: ConditionClause): boolean {
  const valueLess = isValueLessOperator(clause.operatorKey);
  const inRange = isInRangeOperator(clause.operatorKey);
  return (
    Boolean(clause.fieldName) &&
    (valueLess || (clause.value.trim() !== '' && (!inRange || (clause.value2 ?? '').trim() !== '')))
  );
}

export function useConditionalLanguageBuilder({
  onClose,
  onInsertConditional,
}: UseConditionalLanguageBuilderParams) {
  const [ifClause, setIfClause] = useState<ConditionClause>({ ...EMPTY_CLAUSE });
  const [elseIfClauses, setElseIfClauses] = useState<ConditionClause[]>([]);
  const [elseContent, setElseContent] = useState('');

  const resetState = useCallback(() => {
    setIfClause({ ...EMPTY_CLAUSE });
    setElseIfClauses([]);
    setElseContent('');
  }, []);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [onClose, resetState]);

  const handleInsert = useCallback(() => {
    if (!ifClause.fieldName) return;
    const text = buildConditionalString(ifClause, elseIfClauses, elseContent);
    onInsertConditional(text);
    handleClose();
  }, [ifClause, elseIfClauses, elseContent, onInsertConditional, handleClose]);

  const addElseIf = useCallback(() => {
    setElseIfClauses((prev) => [...prev, { ...EMPTY_CLAUSE }]);
  }, []);

  const removeElseIf = useCallback((index: number) => {
    setElseIfClauses((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateElseIf = useCallback((index: number, clause: ConditionClause) => {
    setElseIfClauses((prev) => prev.map((item, i) => (i === index ? clause : item)));
  }, []);

  const canInsert = useMemo(
    () => isClauseValid(ifClause) && elseIfClauses.every(isClauseValid),
    [ifClause, elseIfClauses],
  );

  return useMemo(
    () => ({
      ifClause,
      setIfClause,
      elseIfClauses,
      elseContent,
      setElseContent,
      handleClose,
      handleInsert,
      addElseIf,
      removeElseIf,
      updateElseIf,
      canInsert,
      resetState,
    }),
    [
      ifClause,
      elseIfClauses,
      elseContent,
      handleClose,
      handleInsert,
      addElseIf,
      removeElseIf,
      updateElseIf,
      canInsert,
      resetState,
    ],
  );
}
