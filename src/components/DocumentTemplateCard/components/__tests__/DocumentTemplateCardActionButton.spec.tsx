import '@testing-library/jest-dom/vitest';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { IrchishynThemeProvider } from '../../../../providers';
import { DOCUMENT_TEMPLATE_CARD_ACTION_TYPES } from '../../constants';
import { DocumentTemplateCardActionButton } from '../DocumentTemplateCardActionButton';

const renderWithTheme = (ui: React.ReactElement) =>
  render(<IrchishynThemeProvider mode="light">{ui}</IrchishynThemeProvider>);

describe('DocumentTemplateCardActionButton', () => {
  it('renders action button and handles click', () => {
    const onClick = vi.fn();
    renderWithTheme(
      <DocumentTemplateCardActionButton
        action={{
          type: DOCUMENT_TEMPLATE_CARD_ACTION_TYPES.SWAP,
          ariaLabel: 'Swap card position',
          icon: <span data-testid="swap-icon">S</span>,
          disabled: false,
          onClick,
        }}
      />,
    );

    expect(screen.getByTestId('swap-icon')).toBeInTheDocument();
    const button = screen.getByRole('button', { name: 'Swap card position' });
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('respects disabled state', () => {
    const onClick = vi.fn();
    renderWithTheme(
      <DocumentTemplateCardActionButton
        action={{
          type: DOCUMENT_TEMPLATE_CARD_ACTION_TYPES.DELETE,
          ariaLabel: 'Delete document',
          icon: <span>D</span>,
          disabled: true,
          onClick,
        }}
      />,
    );

    const button = screen.getByRole('button', { name: 'Delete document' });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});
