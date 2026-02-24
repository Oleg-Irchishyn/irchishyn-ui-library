import { useMemo, useState } from 'react';
import {
  Box,
  Chip,
  InputAdornment,
  ListItemText,
  Menu,
  MenuItem,
  OutlinedInput,
} from '@mui/material';
import { Search as SearchIcon } from 'lucide-react';

import { info, neutral, primary } from '@gen2fund/platform.style';

import { LANGUAGE_EDITOR_LAYOUT, LANGUAGE_EDITOR_LABELS } from '../constants';
import type { FieldDefinition, FieldInsertDropdownProps, FieldType } from '../types';

const FIELD_TYPE_BADGE_COLORS: Record<FieldType, { bg: string; text: string }> = {
  Dimension: { bg: info.light, text: info.dark },
  Measure: { bg: primary.light, text: primary.dark },
  Boolean: { bg: neutral[300], text: neutral[700] },
};

function formatFieldLabel(name: string): string {
  return `<<${name}>>`;
}

function filterFields(fields: FieldDefinition[], searchTrim: string): FieldDefinition[] {
  if (!searchTrim) return fields;
  const lower = searchTrim.toLowerCase();
  return fields.filter(
    (f) => f.name.toLowerCase().includes(lower) || f.displayName.toLowerCase().includes(lower),
  );
}

export const FieldInsertDropdown = ({
  fieldConfig,
  anchorEl,
  onClose,
  onInsertField,
  open,
  id = 'field-insert-dropdown',
}: FieldInsertDropdownProps) => {
  const [searchValue, setSearchValue] = useState('');

  const filteredFields = useMemo(
    () => filterFields(fieldConfig, searchValue.trim()),
    [fieldConfig, searchValue],
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleSelectField = (fieldName: string) => {
    onInsertField(fieldName);
    onClose();
    setSearchValue('');
  };

  const handleClose = () => {
    setSearchValue('');
    onClose();
  };

  return (
    <Menu
      id={id}
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      PaperProps={{
        sx: (theme) => ({
          minWidth: 280,
          maxWidth: 360,
          borderRadius: 1,
          mt: 0.5,
          boxShadow: theme.shadows[4],
        }),
      }}
      MenuListProps={{
        sx: { py: 0 },
        'aria-label': 'Insert field',
      }}
    >
      <Box sx={{ px: 1.5, pt: 1.5, pb: 1 }}>
        <OutlinedInput
          size="small"
          value={searchValue}
          onChange={handleSearchChange}
          placeholder={LANGUAGE_EDITOR_LABELS.SEARCH_FIELDS_PLACEHOLDER}
          fullWidth
          sx={(theme) => ({
            height: LANGUAGE_EDITOR_LAYOUT.SEARCH_INPUT_HEIGHT,
            borderRadius: LANGUAGE_EDITOR_LAYOUT.TOOLBAR_BORDER_RADIUS,
            backgroundColor: theme.palette.grey[100],
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
          })}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon size={18} />
            </InputAdornment>
          }
          inputProps={{
            'aria-label': LANGUAGE_EDITOR_LABELS.SEARCH_FIELDS_PLACEHOLDER,
          }}
        />
      </Box>
      <Box
        sx={{
          maxHeight: LANGUAGE_EDITOR_LAYOUT.DROPDOWN_LIST_MAX_HEIGHT,
          overflowY: 'auto',
          py: 0,
        }}
      >
        {filteredFields.length === 0 ? (
          <Box
            sx={{
              py: 3,
              px: 2,
              textAlign: 'center',
              color: 'text.secondary',
              fontSize: 14,
            }}
          >
            {LANGUAGE_EDITOR_LABELS.NO_FIELDS_FOUND}
          </Box>
        ) : (
          filteredFields.map((field) => {
            const badgeColors = FIELD_TYPE_BADGE_COLORS[field.type];
            return (
              <MenuItem
                key={field.name}
                onClick={() => handleSelectField(field.name)}
                sx={{ py: 1, minHeight: 'auto' }}
              >
                <ListItemText
                  primary={formatFieldLabel(field.name)}
                  primaryTypographyProps={{
                    sx: { fontFamily: 'monospace', fontSize: 13 },
                  }}
                />
                <Chip
                  label={field.type}
                  size="small"
                  sx={{
                    ml: 1,
                    height: 22,
                    fontSize: 11,
                    fontWeight: 600,
                    backgroundColor: badgeColors.bg,
                    color: badgeColors.text,
                    '& .MuiChip-label': { px: 1 },
                  }}
                />
              </MenuItem>
            );
          })
        )}
      </Box>
    </Menu>
  );
};
