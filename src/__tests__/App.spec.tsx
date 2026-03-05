import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import App from '../App';

vi.mock('@mui/material', () => ({
  Box: ({ children, sx }: { children: React.ReactNode; sx?: { p?: number } }) => (
    <div data-testid="app-box" data-padding={sx?.p}>
      {children}
    </div>
  ),
}));

vi.mock('../providers', () => ({
  Gen2ThemeProvider: ({
    children,
    mode,
  }: {
    children: React.ReactNode;
    mode?: 'light' | 'dark';
  }) => (
    <div data-testid="theme-provider" data-mode={mode}>
      {children}
    </div>
  ),
  AlertToastProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="toast-provider">{children}</div>
  ),
}));

describe('App', () => {
  it('renders children with default props', () => {
    render(
      <App>
        <span>Child content</span>
      </App>,
    );

    expect(screen.getByTestId('theme-provider').getAttribute('data-mode')).toBe('light');
    expect(
      screen.getByTestId('theme-provider').contains(screen.getByTestId('toast-provider')),
    ).toBe(true);
    expect(screen.getByTestId('toast-provider').contains(screen.getByTestId('app-box'))).toBe(true);
    expect(screen.getByTestId('app-box').getAttribute('data-padding')).toBe('2');
    expect(screen.getByText('Child content')).toBeTruthy();
  });

  it('uses provided themeMode and padding', () => {
    render(
      <App themeMode="dark" padding={6}>
        <span>Custom child</span>
      </App>,
    );

    expect(screen.getByTestId('theme-provider').getAttribute('data-mode')).toBe('dark');
    expect(
      screen.getByTestId('theme-provider').contains(screen.getByTestId('toast-provider')),
    ).toBe(true);
    expect(screen.getByTestId('toast-provider').contains(screen.getByTestId('app-box'))).toBe(true);
    expect(screen.getByTestId('app-box').getAttribute('data-padding')).toBe('6');
    expect(screen.getByText('Custom child')).toBeTruthy();
  });
});
