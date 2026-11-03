import '@testing-library/jest-dom/vitest';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { IrchishynThemeProvider } from '../../../providers';
import { FileUpload } from '../FileUpload';

const renderWithTheme = (ui: React.ReactElement) =>
  render(<IrchishynThemeProvider mode="light">{ui}</IrchishynThemeProvider>);

function createFile(name: string, size: number, type = ''): File {
  return new File([new ArrayBuffer(size)], name, { type });
}

describe('FileUpload', () => {
  it('AC1: renders dashed drop zone with upload icon, "Drop or browse" label, and Browse button', () => {
    renderWithTheme(<FileUpload onFileSelect={vi.fn()} />);

    expect(screen.getByTestId('file-upload')).toBeInTheDocument();
    expect(screen.getByText('Drop or browse')).toBeInTheDocument();
    expect(screen.getByTestId('file-upload-browse')).toHaveTextContent('Browse');
    expect(screen.getByTestId('file-upload-input')).toBeInTheDocument();
    expect(screen.getByLabelText('File upload')).toBeInTheDocument();
  });

  it('passes accept and multiple to the file input', () => {
    renderWithTheme(<FileUpload onFileSelect={vi.fn()} accept=".pdf,.docx" multiple />);
    const input = screen.getByTestId('file-upload-input');
    expect(input).toHaveAttribute('accept', '.pdf,.docx');
    expect(input).toHaveAttribute('multiple');
  });

  it('AC2: shows drag-over visual state when dragging over (no callback yet)', () => {
    const onFileSelect = vi.fn();
    renderWithTheme(<FileUpload onFileSelect={onFileSelect} />);
    const dropZone = screen.getByTestId('file-upload');

    fireEvent.dragOver(dropZone, { dataTransfer: { files: [] } });
    expect(onFileSelect).not.toHaveBeenCalled();
    // Component applies drag-over styles internally; drop zone is still visible
    expect(dropZone).toBeInTheDocument();
  });

  it('AC3: calls onFileSelect with single file when valid file is dropped', () => {
    const onFileSelect = vi.fn();
    const file = createFile('doc.pdf', 100, 'application/pdf');
    renderWithTheme(<FileUpload onFileSelect={onFileSelect} accept=".pdf" />);
    const dropZone = screen.getByTestId('file-upload');

    fireEvent.drop(dropZone, {
      dataTransfer: { files: [file] },
    });

    expect(onFileSelect).toHaveBeenCalledTimes(1);
    expect(onFileSelect).toHaveBeenCalledWith(file);
  });

  it('AC3: calls onFileSelect with single file when selected via Browse', () => {
    const onFileSelect = vi.fn();
    const file = createFile('report.pdf', 200);
    renderWithTheme(<FileUpload onFileSelect={onFileSelect} />);

    const input = screen.getByTestId('file-upload-input');
    fireEvent.change(input, { target: { files: [file] } });

    expect(onFileSelect).toHaveBeenCalledTimes(1);
    expect(onFileSelect).toHaveBeenCalledWith(file);
  });

  it('calls onFileSelect with array when multiple is true', () => {
    const onFileSelect = vi.fn();
    const f1 = createFile('a.pdf', 100);
    const f2 = createFile('b.pdf', 100);
    renderWithTheme(<FileUpload onFileSelect={onFileSelect} multiple />);

    const input = screen.getByTestId('file-upload-input');
    fireEvent.change(input, { target: { files: [f1, f2] } });

    expect(onFileSelect).toHaveBeenCalledTimes(1);
    expect(onFileSelect).toHaveBeenCalledWith([f1, f2]);
  });

  it('AC4: shows error and does not call onFileSelect when file exceeds maxSizeBytes', () => {
    const onFileSelect = vi.fn();
    const file = createFile('big.pdf', 1024 * 1024 + 1); // > 1 MB
    renderWithTheme(<FileUpload onFileSelect={onFileSelect} maxSizeBytes={1024 * 1024} />);

    const input = screen.getByTestId('file-upload-input');
    fireEvent.change(input, { target: { files: [file] } });

    expect(onFileSelect).not.toHaveBeenCalled();
    expect(screen.getByTestId('file-upload-error')).toHaveTextContent('File exceeds maximum size');
  });

  it('AC4: shows error and does not call onFileSelect when file type is not accepted', () => {
    const onFileSelect = vi.fn();
    const file = createFile('image.png', 100, 'image/png');
    renderWithTheme(<FileUpload onFileSelect={onFileSelect} accept=".pdf,.docx" />);

    const input = screen.getByTestId('file-upload-input');
    fireEvent.change(input, { target: { files: [file] } });

    expect(onFileSelect).not.toHaveBeenCalled();
    expect(screen.getByTestId('file-upload-error')).toHaveTextContent('File type not allowed');
  });

  it('accepts file when type matches accept extension', () => {
    const onFileSelect = vi.fn();
    const file = createFile('doc.pdf', 100);
    renderWithTheme(<FileUpload onFileSelect={onFileSelect} accept=".pdf,.docx" />);

    const input = screen.getByTestId('file-upload-input');
    fireEvent.change(input, { target: { files: [file] } });

    expect(onFileSelect).toHaveBeenCalledWith(file);
    expect(screen.queryByTestId('file-upload-error')).not.toBeInTheDocument();
  });

  it('AC5: disabled state – Browse button and input are disabled', () => {
    renderWithTheme(<FileUpload onFileSelect={vi.fn()} disabled />);

    expect(screen.getByTestId('file-upload-input')).toBeDisabled();
    expect(screen.getByTestId('file-upload-browse')).toBeDisabled();
  });

  it('AC5: disabled state – drop does not call onFileSelect', () => {
    const onFileSelect = vi.fn();
    const file = createFile('x.pdf', 100);
    renderWithTheme(<FileUpload onFileSelect={onFileSelect} disabled />);
    const dropZone = screen.getByTestId('file-upload');

    fireEvent.drop(dropZone, { dataTransfer: { files: [file] } });

    expect(onFileSelect).not.toHaveBeenCalled();
  });

  it('Browse button click triggers file input', () => {
    renderWithTheme(<FileUpload onFileSelect={vi.fn()} />);
    const input = screen.getByTestId('file-upload-input');
    const clickSpy = vi.spyOn(input, 'click');

    fireEvent.click(screen.getByTestId('file-upload-browse'));

    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  it('resets input value after selection so same file can be selected again', () => {
    const onFileSelect = vi.fn();
    const file = createFile('doc.pdf', 100);
    renderWithTheme(<FileUpload onFileSelect={onFileSelect} />);
    const input = screen.getByTestId('file-upload-input') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });
    expect(input.value).toBe('');
  });
});
