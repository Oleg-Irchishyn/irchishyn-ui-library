import React from 'react';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AlertToastProvider } from '../../AlertToastProvider';
import { useAlertToast } from '../useAlertToast';

describe('useAlertToast', () => {
  it('throws when used outside AlertToastProvider', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => useAlertToast())).toThrowError(
      'useAlertToast must be used within AlertToastProvider',
    );

    consoleErrorSpy.mockRestore();
  });

  it('returns toast API when used inside AlertToastProvider', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AlertToastProvider>{children}</AlertToastProvider>
    );

    const { result } = renderHook(() => useAlertToast(), { wrapper });

    expect(typeof result.current.showAlert).toBe('function');
    expect(typeof result.current.showSuccess).toBe('function');
    expect(typeof result.current.showError).toBe('function');
    expect(typeof result.current.showInfo).toBe('function');
    expect(typeof result.current.showWarning).toBe('function');
    expect(typeof result.current.hideAlert).toBe('function');
  });
});
