import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useMultiSelectDropdown } from '../useMultiSelectDropdown';

const options = [
  { label: 'Acme Corp', value: 'acme' },
  { label: 'Omega Fund', value: 'omega' },
  { label: 'Zenith Partners', value: 'zenith' },
];

const buildHook = (overrides: Partial<Parameters<typeof useMultiSelectDropdown>[0]> = {}) => {
  const onChange = vi.fn();
  const result = renderHook(() =>
    useMultiSelectDropdown({
      options,
      selectedValues: [],
      onChange,
      placeholder: 'All Sponsors',
      maxDisplayNames: 2,
      ...overrides,
    }),
  );
  return { ...result, onChange };
};

describe('useMultiSelectDropdown', () => {
  describe('initial state', () => {
    it('starts closed with empty search text', () => {
      const { result } = buildHook();
      expect(result.current.isOpen).toBe(false);
      expect(result.current.anchorEl).toBeNull();
      expect(result.current.searchText).toBe('');
    });

    it('shows placeholder as triggerLabel when no items selected', () => {
      const { result } = buildHook();
      expect(result.current.triggerLabel).toBe('All Sponsors');
    });

    it('isAllSelected is false when nothing selected', () => {
      const { result } = buildHook();
      expect(result.current.isAllSelected).toBe(false);
    });

    it('isIndeterminate is false when nothing selected', () => {
      const { result } = buildHook();
      expect(result.current.isIndeterminate).toBe(false);
    });

    it('isSelectAllAvailable is true when nothing is selected', () => {
      const { result } = buildHook();
      expect(result.current.isSelectAllAvailable).toBe(true);
    });

    it('isDeselectAllAvailable is false when nothing is selected', () => {
      const { result } = buildHook();
      expect(result.current.isDeselectAllAvailable).toBe(false);
    });
  });

  describe('handleOpen / handleClose', () => {
    it('sets anchorEl and isOpen on handleOpen', () => {
      const { result } = buildHook();
      const fakeEl = document.createElement('button');
      act(() => {
        result.current.handleOpen({
          currentTarget: fakeEl,
        } as unknown as React.MouseEvent<HTMLElement>);
      });
      expect(result.current.isOpen).toBe(true);
      expect(result.current.anchorEl).toBe(fakeEl);
    });

    it('clears anchorEl and resets searchText on handleClose', () => {
      const { result } = buildHook();
      const fakeEl = document.createElement('button');
      act(() => {
        result.current.handleOpen({
          currentTarget: fakeEl,
        } as unknown as React.MouseEvent<HTMLElement>);
      });
      act(() => {
        result.current.handleSearchChange('acme');
      });
      act(() => {
        result.current.handleClose();
      });
      expect(result.current.isOpen).toBe(false);
      expect(result.current.anchorEl).toBeNull();
      expect(result.current.searchText).toBe('');
    });
  });

  describe('handleToggleOption', () => {
    it('adds value to selection when not present', () => {
      const { result, onChange } = buildHook({ selectedValues: [] });
      act(() => {
        result.current.handleToggleOption('acme');
      });
      expect(onChange).toHaveBeenCalledWith(['acme']);
    });

    it('removes value from selection when already present', () => {
      const { result, onChange } = buildHook({ selectedValues: ['acme', 'omega'] });
      act(() => {
        result.current.handleToggleOption('acme');
      });
      expect(onChange).toHaveBeenCalledWith(['omega']);
    });
  });

  describe('handleSelectAll', () => {
    it('selects all options', () => {
      const { result, onChange } = buildHook({ selectedValues: [] });
      act(() => {
        result.current.handleSelectAll();
      });
      expect(onChange).toHaveBeenCalledWith(['acme', 'omega', 'zenith']);
    });
  });

  describe('handleDeselectAll', () => {
    it('calls onChange with empty array', () => {
      const { result, onChange } = buildHook({ selectedValues: ['acme', 'omega'] });
      act(() => {
        result.current.handleDeselectAll();
      });
      expect(onChange).toHaveBeenCalledWith([]);
    });
  });

  describe('handleInvertSelection', () => {
    it('selects unselected and deselects selected items', () => {
      const { result, onChange } = buildHook({ selectedValues: ['acme'] });
      act(() => {
        result.current.handleInvertSelection();
      });
      expect(onChange).toHaveBeenCalledWith(['omega', 'zenith']);
    });

    it('selects all when nothing is selected', () => {
      const { result, onChange } = buildHook({ selectedValues: [] });
      act(() => {
        result.current.handleInvertSelection();
      });
      expect(onChange).toHaveBeenCalledWith(['acme', 'omega', 'zenith']);
    });

    it('deselects all when everything is selected', () => {
      const { result, onChange } = buildHook({
        selectedValues: ['acme', 'omega', 'zenith'],
      });
      act(() => {
        result.current.handleInvertSelection();
      });
      expect(onChange).toHaveBeenCalledWith([]);
    });
  });

  describe('handleSearchChange', () => {
    it('updates searchText and filters filteredOptions', () => {
      const { result } = buildHook();
      act(() => {
        result.current.handleSearchChange('acme');
      });
      expect(result.current.searchText).toBe('acme');
      expect(result.current.filteredOptions).toEqual([{ label: 'Acme Corp', value: 'acme' }]);
    });

    it('shows all options when search text cleared', () => {
      const { result } = buildHook();
      act(() => {
        result.current.handleSearchChange('acme');
      });
      act(() => {
        result.current.handleSearchChange('');
      });
      expect(result.current.filteredOptions).toHaveLength(3);
    });
  });

  describe('derived availability flags', () => {
    it('isSelectAllAvailable is false when all are selected', () => {
      const { result } = buildHook({ selectedValues: ['acme', 'omega', 'zenith'] });
      expect(result.current.isSelectAllAvailable).toBe(false);
    });

    it('isDeselectAllAvailable is true when some are selected', () => {
      const { result } = buildHook({ selectedValues: ['acme'] });
      expect(result.current.isDeselectAllAvailable).toBe(true);
    });

    it('isAllSelected is true when all values selected', () => {
      const { result } = buildHook({ selectedValues: ['acme', 'omega', 'zenith'] });
      expect(result.current.isAllSelected).toBe(true);
    });

    it('isIndeterminate is true for partial selection', () => {
      const { result } = buildHook({ selectedValues: ['acme'] });
      expect(result.current.isIndeterminate).toBe(true);
    });

    it('shows count label when selection exceeds maxDisplayNames', () => {
      const { result } = buildHook({
        selectedValues: ['acme', 'omega'],
        maxDisplayNames: 1,
      });
      expect(result.current.triggerLabel).toBe('2 Selected');
    });
  });
});
