import { useMemo, useState } from 'react';
import type { AlertProps as MuiAlertProps } from '@mui/material';
import { Slide } from '@mui/material';

import type { UseAlertParams, UseAlertResult } from './types';

export const useAlert = ({
  visible,
  onClose,
  snackbarTransition,
  animatedSlideDirection = 'left',
  animatedTransitionProps,
}: UseAlertParams): UseAlertResult => {
  const [uncontrolledVisible, setUncontrolledVisible] = useState(true);
  const isControlled = typeof visible === 'boolean';

  const isVisible = useMemo(
    () => (isControlled ? Boolean(visible) : uncontrolledVisible),
    [isControlled, uncontrolledVisible, visible],
  );

  const handleClose: NonNullable<MuiAlertProps['onClose']> = (event) => {
    if (!isControlled) {
      setUncontrolledVisible(false);
    }

    onClose?.(event);
  };

  const TransitionComponent = snackbarTransition ?? Slide;
  const resolvedTransitionProps =
    TransitionComponent === Slide
      ? { direction: animatedSlideDirection, ...animatedTransitionProps }
      : animatedTransitionProps;

  return {
    isVisible,
    isControlled,
    handleClose,
    TransitionComponent,
    resolvedTransitionProps,
  };
};
