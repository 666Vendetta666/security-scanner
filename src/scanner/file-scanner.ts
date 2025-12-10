import fg from 'fast-glob';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { loadGitignore, filterIgnoredFiles } from '../utils/ignore.js';
import { filterBinaryFiles } from '../utils/binary-check.js';

export interface FileContent {
  path: string;
  content: string;
  lines: string[];
}

/**
 * Scan a directory for text files
 */
export async function scanDirectory(
  basePath: string,
  additionalIgnores: string[] = []
): Promise<string[]> {
  const absolutePath = resolve(basePath);

  // Find all files
  const files = await fg(['**/*'], {
    cwd: absolutePath,
    absolute: true,
    dot: true,
    ignore: ['node_modules/**', '.git/**', ...additionalIgnores],
  });

  // Filter binary files
  const textFiles = filterBinaryFiles(files);

  // Filter ignored files
  const ig = loadGitignore(absolutePath);
  const filteredFiles = filterIgnoredFiles(textFiles, absolutePath, ig);

  return filteredFiles;
}

/**
 * Read file content and split into lines
 */
export function readFileContent(filePath: string): FileContent {
  const content = readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  return {
    path: filePath,
    content,
    lines,
  };
}

/**
 * Scan multiple files and return their content
 */
export async function scanFiles(
  basePath: string,
  additionalIgnores: string[] = []
): Promise<FileContent[]> {
  const files = await scanDirectory(basePath, additionalIgnores);

  return files.map((file) => {
    try {
      return readFileContent(file);
    } catch (error) {
      console.warn(`Warning: Could not read file ${file}:`, error);
      return {
        path: file,
        content: '',
        lines: [],
      };
    }
  });
}
