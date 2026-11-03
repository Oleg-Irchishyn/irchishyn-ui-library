import type { SxProps, Theme } from '@mui/material';
import { common } from '../../tokens';

import type { ActionButtonSize } from './types';

export const primaryButtonSx: SxProps<Theme> = {
  color: common.white,
};

export const loadingSpinnerSize: Record<ActionButtonSize, number> = {
  small: 14,
  medium: 16,
  large: 18,
};
