import { useCallback } from 'react';
import { SearchTextBox } from '../../SearchTextBox';
import { historyAuditSearchInputStyles } from './styles';

import type { HistoryAuditTrailSearchProps } from '../types';

export const HistoryAuditTrailSearch = ({
  searchValue = '',
  onSearchValueChange,
}: HistoryAuditTrailSearchProps) => {
  const handleSearchValueChange = useCallback(
    (value: string) => onSearchValueChange?.(value),
    [onSearchValueChange],
  );

  return (
    <SearchTextBox
      data-testid="history-audit-trail-search-input"
      debounceMs={0}
      value={searchValue}
      placeholder="Search activity history..."
      onChange={handleSearchValueChange}
      sx={historyAuditSearchInputStyles}
      ariaLabel="Search activity history"
    />
  );
};
