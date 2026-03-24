import { MULTI_SELECT_LABELS, MULTI_SELECT_LAYOUT } from './constants';
import type { MultiSelectOption } from './types';

/**
 * Returns the label displayed on the trigger button.
 *
 * - No selection or all selected → placeholder (e.g. "All Sponsors")
 * - 1..maxDisplayNames selected → comma-joined option labels
 * - More than maxDisplayNames selected → "{count} Selected"
 */
export function getTriggerLabel(
  selectedValues: string[],
  options: MultiSelectOption[],
  placeholder: string = MULTI_SELECT_LABELS.DEFAULT_PLACEHOLDER,
  maxDisplayNames: number = MULTI_SELECT_LAYOUT.DEFAULT_MAX_DISPLAY_NAMES,
): string {
  if (selectedValues.length === 0 || selectedValues.length === options.length) {
    return placeholder;
  }

  if (selectedValues.length <= maxDisplayNames) {
    const selectedLabels = selectedValues
      .map((v) => options.find((o) => o.value === v)?.label ?? v)
      .filter(Boolean);
    return selectedLabels.join(', ');
  }

  return `${selectedValues.length} ${MULTI_SELECT_LABELS.SELECTED_COUNT_SUFFIX}`;
}

/**
 * Filters options by search text (case-insensitive substring match).
 */
export function filterOptions(
  options: MultiSelectOption[],
  searchText: string,
): MultiSelectOption[] {
  const trimmed = searchText.trim().toLowerCase();
  if (!trimmed) return options;
  return options.filter((o) => o.label.toLowerCase().includes(trimmed));
}
