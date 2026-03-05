import { act, renderHook } from '@testing-library/react';
import { Fade, Slide } from '@mui/material';
import type { SyntheticEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { useAlert } from '../useAlert';

describe('useAlert', () => {
  it('is visible by default in uncontrolled mode', () => {
    const { result } = renderHook(() => useAlert({}));

    expect(result.current.isControlled).toBe(false);
    expect(result.current.isVisible).toBe(true);
    expect(result.current.TransitionComponent).toBe(Slide);
    expect(result.current.resolvedTransitionProps).toEqual({ direction: 'left' });
  });

  it('hides alert after close in uncontrolled mode', () => {
    const onClose = vi.fn();
    const { result } = renderHook(() => useAlert({ onClose }));

    act(() => {
      result.current.handleClose({} as SyntheticEvent);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(result.current.isVisible).toBe(false);
  });

  it('respects controlled visibility and does not mutate internal state', () => {
    const onClose = vi.fn();
    const { result, rerender } = renderHook(
      ({ visible }: { visible: boolean }) => useAlert({ visible, onClose }),
      {
        initialProps: { visible: true },
      },
    );

    expect(result.current.isControlled).toBe(true);
    expect(result.current.isVisible).toBe(true);

    act(() => {
      result.current.handleClose({} as SyntheticEvent);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(result.current.isVisible).toBe(true);

    rerender({ visible: false });
    expect(result.current.isVisible).toBe(false);
  });

  it('resolves default Slide transition direction and merges transition props', () => {
    const { result } = renderHook(() =>
      useAlert({
        animatedSlideDirection: 'up',
        animatedTransitionProps: { timeout: 450 },
      }),
    );

    expect(result.current.TransitionComponent).toBe(Slide);
    expect(result.current.resolvedTransitionProps).toEqual({
      direction: 'up',
      timeout: 450,
    });
  });

  it('uses custom transition component without injecting Slide direction', () => {
    const { result } = renderHook(() =>
      useAlert({
        snackbarTransition: Fade,
        animatedSlideDirection: 'right',
        animatedTransitionProps: { timeout: 300 },
      }),
    );

    expect(result.current.TransitionComponent).toBe(Fade);
    expect(result.current.resolvedTransitionProps).toEqual({ timeout: 300 });
  });
});
