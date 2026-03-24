import type { SelectDropdownOption } from './types';

/**
 * Filters options by search text (case-insensitive substring match on label).
 */
export function filterSelectOptions(
  options: SelectDropdownOption[],
  searchText: string,
): SelectDropdownOption[] {
  const trimmed = searchText.trim().toLowerCase();
  if (!trimmed) return options;
  return options.filter((o) => o.label.toLowerCase().includes(trimmed));
}
