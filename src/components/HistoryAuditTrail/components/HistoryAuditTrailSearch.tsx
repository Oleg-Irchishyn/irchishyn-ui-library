import { InputAdornment, OutlinedInput } from '@mui/material';

import { SearchIcon } from './HistoryAuditTrailIcons';
import { historyAuditSearchAdornmentStyles, historyAuditSearchInputStyles } from './styles';

import type { HistoryAuditTrailSearchProps } from '../types';

export const HistoryAuditTrailSearch = ({
  searchValue = '',
  onSearchValueChange,
}: HistoryAuditTrailSearchProps) => {
  const handleSearchValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchValueChange?.(event.target.value);
  };

  return (
    <OutlinedInput
      data-testid="history-audit-trail-search-input"
      size="small"
      value={searchValue}
      placeholder="Search activity history..."
      onChange={handleSearchValueChange}
      sx={historyAuditSearchInputStyles}
      startAdornment={
        <InputAdornment position="start" sx={historyAuditSearchAdornmentStyles}>
          <SearchIcon />
        </InputAdornment>
      }
      inputProps={{ 'aria-label': 'Search activity history' }}
    />
  );
};
