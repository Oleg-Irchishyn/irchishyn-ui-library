import type { SxProps, Theme } from '@mui/material/styles';

export const getHistoryAuditTrailRootStyles = (sx?: SxProps<Theme>): SxProps<Theme> => [
  { width: '100%' },
  ...(Array.isArray(sx) ? sx : [sx]),
];

export const historyAuditTrailContentStyles: SxProps<Theme> = {
  position: 'relative',
};
