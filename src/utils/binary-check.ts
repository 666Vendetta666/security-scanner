import isBinaryPath from 'is-binary-path';

/**
 * Check if a file path points to a binary file
 */
export function isBinary(filePath: string): boolean {
  return isBinaryPath(filePath);
}

/**
 * Common binary file extensions to skip
 */
export const BINARY_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.bmp',
  '.ico',
  '.pdf',
  '.zip',
  '.tar',
  '.gz',
  '.rar',
  '.7z',
  '.exe',
  '.dll',
  '.so',
  '.dylib',
  '.class',
  '.pyc',
  '.o',
  '.a',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  '.mp3',
  '.mp4',
  '.avi',
  '.mov',
  '.wmv',
  '.flv',
]);

/**
 * Filter out binary files from a list of file paths
 */
export function filterBinaryFiles(files: string[]): string[] {
  return files.filter((file) => !isBinary(file));
}
