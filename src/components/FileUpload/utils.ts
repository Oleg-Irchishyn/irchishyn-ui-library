import { FILE_UPLOAD_ERROR_FILE_TOO_LARGE, FILE_UPLOAD_ERROR_FILE_TYPE } from './constants';

export function parseAccept(accept: string): string[] {
  return accept
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isFileAccepted(file: File, accept: string): boolean {
  if (!accept || accept === '*/*') return true;
  const allowed = parseAccept(accept);
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return allowed.some((a) => {
    if (a.startsWith('.')) return name.endsWith(a);
    if (a.endsWith('/*')) {
      const prefix = a.slice(0, -2);
      return type.startsWith(prefix + '/');
    }
    return type === a;
  });
}

export function validateFiles(
  files: File[],
  accept: string,
  maxSizeBytes?: number,
): { valid: File[]; error: string | null } {
  for (const file of files) {
    if (maxSizeBytes != null && file.size > maxSizeBytes) {
      return { valid: [], error: FILE_UPLOAD_ERROR_FILE_TOO_LARGE };
    }
    if (!isFileAccepted(file, accept)) {
      return { valid: [], error: FILE_UPLOAD_ERROR_FILE_TYPE };
    }
  }
  return { valid: files, error: null };
}
