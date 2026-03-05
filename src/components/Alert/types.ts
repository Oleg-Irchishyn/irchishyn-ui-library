import type {
  AlertColor,
  AlertProps as MuiAlertProps,
  AlertTitleProps,
  SlideProps,
  SnackbarOrigin,
  SnackbarProps,
} from '@mui/material';
import type { ReactNode } from 'react';

export type AlertSeverity = AlertColor;
export type AlertVariant = 'standard' | 'filled' | 'outlined';

export type AlertStyleParams = {
  severity: AlertSeverity;
  variant: AlertVariant;
  hasTitle: boolean;
};

export type UseAlertParams = {
  visible?: boolean;
  onClose?: MuiAlertProps['onClose'];
  snackbarTransition?: SnackbarProps['TransitionComponent'];
  animatedSlideDirection?: SlideProps['direction'];
  animatedTransitionProps?: SnackbarProps['TransitionProps'];
};

export type UseAlertResult = {
  isVisible: boolean;
  isControlled: boolean;
  handleClose: NonNullable<MuiAlertProps['onClose']>;
  TransitionComponent: SnackbarProps['TransitionComponent'];
  resolvedTransitionProps: SnackbarProps['TransitionProps'];
};

export interface AlertProps extends Omit<
  MuiAlertProps,
  'severity' | 'variant' | 'children' | 'onClose' | 'action' | 'title'
> {
  severity?: AlertSeverity;
  variant?: AlertVariant;
  title?: ReactNode;
  titleProps?: AlertTitleProps;
  message: ReactNode;
  dismissible?: boolean;
  onClose?: MuiAlertProps['onClose'];
  action?: ReactNode;
  visible?: boolean;
  animated?: boolean;
  autoHideDuration?: SnackbarProps['autoHideDuration'];
  anchorOrigin?: SnackbarOrigin;
  snackbarTransition?: SnackbarProps['TransitionComponent'];
  animatedSlideDirection?: SlideProps['direction'];
  animatedTransitionProps?: SnackbarProps['TransitionProps'];
  onAnimatedClose?: SnackbarProps['onClose'];
}

export type AlertToastOptions = Omit<
  AlertProps,
  'visible' | 'animated' | 'onAnimatedClose' | 'snackbarTransition'
>;

export type AlertToastContextValue = {
  showAlert: (options: AlertToastOptions) => void;
  showSuccess: (
    message: ReactNode,
    options?: Omit<AlertToastOptions, 'message' | 'severity'>,
  ) => void;
  showError: (
    message: ReactNode,
    options?: Omit<AlertToastOptions, 'message' | 'severity'>,
  ) => void;
  showInfo: (message: ReactNode, options?: Omit<AlertToastOptions, 'message' | 'severity'>) => void;
  showWarning: (
    message: ReactNode,
    options?: Omit<AlertToastOptions, 'message' | 'severity'>,
  ) => void;
  hideAlert: () => void;
};
