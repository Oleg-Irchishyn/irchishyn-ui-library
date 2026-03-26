import type { KeyboardEvent } from 'react';
import { Button, CircularProgress, IconButton, Tooltip } from '@mui/material';

import { loadingSpinnerSize, primaryButtonSx } from './styles';
import type { ActionButtonProps } from './types';

export const ActionButton = ({
  variant = 'primary',
  label,
  icon,
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  tooltip,
}: ActionButtonProps) => {
  const isDisabled = disabled || loading;

  // <button type="button"> does not natively activate on Enter (only Space does per HTML spec).
  // MUI ButtonBase delegates to native behaviour for real <button> nodes, so we add
  // an explicit handler that fires a real DOM click — this triggers both the ripple and onClick.
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' && !isDisabled) {
      event.preventDefault();
      // Dispatch mousedown + mouseup so MUI's ripple system activates (ripple starts on
      // mousedown, not on click), then fire the click for the onClick callback.
      const el = event.currentTarget;
      el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
      el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
      el.click();
    }
  };

  if (variant === 'icon') {
    return (
      <Tooltip title={tooltip ?? ''} arrow>
        {/* span wrapper required so Tooltip renders correctly on disabled buttons */}
        <span>
          <IconButton
            data-testid="action-button-icon"
            size={size}
            disabled={isDisabled}
            onClick={onClick}
            onKeyDown={handleKeyDown}
          >
            {loading ? <CircularProgress size={loadingSpinnerSize[size]} color="inherit" /> : icon}
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
      disabled={isDisabled}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      startIcon={
        loading ? <CircularProgress size={loadingSpinnerSize[size]} color="inherit" /> : icon
      }
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
