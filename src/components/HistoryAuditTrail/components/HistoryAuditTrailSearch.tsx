import { InputAdornment, OutlinedInput } from '@mui/material';

import { HISTORY_AUDIT_LAYOUT } from '../constants';
import { SearchIcon } from './HistoryAuditTrailIcons';

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
      sx={(theme) => ({
        maxWidth: 225,
        height: HISTORY_AUDIT_LAYOUT.TOOLBAR_INPUT_HEIGHT,
        minHeight: HISTORY_AUDIT_LAYOUT.TOOLBAR_INPUT_HEIGHT,
        borderRadius: HISTORY_AUDIT_LAYOUT.TOOLBAR_BORDER_RADIUS,
        backgroundColor:
          theme.palette.mode === 'dark'
            ? theme.palette.background.paper
            : theme.palette.common.white,
        color: theme.palette.text.primary,
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.divider,
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.divider,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.primary.main,
          borderWidth: 1,
        },
        '& input': {
          padding: '5px 14px 5px 0',
          fontSize: '14px',
          color: theme.palette.text.primary,
        },
        '& input::placeholder': {
          color: theme.palette.text.secondary,
          opacity: 1,
          textOverflow: 'clip',
        },
      })}
      startAdornment={
        <InputAdornment position="start" sx={(theme) => ({ color: theme.palette.text.secondary })}>
          <SearchIcon />
        </InputAdornment>
      }
      inputProps={{ 'aria-label': 'Search activity history' }}
    />
  );
};
