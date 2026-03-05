import { createContext, useCallback, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { Alert } from '../components/Alert/Alert';
import type { AlertToastContextValue, AlertToastOptions } from '../components/Alert/types';

type AlertToastProviderProps = {
  children: ReactNode;
};

type ActiveToast = {
  id: number;
  options: AlertToastOptions;
};

export const AlertToastContext = createContext<AlertToastContextValue | null>(null);

export const AlertToastProvider = ({ children }: AlertToastProviderProps) => {
  const [activeToast, setActiveToast] = useState<ActiveToast | null>(null);
  const toastIdRef = useRef(0);

  const showAlert = useCallback((options: AlertToastOptions) => {
    toastIdRef.current += 1;
    setActiveToast({ id: toastIdRef.current, options });
  }, []);

  const hideAlert = useCallback(() => {
    setActiveToast(null);
  }, []);

  const contextValue = useMemo<AlertToastContextValue>(
    () => ({
      showAlert,
      showSuccess: (message, options) => showAlert({ ...options, severity: 'success', message }),
      showError: (message, options) => showAlert({ ...options, severity: 'error', message }),
      showInfo: (message, options) => showAlert({ ...options, severity: 'info', message }),
      showWarning: (message, options) => showAlert({ ...options, severity: 'warning', message }),
      hideAlert,
    }),
    [hideAlert, showAlert],
  );

  return (
    <AlertToastContext.Provider value={contextValue}>
      {children}
      {activeToast ? (
        <Alert
          key={activeToast.id}
          {...activeToast.options}
          visible
          animated
          dismissible={activeToast.options.dismissible ?? true}
          onAnimatedClose={(_event, reason) => {
            if (reason !== 'clickaway') {
              hideAlert();
            }
          }}
          onClose={(event) => {
            activeToast.options.onClose?.(event);
            hideAlert();
          }}
        />
      ) : null}
    </AlertToastContext.Provider>
  );
};
