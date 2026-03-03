import type { ChipProps } from '@mui/material';
import type { ReactElement } from 'react';
import type { BadgeColorPreset } from '../../types';

export type BadgeVariant = 'filled' | 'outlined';
export type BadgeSize = 'small' | 'medium';

export type BadgeResolvedColors = {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
};

export type BadgeStyleParams = {
  variant: BadgeVariant;
  color: BadgeColorPreset | string;
  size: BadgeSize;
  hasIcon: boolean;
};

export interface BadgeProps extends Omit<
  ChipProps,
  'label' | 'variant' | 'color' | 'icon' | 'size'
> {
  label: string;
  variant?: BadgeVariant;
  color?: BadgeColorPreset | string;
  icon?: ReactElement;
  size?: BadgeSize;
}
