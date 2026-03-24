import { Button, IconButton, Tooltip } from '@mui/material';

import { primaryButtonSx } from './styles';
import type { ActionButtonProps } from './types';

export const ActionButton = ({
  variant = 'primary',
  label,
  icon,
  size = 'medium',
  disabled = false,
  onClick,
  tooltip,
}: ActionButtonProps) => {
  if (variant === 'icon') {
    return (
      <Tooltip title={tooltip ?? ''} arrow>
        {/* span wrapper required so Tooltip renders correctly on disabled buttons */}
        <span>
          <IconButton
            data-testid="action-button-icon"
            size={size}
            disabled={disabled}
            onClick={onClick}
          >
            {icon}
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  const muiVariant = variant === 'primary' ? 'contained' : 'outlined';

  const button = (
    <Button
      data-testid="action-button"
      variant={muiVariant}
      size={size}
      disabled={disabled}
      onClick={onClick}
      startIcon={icon}
      sx={variant === 'primary' ? primaryButtonSx : undefined}
    >
      {label}
    </Button>
  );

  return tooltip ? (
    <Tooltip title={tooltip} arrow>
      {button}
    </Tooltip>
  ) : (
    button
  );
};
