import { Chip } from '@mui/material';

import type { BadgeProps } from './types';
import { getBadgeStyles } from './styles';

export const Badge = ({
  label,
  variant = 'filled',
  color = 'info',
  icon,
  size = 'medium',
  sx,
  ...chipProps
}: BadgeProps) => {
  const hasIcon = Boolean(icon);

  return (
    <Chip
      data-testid="badge"
      label={label}
      icon={icon}
      size={size}
      sx={[getBadgeStyles({ variant, color, size, hasIcon }), ...(Array.isArray(sx) ? sx : [sx])]}
      {...chipProps}
    />
  );
};
