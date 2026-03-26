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

    it('fires onClick when Enter key is pressed while focused', () => {
      const onClick = vi.fn();
      render(<ActionButton label="Save" onClick={onClick} />);

      fireEvent.keyDown(screen.getByTestId('action-button'), { key: 'Enter' });
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not fire onClick on Enter when disabled', () => {
      const onClick = vi.fn();
      render(<ActionButton label="Save" disabled onClick={onClick} />);

      fireEvent.keyDown(screen.getByTestId('action-button'), { key: 'Enter' });
      expect(onClick).not.toHaveBeenCalled();
    });

    it('does not fire onClick on Enter when loading', () => {
      const onClick = vi.fn();
      render(<ActionButton label="Save" loading onClick={onClick} />);

      fireEvent.keyDown(screen.getByTestId('action-button'), { key: 'Enter' });
      expect(onClick).not.toHaveBeenCalled();
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

    it('renders CircularProgress spinner when loading', () => {
      render(
        <ActionButton label="Save" loading icon={<Plus data-testid="leading-icon" size={16} />} />,
      );

      expect(screen.getByRole('progressbar')).toBeTruthy();
      expect(screen.queryByTestId('leading-icon')).toBeNull();
    });

    it('does not fire onClick when loading', () => {
      const onClick = vi.fn();
      render(<ActionButton label="Save" loading onClick={onClick} />);

      fireEvent.click(screen.getByTestId('action-button'));
      expect(onClick).not.toHaveBeenCalled();
    });

    it('is disabled when loading', () => {
      render(<ActionButton label="Save" loading />);

      expect(screen.getByTestId('action-button')).toHaveProperty('disabled', true);
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

    it('fires onClick when Enter key is pressed while focused', () => {
      const onClick = vi.fn();
      render(<ActionButton variant="secondary" label="Cancel" onClick={onClick} />);

      fireEvent.keyDown(screen.getByTestId('action-button'), { key: 'Enter' });
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not fire onClick when disabled', () => {
      const onClick = vi.fn();
      render(<ActionButton variant="secondary" label="Cancel" disabled onClick={onClick} />);

      fireEvent.click(screen.getByTestId('action-button'));
      expect(onClick).not.toHaveBeenCalled();
    });

    it('renders CircularProgress spinner when loading', () => {
      render(<ActionButton variant="secondary" label="Cancel" loading />);

      expect(screen.getByRole('progressbar')).toBeTruthy();
    });

    it('does not fire onClick when loading', () => {
      const onClick = vi.fn();
      render(<ActionButton variant="secondary" label="Cancel" loading onClick={onClick} />);

      fireEvent.click(screen.getByTestId('action-button'));
      expect(onClick).not.toHaveBeenCalled();
    });

    it('is disabled when loading', () => {
      render(<ActionButton variant="secondary" label="Cancel" loading />);

      expect(screen.getByTestId('action-button')).toHaveProperty('disabled', true);
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

    it('fires onClick when Enter key is pressed while focused', () => {
      const onClick = vi.fn();
      render(
        <ActionButton
          variant="icon"
          icon={<Trash2 size={16} />}
          tooltip="Delete"
          onClick={onClick}
        />,
      );

      fireEvent.keyDown(screen.getByTestId('action-button-icon'), { key: 'Enter' });
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

    it('renders CircularProgress spinner when loading and hides icon', () => {
      render(
        <ActionButton
          variant="icon"
          icon={<Trash2 data-testid="icon" size={16} />}
          tooltip="Delete"
          loading
        />,
      );

      expect(screen.getByRole('progressbar')).toBeTruthy();
      expect(screen.queryByTestId('icon')).toBeNull();
    });

    it('does not fire onClick when loading', () => {
      const onClick = vi.fn();
      render(
        <ActionButton
          variant="icon"
          icon={<Trash2 size={16} />}
          tooltip="Delete"
          loading
          onClick={onClick}
        />,
      );

      fireEvent.click(screen.getByTestId('action-button-icon'));
      expect(onClick).not.toHaveBeenCalled();
    });

    it('is disabled when loading', () => {
      render(<ActionButton variant="icon" icon={<Trash2 size={16} />} tooltip="Delete" loading />);

      expect(screen.getByTestId('action-button-icon')).toHaveProperty('disabled', true);
    });
  });
});
