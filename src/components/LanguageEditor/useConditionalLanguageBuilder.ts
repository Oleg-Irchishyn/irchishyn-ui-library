import { useCallback, useMemo, useState } from 'react';

import { isInRangeOperator, isValueLessOperator } from './constants';
import type {
  ConditionClause,
  UseConditionalLanguageBuilderParams,
  ValidationResult,
} from './types';
import { buildConditionalString } from './utils/buildConditionalString';
import { validateConditionalBuilder } from './utils/languageEditorUtils';

const EMPTY_CLAUSE: ConditionClause = {
  fieldName: '',
  operatorKey: '',
  value: '',
  content: '',
};

function isClauseValid(clause: ConditionClause): boolean {
  const valueLess = isValueLessOperator(clause.operatorKey);
  const inRange = isInRangeOperator(clause.operatorKey);
  return (
    Boolean(clause.fieldName) &&
    Boolean(clause.operatorKey) &&
    (valueLess || (clause.value.trim() !== '' && (!inRange || (clause.value2 ?? '').trim() !== '')))
  );
}

export function useConditionalLanguageBuilder({
  fieldConfig,
  onClose,
  onInsertConditional,
}: UseConditionalLanguageBuilderParams) {
  const [ifClause, setIfClause] = useState<ConditionClause>({ ...EMPTY_CLAUSE });
  const [elseIfClauses, setElseIfClauses] = useState<ConditionClause[]>([]);
  const [includeElse, setIncludeElse] = useState(false);
  const [elseContent, setElseContent] = useState('');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  const resetState = useCallback(() => {
    setIfClause({ ...EMPTY_CLAUSE });
    setElseIfClauses([]);
    setIncludeElse(false);
    setElseContent('');
    setValidationResult(null);
  }, []);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [onClose, resetState]);

  const handleInsert = useCallback(() => {
    if (!ifClause.fieldName) return;
    const text = buildConditionalString(ifClause, elseIfClauses, elseContent, includeElse);
    onInsertConditional(text);
    handleClose();
  }, [ifClause, elseIfClauses, elseContent, includeElse, onInsertConditional, handleClose]);

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

  const handleValidateClick = useCallback(() => {
    const result = validateConditionalBuilder(
      ifClause,
      elseIfClauses,
      includeElse,
      elseContent,
      fieldConfig,
    );
    setValidationResult(result);
  }, [ifClause, elseIfClauses, includeElse, elseContent, fieldConfig]);

  const handleClearValidation = useCallback(() => {
    setValidationResult(null);
  }, []);

  return useMemo(
    () => ({
      ifClause,
      setIfClause,
      elseIfClauses,
      includeElse,
      setIncludeElse,
      elseContent,
      setElseContent,
      handleClose,
      handleInsert,
      addElseIf,
      removeElseIf,
      updateElseIf,
      canInsert,
      resetState,
      validationResult,
      handleValidateClick,
      handleClearValidation,
    }),
    [
      ifClause,
      elseIfClauses,
      includeElse,
      elseContent,
      handleClose,
      handleInsert,
      addElseIf,
      removeElseIf,
      updateElseIf,
      canInsert,
      resetState,
      validationResult,
      handleValidateClick,
      handleClearValidation,
    ],
  );
}
