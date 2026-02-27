import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Theme } from '@mui/material/styles';

const createAppThemeMock = vi.hoisted(() =>
  vi.fn((mode: 'light' | 'dark') => ({ mode }) as unknown as Theme),
);
const themeProviderSpy = vi.hoisted(() => vi.fn());

vi.mock('../../theme', () => ({
  default: createAppThemeMock,
}));

vi.mock('@mui/material', () => ({
  ThemeProvider: ({ theme, children }: { theme: Theme; children: React.ReactNode }) => {
    themeProviderSpy(theme);
    return <div data-testid="theme-provider-mock">{children}</div>;
  },
  CssBaseline: () => <div data-testid="css-baseline-mock">css-baseline</div>,
}));

import { Gen2ThemeProvider } from '../Gen2ThemeProvider';

describe('Gen2ThemeProvider', () => {
  it('creates theme from mode and renders CssBaseline by default', () => {
    render(
      <Gen2ThemeProvider mode="dark">
        <span>Child content</span>
      </Gen2ThemeProvider>,
    );

    expect(createAppThemeMock).toHaveBeenCalledWith('dark');
    expect(screen.getByTestId('css-baseline-mock')).toBeTruthy();
    expect(screen.getByText('Child content')).toBeTruthy();
  });

  it('uses provided theme override instead of creating one', () => {
    const explicitTheme = { marker: 'explicit' } as unknown as Theme;

    render(
      <Gen2ThemeProvider mode="light" theme={explicitTheme}>
        <span>Theme override</span>
      </Gen2ThemeProvider>,
    );

    expect(themeProviderSpy).toHaveBeenLastCalledWith(explicitTheme);
  });

  it('does not render CssBaseline when cssBaseline is false', () => {
    render(
      <Gen2ThemeProvider cssBaseline={false}>
        <span>No baseline</span>
      </Gen2ThemeProvider>,
    );

    expect(screen.queryByTestId('css-baseline-mock')).toBeNull();
    expect(screen.getByText('No baseline')).toBeTruthy();
  });
});
