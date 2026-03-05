import { useContext } from 'react';

import { AlertToastContext } from '../AlertToastProvider';

export const useAlertToast = () => {
  const context = useContext(AlertToastContext);

  if (!context) {
    throw new Error('useAlertToast must be used within AlertToastProvider');
  }

  return context;
};
