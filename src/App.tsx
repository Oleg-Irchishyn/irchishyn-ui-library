import React from 'react';
import { Box } from '@mui/material';
import { AlertToastProvider, IrchishynThemeProvider } from './providers';

export interface AppProps {
  children: React.ReactNode;
  themeMode?: 'light' | 'dark';
  padding?: number;
}

export default function App({ children, themeMode = 'light', padding = 2 }: AppProps) {
  return (
    <IrchishynThemeProvider mode={themeMode}>
      <AlertToastProvider>
        <Box sx={{ p: padding }}>{children}</Box>
      </AlertToastProvider>
    </IrchishynThemeProvider>
  );
}
