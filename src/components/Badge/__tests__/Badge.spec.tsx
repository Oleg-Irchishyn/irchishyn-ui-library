import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { FileText } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';

import { Badge } from '../Badge';

describe('Badge', () => {
  it('renders label and default chip size', () => {
    render(<Badge label="Capital Call" />);

    const badge = screen.getByTestId('badge');
    expect(badge).toBeTruthy();
    expect(screen.getByText('Capital Call')).toBeTruthy();
    expect(badge.className).toContain('MuiChip-sizeMedium');
  });

  it('renders optional leading icon', () => {
    render(<Badge label="Preparation" icon={<FileText data-testid="badge-icon" size={12} />} />);

    expect(screen.getByTestId('badge-icon')).toBeTruthy();
    expect(screen.getByText('Preparation')).toBeTruthy();
  });

  it('forwards chip props like click handlers and aria-label', () => {
    const onClick = vi.fn();

    render(<Badge label="Editable" onClick={onClick} aria-label="editable-badge" />);

    const badge = screen.getByLabelText('editable-badge');
    fireEvent.click(badge);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('supports outlined variant and small size classes', () => {
    render(<Badge label="In-Preparation" variant="outlined" size="small" />);

    const badge = screen.getByTestId('badge');
    expect(badge.className).toContain('MuiChip-sizeSmall');
    expect(screen.getByText('In-Preparation')).toBeTruthy();
  });

  it('renders inside dark theme without crashing', () => {
    const darkTheme = createTheme({ palette: { mode: 'dark' } });

    render(
      <ThemeProvider theme={darkTheme}>
        <Badge label="System" color="neutral" variant="outlined" />
      </ThemeProvider>,
    );

    expect(screen.getByText('System')).toBeTruthy();
  });
});
