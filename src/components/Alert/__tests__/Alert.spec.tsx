import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Button, ThemeProvider, createTheme } from '@mui/material';
import { describe, expect, it, vi } from 'vitest';

import { Alert } from '../Alert';

describe('Alert', () => {
  it('renders message and default severity/variant classes', () => {
    render(<Alert message="Informational update" />);

    const alert = screen.getByTestId('alert');
    expect(alert.className).toContain('MuiAlert-standardInfo');
    expect(screen.getByText('Informational update')).toBeTruthy();
  });

  it('renders title above message when provided', () => {
    render(<Alert title="Validation error" message="Please enter a valid amount." />);

    expect(screen.getByText('Validation error')).toBeTruthy();
    expect(screen.getByText('Please enter a valid amount.')).toBeTruthy();
  });

  it('does not render title row when title is not provided', () => {
    render(<Alert message="Only message body" />);

    expect(screen.queryByText('Validation error')).toBeNull();
    expect(screen.getByText('Only message body')).toBeTruthy();
  });

  it('supports dismissible mode and calls onClose', () => {
    const onClose = vi.fn();

    render(<Alert message="Dismiss me" dismissible onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Dismiss me')).toBeNull();
  });

  it('renders action slot and allows action callback handling', () => {
    const onRetry = vi.fn();

    render(
      <Alert
        message="Operation failed"
        action={
          <Button size="small" onClick={onRetry}>
            Retry
          </Button>
        }
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('supports controlled visibility mode', () => {
    const onClose = vi.fn();

    const { rerender } = render(
      <Alert visible severity="warning" message="Controlled alert" dismissible onClose={onClose} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Controlled alert')).toBeTruthy();

    rerender(
      <Alert
        visible={false}
        severity="warning"
        message="Controlled alert"
        dismissible
        onClose={onClose}
      />,
    );

    expect(screen.queryByText('Controlled alert')).toBeNull();
  });

  it('renders correctly in dark theme', () => {
    const darkTheme = createTheme({ palette: { mode: 'dark' } });

    render(
      <ThemeProvider theme={darkTheme}>
        <Alert severity="error" variant="outlined" message="Dark mode alert" />
      </ThemeProvider>,
    );

    expect(screen.getByText('Dark mode alert')).toBeTruthy();
  });

  it('renders inside Snackbar when animated is enabled', () => {
    render(
      <Alert
        animated
        visible
        severity="success"
        message="Animated success"
        autoHideDuration={null}
        dismissible
      />,
    );

    expect(screen.getByText('Animated success')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Close' })).toBeTruthy();
  });

  it('supports custom animated transition direction', () => {
    render(
      <Alert
        animated
        visible
        severity="info"
        message="Slide up alert"
        autoHideDuration={null}
        animatedSlideDirection="up"
      />,
    );

    expect(screen.getByText('Slide up alert')).toBeTruthy();
  });

  it('handles animated snackbar close callback', () => {
    vi.useFakeTimers();

    const onClose = vi.fn();
    const onAnimatedClose = vi.fn();

    render(
      <Alert
        animated
        severity="warning"
        message="Auto close warning"
        dismissible
        autoHideDuration={1}
        onClose={onClose}
        onAnimatedClose={onAnimatedClose}
      />,
    );

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(onAnimatedClose).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();

    vi.useRealTimers();
  });
});
