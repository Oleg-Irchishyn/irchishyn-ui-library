import { describe, expect, it } from 'vitest';

import { FILE_UPLOAD_ERROR_FILE_TOO_LARGE, FILE_UPLOAD_ERROR_FILE_TYPE } from '../constants';
import { isFileAccepted, parseAccept, validateFiles } from '../utils';

function createFile(name: string, size: number, type = ''): File {
  return new File([new ArrayBuffer(size)], name, { type });
}

describe('FileUpload utils', () => {
  describe('parseAccept', () => {
    it('returns empty array for empty string', () => {
      expect(parseAccept('')).toEqual([]);
    });

    it('splits by comma and trims', () => {
      expect(parseAccept('.pdf,.docx')).toEqual(['.pdf', '.docx']);
    });

    it('lowercases values', () => {
      expect(parseAccept('.PDF,.DOCX')).toEqual(['.pdf', '.docx']);
    });

    it('trims whitespace around each value', () => {
      expect(parseAccept('  .pdf  ,  .docx  ')).toEqual(['.pdf', '.docx']);
    });

    it('filters out empty segments', () => {
      expect(parseAccept('a,,b')).toEqual(['a', 'b']);
    });

    it('returns single element for single value', () => {
      expect(parseAccept('application/pdf')).toEqual(['application/pdf']);
    });
  });

  describe('isFileAccepted', () => {
    it('returns true when accept is empty', () => {
      expect(isFileAccepted(createFile('x.pdf', 1), '')).toBe(true);
    });

    it('returns true when accept is */*', () => {
      expect(isFileAccepted(createFile('any.txt', 1), '*/*')).toBe(true);
    });

    it('returns true when file extension matches accept', () => {
      const file = createFile('doc.pdf', 1);
      expect(isFileAccepted(file, '.pdf')).toBe(true);
      expect(isFileAccepted(file, '.pdf,.docx')).toBe(true);
    });

    it('returns false when file extension does not match accept', () => {
      const file = createFile('image.png', 1);
      expect(isFileAccepted(file, '.pdf,.docx')).toBe(false);
    });

    it('matches extension case-insensitively', () => {
      const file = createFile('doc.PDF', 1);
      expect(isFileAccepted(file, '.pdf')).toBe(true);
    });

    it('returns true when file MIME type matches accept', () => {
      const file = createFile('doc.pdf', 1, 'application/pdf');
      expect(isFileAccepted(file, 'application/pdf')).toBe(true);
    });

    it('returns true when file MIME type matches accept wildcard', () => {
      const file = createFile('img.png', 1, 'image/png');
      expect(isFileAccepted(file, 'image/*')).toBe(true);
    });

    it('returns false when file MIME type does not match', () => {
      const file = createFile('doc.pdf', 1, 'application/pdf');
      expect(isFileAccepted(file, 'image/*')).toBe(false);
    });

    it('rejects different MIME type when accept is exact (no wildcard)', () => {
      const file = createFile('doc.doc', 1, 'application/msword');
      expect(isFileAccepted(file, 'application/pdf')).toBe(false);
    });
  });

  describe('validateFiles', () => {
    it('returns valid files and null error when all pass', () => {
      const files = [createFile('a.pdf', 100), createFile('b.pdf', 200)];
      const result = validateFiles(files, '.pdf');
      expect(result).toEqual({ valid: files, error: null });
    });

    it('returns error when file exceeds maxSizeBytes', () => {
      const files = [createFile('big.pdf', 1025)];
      const result = validateFiles(files, '*/*', 1024);
      expect(result).toEqual({ valid: [], error: FILE_UPLOAD_ERROR_FILE_TOO_LARGE });
    });

    it('returns error when file type is not accepted', () => {
      const files = [createFile('image.png', 100)];
      const result = validateFiles(files, '.pdf,.docx');
      expect(result).toEqual({ valid: [], error: FILE_UPLOAD_ERROR_FILE_TYPE });
    });

    it('does not check size when maxSizeBytes is undefined', () => {
      const files = [createFile('big.pdf', 99999)];
      const result = validateFiles(files, '.pdf');
      expect(result).toEqual({ valid: files, error: null });
    });

    it('accepts file at exactly maxSizeBytes', () => {
      const files = [createFile('exact.pdf', 1024)];
      const result = validateFiles(files, '.pdf', 1024);
      expect(result).toEqual({ valid: files, error: null });
    });

    it('returns first error when multiple files and first is invalid', () => {
      const validFile = createFile('a.pdf', 100);
      const tooBig = createFile('big.pdf', 2000);
      const result = validateFiles([tooBig, validFile], '.pdf', 1024);
      expect(result).toEqual({ valid: [], error: FILE_UPLOAD_ERROR_FILE_TOO_LARGE });
    });

    it('returns type error when first file has wrong type', () => {
      const wrongType = createFile('x.png', 100);
      const rightType = createFile('a.pdf', 100);
      const result = validateFiles([wrongType, rightType], '.pdf');
      expect(result).toEqual({ valid: [], error: FILE_UPLOAD_ERROR_FILE_TYPE });
    });
  });
});
