import { Box, InputAdornment, OutlinedInput } from '@mui/material';

import { SearchIcon } from './HistoryAuditTrailIcons';
import { HistoryAuditTrailDownloadExcelButton } from './HistoryAuditTrailDownloadExcelButton';

import type { HistoryAuditTrailSearchProps } from '../types';

export const HistoryAuditTrailSearch = ({
  searchValue = '',
  onSearchValueChange,
  onDownloadExcel,
  enableExport = false,
}: HistoryAuditTrailSearchProps) => {
  const handleSearchValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchValueChange?.(event.target.value);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
      <OutlinedInput
        size="small"
        value={searchValue}
        placeholder="Search"
        onChange={handleSearchValueChange}
        sx={{ maxWidth: 260, '& input': { textOverflow: 'ellipsis', overflow: 'hidden' } }}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
        inputProps={{ 'aria-label': 'Search activity history' }}
      />
      {enableExport ? <HistoryAuditTrailDownloadExcelButton onClick={onDownloadExcel} /> : null}
    </Box>
  );
};
