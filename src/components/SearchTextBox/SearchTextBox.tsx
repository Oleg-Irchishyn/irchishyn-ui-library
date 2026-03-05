import React from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { Search as SearchIconLucide, X as CloseIconLucide } from 'lucide-react';

import { SEARCH_TEXT_BOX_DEFAULT_DEBOUNCE_MS } from './constants';
import { getSearchTextBoxBaseStyles } from './styles';
import type { SearchTextBoxProps } from './types';
import { useSearchTextBox } from './useSearchTextBox';

const SearchIcon = () => <SearchIconLucide size={16} />;
const ClearIcon = () => <CloseIconLucide size={16} />;

export const SearchTextBox = ({
  placeholder = 'Search...',
  value,
  onChange,
  debounceMs = SEARCH_TEXT_BOX_DEFAULT_DEBOUNCE_MS,
  onClear,
  ariaLabel,
  size = 'small',
  sx,
  inputProps,
  ...rest
}: SearchTextBoxProps) => {
  const { localValue, handleChange, handleClear, showClearButton } = useSearchTextBox({
    value,
    onChange,
    debounceMs,
    onClear,
  });

  const resolvedAriaLabel = ariaLabel ?? placeholder ?? 'Search';

  return (
    <TextField
      data-testid="search-text-box-input"
      value={localValue}
      onChange={handleChange}
      placeholder={placeholder}
      size={size}
      variant="outlined"
      fullWidth={false}
      inputProps={{
        'aria-label': resolvedAriaLabel,
        ...inputProps,
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment
            position="start"
            sx={(theme) => ({ color: theme.palette.text.secondary })}
          >
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: showClearButton ? (
          <InputAdornment position="end">
            <IconButton
              data-testid="search-text-box-clear"
              aria-label="Clear search"
              size="small"
              onClick={handleClear}
              sx={(theme) => ({ color: theme.palette.text.secondary })}
              edge="end"
            >
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
      sx={
        (sx ? [getSearchTextBoxBaseStyles(), sx] : getSearchTextBoxBaseStyles()) as SxProps<Theme>
      }
      {...rest}
    />
  );
};
