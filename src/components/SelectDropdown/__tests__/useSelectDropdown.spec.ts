import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useSelectDropdown } from '../useSelectDropdown';

const options = [
  { label: 'Fund of Funds', value: 'fof', badgeLabel: 'System' },
  { label: 'Direct Fund', value: 'df' },
  { label: 'Venture Capital', value: 'vc' },
];

describe('useSelectDropdown', () => {
  it('starts with popover closed and no anchorEl', () => {
    const { result } = renderHook(() =>
      useSelectDropdown({ options, value: null, onChange: vi.fn() }),
    );
    expect(result.current.isOpen).toBe(false);
    expect(result.current.anchorEl).toBeNull();
  });

  it('starts with empty searchText', () => {
    const { result } = renderHook(() =>
      useSelectDropdown({ options, value: null, onChange: vi.fn() }),
    );
    expect(result.current.searchText).toBe('');
  });

  it('returns all options initially', () => {
    const { result } = renderHook(() =>
      useSelectDropdown({ options, value: null, onChange: vi.fn() }),
    );
    expect(result.current.filteredOptions).toHaveLength(3);
  });

  it('opens popover on handleOpen', () => {
    const { result } = renderHook(() =>
      useSelectDropdown({ options, value: null, onChange: vi.fn() }),
    );
    const el = document.createElement('button');
    act(() => {
      result.current.handleOpen({ currentTarget: el } as unknown as React.MouseEvent<HTMLElement>);
    });
    expect(result.current.isOpen).toBe(true);
    expect(result.current.anchorEl).toBe(el);
  });

  it('closes popover on handleClose', () => {
    const { result } = renderHook(() =>
      useSelectDropdown({ options, value: null, onChange: vi.fn() }),
    );
    const el = document.createElement('button');
    act(() => {
      result.current.handleOpen({ currentTarget: el } as unknown as React.MouseEvent<HTMLElement>);
    });
    act(() => {
      result.current.handleClose();
    });
    expect(result.current.isOpen).toBe(false);
    expect(result.current.anchorEl).toBeNull();
  });

  it('resets searchText on handleClose', () => {
    const { result } = renderHook(() =>
      useSelectDropdown({ options, value: null, onChange: vi.fn() }),
    );
    act(() => {
      result.current.handleSearchChange('fund');
    });
    act(() => {
      result.current.handleClose();
    });
    expect(result.current.searchText).toBe('');
  });

  it('returns default placeholder as triggerLabel when value is null', () => {
    const { result } = renderHook(() =>
      useSelectDropdown({ options, value: null, onChange: vi.fn() }),
    );
    expect(result.current.triggerLabel).toBe('Select...');
    expect(result.current.triggerOption).toBeNull();
  });

  it('returns custom placeholder when provided and value is null', () => {
    const { result } = renderHook(() =>
      useSelectDropdown({ options, value: null, onChange: vi.fn(), placeholder: 'Pick a fund...' }),
    );
    expect(result.current.triggerLabel).toBe('Pick a fund...');
  });

  it('returns matched option label as triggerLabel when value is set', () => {
    const { result } = renderHook(() =>
      useSelectDropdown({ options, value: 'fof', onChange: vi.fn() }),
    );
    expect(result.current.triggerLabel).toBe('Fund of Funds');
    expect(result.current.triggerOption).toEqual(options[0]);
  });

  it('returns null triggerOption when value does not match any option', () => {
    const { result } = renderHook(() =>
      useSelectDropdown({ options, value: 'unknown', onChange: vi.fn() }),
    );
    expect(result.current.triggerOption).toBeNull();
  });

  it('filters options by searchText', () => {
    const { result } = renderHook(() =>
      useSelectDropdown({ options, value: null, onChange: vi.fn() }),
    );
    act(() => {
      result.current.handleSearchChange('direct');
    });
    expect(result.current.filteredOptions).toHaveLength(1);
    expect(result.current.filteredOptions[0].value).toBe('df');
  });

  it('filtering is case-insensitive', () => {
    const { result } = renderHook(() =>
      useSelectDropdown({ options, value: null, onChange: vi.fn() }),
    );
    act(() => {
      result.current.handleSearchChange('VENTURE');
    });
    expect(result.current.filteredOptions).toHaveLength(1);
    expect(result.current.filteredOptions[0].value).toBe('vc');
  });

  it('returns empty filteredOptions when searchText matches nothing', () => {
    const { result } = renderHook(() =>
      useSelectDropdown({ options, value: null, onChange: vi.fn() }),
    );
    act(() => {
      result.current.handleSearchChange('zzznomatch');
    });
    expect(result.current.filteredOptions).toHaveLength(0);
  });

  it('calls onChange with the selected option on handleSelectOption', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useSelectDropdown({ options, value: null, onChange }));
    act(() => {
      result.current.handleSelectOption(options[0]);
    });
    expect(onChange).toHaveBeenCalledWith(options[0]);
  });

  it('closes popover after handleSelectOption', () => {
    const { result } = renderHook(() =>
      useSelectDropdown({ options, value: null, onChange: vi.fn() }),
    );
    const el = document.createElement('button');
    act(() => {
      result.current.handleOpen({ currentTarget: el } as unknown as React.MouseEvent<HTMLElement>);
    });
    act(() => {
      result.current.handleSelectOption(options[0]);
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('resets searchText after handleSelectOption', () => {
    const { result } = renderHook(() =>
      useSelectDropdown({ options, value: null, onChange: vi.fn() }),
    );
    act(() => {
      result.current.handleSearchChange('fund');
    });
    act(() => {
      result.current.handleSelectOption(options[0]);
    });
    expect(result.current.searchText).toBe('');
  });
});
