import '@testing-library/jest-dom/vitest';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Gen2ThemeProvider } from '../../../providers';
import { DOCUMENT_TEMPLATE_CARD_ACTION_TYPES } from '../constants';
import { DocumentTemplateCard } from '../DocumentTemplateCard';
import type { DocumentTemplateCardAction } from '../types';
import * as useDocumentTemplateCardModule from '../useDocumentTemplateCard';

const renderWithTheme = (ui: React.ReactElement) =>
  render(<Gen2ThemeProvider mode="light">{ui}</Gen2ThemeProvider>);

describe('DocumentTemplateCard', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders label and file name', () => {
    renderWithTheme(
      <DocumentTemplateCard type="Cover Letter" label="Cover Letter" fileName="Cover-Letter.pdf" />,
    );

    expect(screen.getByTestId('document-template-card')).toBeInTheDocument();
    expect(screen.getByText('Cover Letter')).toBeInTheDocument();
    expect(screen.getByText('Cover-Letter.pdf')).toBeInTheDocument();
  });

  it('renders PDF indicator for pdf files and document icon for template', () => {
    const { rerender, container } = renderWithTheme(
      <DocumentTemplateCard type="Cover Letter" label="Cover Letter" fileName="Cover-Letter.pdf" />,
    );
    expect(screen.getByText('PDF')).toBeInTheDocument();

    rerender(
      <Gen2ThemeProvider mode="light">
        <DocumentTemplateCard type="Template" label="Template" fileName="Template.docx" />
      </Gen2ThemeProvider>,
    );

    expect(screen.queryByText('PDF')).not.toBeInTheDocument();
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('calls card onClick from mouse and keyboard', () => {
    const onClick = vi.fn();
    renderWithTheme(
      <DocumentTemplateCard
        type="Template"
        label="Template"
        fileName="Template.docx"
        onClick={onClick}
      />,
    );

    const card = screen.getByTestId('document-template-card');
    fireEvent.click(card);
    fireEvent.keyDown(card, { key: 'Enter' });
    fireEvent.keyDown(card, { key: ' ' });

    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('does not trigger card click for unsupported keys', () => {
    const onClick = vi.fn();
    renderWithTheme(
      <DocumentTemplateCard
        type="Template"
        label="Template"
        fileName="Template.docx"
        onClick={onClick}
      />,
    );

    const card = screen.getByTestId('document-template-card');
    fireEvent.keyDown(card, { key: 'Escape' });
    expect(onClick).not.toHaveBeenCalled();
  });

  it('ignores keyboard activation when onClick is not provided', () => {
    renderWithTheme(
      <DocumentTemplateCard type="Template" label="Template" fileName="Template.docx" />,
    );

    const card = screen.getByTestId('document-template-card');
    fireEvent.keyDown(card, { key: 'Enter' });
    fireEvent.keyDown(card, { key: ' ' });
    expect(card).toBeInTheDocument();
  });

  it('renders configured actions and action click does not trigger card onClick', () => {
    const onCardClick = vi.fn();
    const onSwapClick = vi.fn();
    const actions: DocumentTemplateCardAction[] = [
      { type: DOCUMENT_TEMPLATE_CARD_ACTION_TYPES.SWAP, onClick: onSwapClick },
    ];

    renderWithTheme(
      <DocumentTemplateCard
        type="Template"
        label="Template"
        fileName="Template.docx"
        actions={actions}
        onClick={onCardClick}
      />,
    );

    const swapButton = screen.getByRole('button', { name: 'Swap card position' });
    fireEvent.click(swapButton);

    expect(onSwapClick).toHaveBeenCalledTimes(1);
    expect(onCardClick).not.toHaveBeenCalled();
  });

  it('applies role and tabIndex only when onClick is provided', () => {
    const { rerender } = renderWithTheme(
      <DocumentTemplateCard type="Template" label="Template" fileName="Template.docx" />,
    );

    const card = screen.getByTestId('document-template-card');
    expect(card).not.toHaveAttribute('role');
    expect(card).not.toHaveAttribute('tabindex');

    rerender(
      <Gen2ThemeProvider mode="light">
        <DocumentTemplateCard
          type="Template"
          label="Template"
          fileName="Template.docx"
          onClick={vi.fn()}
        />
      </Gen2ThemeProvider>,
    );

    expect(screen.getByTestId('document-template-card')).toHaveAttribute('role', 'button');
    expect(screen.getByTestId('document-template-card')).toHaveAttribute('tabindex', '0');
  });

  it('wires tooltip title when overflow is detected by hook', () => {
    vi.spyOn(useDocumentTemplateCardModule, 'useDocumentTemplateCard').mockReturnValue({
      cardLabel: 'Cover Letter',
      fileKind: 'pdf',
      normalizedType: 'cover letter',
      actions: [],
      handleCardClick: vi.fn(),
      fileNameRef: vi.fn(),
      showFileNameTooltip: true,
    });

    renderWithTheme(
      <DocumentTemplateCard
        type="Cover Letter"
        label="Cover Letter"
        fileName="Very-Long-Cover-Letter-Name.pdf"
      />,
    );

    expect(screen.getByText('Very-Long-Cover-Letter-Name.pdf')).toHaveAttribute(
      'aria-label',
      'Very-Long-Cover-Letter-Name.pdf',
    );
  });
});
