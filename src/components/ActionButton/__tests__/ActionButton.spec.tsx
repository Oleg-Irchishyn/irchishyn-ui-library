import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Plus, Trash2 } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';

import { ActionButton } from '../ActionButton';

describe('ActionButton', () => {
  describe('primary variant', () => {
    it('renders label text', () => {
      render(<ActionButton label="New Capital Event" />);

      expect(screen.getByTestId('action-button')).toBeTruthy();
      expect(screen.getByText('New Capital Event')).toBeTruthy();
    });

    it('renders as MUI contained button', () => {
      render(<ActionButton variant="primary" label="Save" />);

      const button = screen.getByTestId('action-button');
      expect(button.className).toContain('MuiButton-contained');
    });

    it('renders leading icon alongside label', () => {
      render(
        <ActionButton
          label="New Capital Event"
          icon={<Plus data-testid="leading-icon" size={16} />}
        />,
      );

      expect(screen.getByTestId('leading-icon')).toBeTruthy();
      expect(screen.getByText('New Capital Event')).toBeTruthy();
    });

    it('fires onClick when clicked', () => {
      const onClick = vi.fn();
      render(<ActionButton label="Save" onClick={onClick} />);

      fireEvent.click(screen.getByTestId('action-button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not fire onClick when disabled', () => {
      const onClick = vi.fn();
      render(<ActionButton label="Save" disabled onClick={onClick} />);

      fireEvent.click(screen.getByTestId('action-button'));
      expect(onClick).not.toHaveBeenCalled();
    });

    it('applies small size class', () => {
      render(<ActionButton label="Save" size="small" />);

      expect(screen.getByTestId('action-button').className).toContain('MuiButton-sizeSmall');
    });

    it('applies large size class', () => {
      render(<ActionButton label="Save" size="large" />);

      expect(screen.getByTestId('action-button').className).toContain('MuiButton-sizeLarge');
    });
  });

  describe('secondary variant', () => {
    it('renders as MUI outlined button', () => {
      render(<ActionButton variant="secondary" label="Cancel" />);

      const button = screen.getByTestId('action-button');
      expect(button.className).toContain('MuiButton-outlined');
    });

    it('fires onClick when clicked', () => {
      const onClick = vi.fn();
      render(<ActionButton variant="secondary" label="Cancel" onClick={onClick} />);

      fireEvent.click(screen.getByTestId('action-button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not fire onClick when disabled', () => {
      const onClick = vi.fn();
      render(<ActionButton variant="secondary" label="Cancel" disabled onClick={onClick} />);

      fireEvent.click(screen.getByTestId('action-button'));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('icon variant', () => {
    it('renders icon button without label', () => {
      render(
        <ActionButton
          variant="icon"
          icon={<Trash2 data-testid="icon" size={16} />}
          tooltip="Delete"
        />,
      );

      expect(screen.getByTestId('action-button-icon')).toBeTruthy();
      expect(screen.queryByTestId('action-button')).toBeNull();
    });

    it('renders tooltip text as aria-label', () => {
      render(<ActionButton variant="icon" icon={<Trash2 size={16} />} tooltip="Delete" />);

      // MUI Tooltip renders the title as aria-label on the wrapper span in JSDOM
      expect(screen.getByLabelText('Delete')).toBeTruthy();
    });

    it('fires onClick when clicked', () => {
      const onClick = vi.fn();
      render(
        <ActionButton
          variant="icon"
          icon={<Trash2 size={16} />}
          tooltip="Delete"
          onClick={onClick}
        />,
      );

      fireEvent.click(screen.getByTestId('action-button-icon'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not fire onClick when disabled', () => {
      const onClick = vi.fn();
      render(
        <ActionButton variant="icon" icon={<Trash2 size={16} />} disabled onClick={onClick} />,
      );

      fireEvent.click(screen.getByTestId('action-button-icon'));
      expect(onClick).not.toHaveBeenCalled();
    });
  });
});
