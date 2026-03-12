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

import { LANGUAGE_EDITOR_LABELS } from '../constants';
import type { FieldDefinition, FieldInsertDropdownProps, FieldType } from '../types';
import {
  getLanguageEditorFieldTypeChipStyles,
  languageEditorFieldEmptyStyles,
  languageEditorFieldListStyles,
  languageEditorFieldMenuItemStyles,
  languageEditorFieldMenuListStyles,
  languageEditorFieldMenuPaperStyles,
  languageEditorFieldPrimaryTextStyles,
  languageEditorFieldSearchInputStyles,
  languageEditorFieldSearchWrapStyles,
} from './styles';

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

  const handleSelectField = (fieldName: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
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
        sx: languageEditorFieldMenuPaperStyles,
      }}
      MenuListProps={{
        sx: languageEditorFieldMenuListStyles,
        'aria-label': 'Insert field',
      }}
    >
      <Box sx={languageEditorFieldSearchWrapStyles}>
        <OutlinedInput
          size="small"
          value={searchValue}
          onChange={handleSearchChange}
          placeholder={LANGUAGE_EDITOR_LABELS.SEARCH_FIELDS_PLACEHOLDER}
          fullWidth
          sx={languageEditorFieldSearchInputStyles}
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
      <Box sx={languageEditorFieldListStyles}>
        {filteredFields.length === 0 ? (
          <Box sx={languageEditorFieldEmptyStyles}>{LANGUAGE_EDITOR_LABELS.NO_FIELDS_FOUND}</Box>
        ) : (
          filteredFields.map((field) => {
            const badgeColors = FIELD_TYPE_BADGE_COLORS[field.type];
            return (
              <MenuItem
                key={field.name}
                onClick={(e) => handleSelectField(field.name, e)}
                sx={languageEditorFieldMenuItemStyles}
              >
                <ListItemText
                  primary={formatFieldLabel(field.name)}
                  primaryTypographyProps={{
                    sx: languageEditorFieldPrimaryTextStyles,
                  }}
                />
                <Chip
                  label={field.type}
                  size="small"
                  sx={getLanguageEditorFieldTypeChipStyles(badgeColors)}
                />
              </MenuItem>
            );
          })
        )}
      </Box>
    </Menu>
  );
};
