import { Alert as MuiAlert, AlertTitle } from '@mui/material';
import { Snackbar } from '@mui/material';
import { forwardRef } from 'react';
import type { SyntheticEvent } from 'react';

import type { AlertProps } from './types';
import { getAlertStyles } from './styles';
import { useAlert } from './useAlert';

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    severity = 'info',
    variant = 'standard',
    title,
    titleProps,
    message,
    dismissible = false,
    onClose,
    action,
    visible,
    animated = false,
    autoHideDuration = 5000,
    anchorOrigin = { vertical: 'top', horizontal: 'right' },
    snackbarTransition,
    animatedSlideDirection = 'left',
    animatedTransitionProps,
    onAnimatedClose,
    sx,
    ...alertProps
  }: AlertProps,
  ref,
) {
  const { isVisible, handleClose, TransitionComponent, resolvedTransitionProps } = useAlert({
    visible,
    onClose,
    snackbarTransition,
    animatedSlideDirection,
    animatedTransitionProps,
  });

  if (!isVisible) {
    return null;
  }

  const alertNode = (
    <MuiAlert
      ref={ref}
      data-testid="alert"
      severity={severity}
      variant={variant}
      action={action}
      onClose={dismissible ? handleClose : undefined}
      sx={[
        getAlertStyles({ severity, variant, hasTitle: Boolean(title) }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...alertProps}
    >
      {title ? <AlertTitle {...titleProps}>{title}</AlertTitle> : null}
      {message}
    </MuiAlert>
  );

  if (!animated) {
    return alertNode;
  }

  return (
    <Snackbar
      open={isVisible}
      autoHideDuration={autoHideDuration}
      anchorOrigin={anchorOrigin}
      TransitionComponent={TransitionComponent}
      TransitionProps={resolvedTransitionProps}
      onClose={(event, reason) => {
        onAnimatedClose?.(event, reason);

        if (reason !== 'clickaway') {
          handleClose(event as SyntheticEvent);
        }
      }}
    >
      {alertNode}
    </Snackbar>
  );
});
