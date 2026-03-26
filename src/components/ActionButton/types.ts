import type { ReactNode } from 'react';

export type ActionButtonVariant = 'primary' | 'secondary' | 'icon';
export type ActionButtonSize = 'small' | 'medium' | 'large';

export interface ActionButtonProps {
  variant?: ActionButtonVariant;
  label?: string;
  icon?: ReactNode;
  size?: ActionButtonSize;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  tooltip?: string;
}
