import React from 'react';
import { Box } from '@mui/material';
import { AlertToastProvider, Gen2ThemeProvider } from './providers';

export interface AppProps {
  children: React.ReactNode;
  themeMode?: 'light' | 'dark';
  padding?: number;
}

export default function App({ children, themeMode = 'light', padding = 2 }: AppProps) {
  return (
    <Gen2ThemeProvider mode={themeMode}>
      <AlertToastProvider>
        <Box sx={{ p: padding }}>{children}</Box>
      </AlertToastProvider>
    </Gen2ThemeProvider>
  );
}
