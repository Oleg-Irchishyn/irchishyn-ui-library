import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { HISTORY_AUDIT_ALL_MODULES_VALUE } from '../../constants';
import { HistoryAudtitTrailModuleDropdown } from '../HistoryAudtitTrailModuleDropdown';

describe('HistoryAudtitTrailModuleDropdown', () => {
  const options = [
    { name: 'Module A', value: 'module-a' },
    { name: 'Module B', value: 'module-b' },
  ];

  it('renders all modules label when all-modules value is selected', () => {
    render(
      <HistoryAudtitTrailModuleDropdown
        value={HISTORY_AUDIT_ALL_MODULES_VALUE}
        options={options}
        onValueChange={vi.fn()}
        allModulesLabel="All Sources"
      />,
    );

    expect((screen.getByRole('combobox').textContent ?? '').includes('All Sources')).toBe(true);
  });

  it('calls onValueChange when selecting a module option', () => {
    const onValueChange = vi.fn();

    render(
      <HistoryAudtitTrailModuleDropdown
        value={HISTORY_AUDIT_ALL_MODULES_VALUE}
        options={options}
        onValueChange={onValueChange}
      />,
    );

    fireEvent.mouseDown(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Module B'));

    expect(onValueChange).toHaveBeenCalledWith('module-b');
  });

  it('renders selected module label when current value matches an option', () => {
    render(
      <HistoryAudtitTrailModuleDropdown
        value="module-a"
        options={options}
        onValueChange={vi.fn()}
        allModulesLabel="All Sources"
      />,
    );

    expect((screen.getByRole('combobox').textContent ?? '').includes('Module A')).toBe(true);
  });

  it('falls back to all-modules label when selected value is unknown', () => {
    render(
      <HistoryAudtitTrailModuleDropdown
        value="unknown-module"
        options={options}
        onValueChange={vi.fn()}
        allModulesLabel="All Sources"
      />,
    );

    expect((screen.getByRole('combobox').textContent ?? '').includes('All Sources')).toBe(true);
  });
});
