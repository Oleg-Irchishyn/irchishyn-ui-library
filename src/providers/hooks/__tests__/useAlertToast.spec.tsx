import React from 'react';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AlertToastProvider } from '../../AlertToastProvider';
import { useAlertToast } from '../useAlertToast';

describe('useAlertToast', () => {
  it('returns guard error when used outside AlertToastProvider', () => {
    const { result } = renderHook(() => {
      try {
        useAlertToast();
        return null;
      } catch (error) {
        return error as Error;
      }
    });

    expect(result.current).toBeInstanceOf(Error);
    expect(result.current?.message).toBe('useAlertToast must be used within AlertToastProvider');
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
