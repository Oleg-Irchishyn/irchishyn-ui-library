import '@testing-library/jest-dom/vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { IrchishynThemeProvider } from '../../../../providers';
import { DocumentTemplateCardFileIcon } from '../DocumentTemplateCardFileIcon';

const renderWithTheme = (ui: React.ReactElement) =>
  render(<IrchishynThemeProvider mode="light">{ui}</IrchishynThemeProvider>);

describe('DocumentTemplateCardFileIcon', () => {
  it('renders PDF marker for pdf file kind', () => {
    renderWithTheme(<DocumentTemplateCardFileIcon fileKind="pdf" selected={false} />);
    expect(screen.getByText('PDF')).toBeInTheDocument();
  });

  it('renders document icon for document file kind', () => {
    const { container } = renderWithTheme(
      <DocumentTemplateCardFileIcon fileKind="document" selected={true} />,
    );

    expect(screen.queryByText('PDF')).not.toBeInTheDocument();
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
