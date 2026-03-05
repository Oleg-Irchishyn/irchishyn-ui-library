import React from 'react';
import { Button } from '@mui/material';
import { fireEvent, render, screen } from '@testing-library/react';
import { act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AlertToastProvider } from '../AlertToastProvider';
import { useAlertToast } from '../hooks/useAlertToast';

const TriggerComponent = () => {
  const { showAlert, showError, showInfo, showSuccess, showWarning, hideAlert } = useAlertToast();

  return (
    <>
      <Button
        onClick={() =>
          showError('Request failed.', {
            title: 'API error',
            autoHideDuration: null,
          })
        }
      >
        Trigger Error
      </Button>
      <Button
        onClick={() =>
          showSuccess('Saved.', {
            title: 'Success',
            autoHideDuration: null,
          })
        }
      >
        Trigger Success
      </Button>
      <Button onClick={() => showInfo('Info message', { autoHideDuration: null })}>
        Trigger Info
      </Button>
      <Button onClick={() => showWarning('Warning message', { autoHideDuration: null })}>
        Trigger Warning
      </Button>
      <Button
        onClick={() =>
          showAlert({
            severity: 'info',
            message: 'Generic message',
            autoHideDuration: null,
            onClose: () => undefined,
          })
        }
      >
        Trigger Generic
      </Button>
      <Button
        onClick={() =>
          showError('Timed error', {
            title: 'Timed error',
            autoHideDuration: 1,
          })
        }
      >
        Trigger Timed Error
      </Button>
      <Button onClick={hideAlert}>Hide Alert</Button>
    </>
  );
};

describe('AlertToastProvider', () => {
  it('renders animated alert when callback is invoked', () => {
    render(
      <AlertToastProvider>
        <TriggerComponent />
      </AlertToastProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Trigger Error' }));

    expect(screen.getByText('API error')).toBeTruthy();
    expect(screen.getByText('Request failed.')).toBeTruthy();
  });

  it('supports all toast helper callbacks and hideAlert', () => {
    render(
      <AlertToastProvider>
        <TriggerComponent />
      </AlertToastProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Trigger Success' }));
    expect(screen.getByText('Success')).toBeTruthy();
    expect(screen.getByText('Saved.')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Trigger Info' }));
    expect(screen.getByText('Info message')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Trigger Warning' }));
    expect(screen.getByText('Warning message')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Trigger Generic' }));
    expect(screen.getByText('Generic message')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Hide Alert' }));
    expect(screen.queryByTestId('alert')).toBeNull();
  }, 15000);

  it('hides toast when close button is clicked', () => {
    render(
      <AlertToastProvider>
        <TriggerComponent />
      </AlertToastProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Trigger Error' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.queryByTestId('alert')).toBeNull();
  });

  it('hides toast when animated auto-hide closes snackbar', () => {
    vi.useFakeTimers();

    render(
      <AlertToastProvider>
        <TriggerComponent />
      </AlertToastProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Trigger Timed Error' }));
    expect(screen.getAllByText('Timed error').length).toBeGreaterThan(0);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.queryByText('Timed error')).toBeNull();
    vi.useRealTimers();
  });
});
