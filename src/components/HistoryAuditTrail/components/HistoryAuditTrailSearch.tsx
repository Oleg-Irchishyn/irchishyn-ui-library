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
      size="small"
      value={searchValue}
      placeholder="Search activity history..."
      onChange={handleSearchValueChange}
      sx={(theme) => ({
        maxWidth: 225,
        height: HISTORY_AUDIT_LAYOUT.TOOLBAR_INPUT_HEIGHT,
        minHeight: HISTORY_AUDIT_LAYOUT.TOOLBAR_INPUT_HEIGHT,
        borderRadius: HISTORY_AUDIT_LAYOUT.TOOLBAR_BORDER_RADIUS,
        backgroundColor: theme.palette.background.paper,
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
        '& input': { textOverflow: 'ellipsis', overflow: 'hidden', padding: '5px 14px 5px 0' },
      })}
      startAdornment={
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      }
      inputProps={{ 'aria-label': 'Search activity history' }}
    />
  );
};
