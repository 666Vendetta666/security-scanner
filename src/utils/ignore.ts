import ignore, { Ignore } from 'ignore';
import { readFileSync, existsSync } from 'fs';
import { join, relative } from 'path';

/**
 * Load .gitignore patterns from a directory
 */
export function loadGitignore(basePath: string): Ignore {
  const ig = ignore();

  // Add default ignores
  ig.add([
    'node_modules/**',
    '.git/**',
    'dist/**',
    'build/**',
    'coverage/**',
    '*.min.js',
    '*.min.css',
  ]);

  // Load .gitignore if it exists
  const gitignorePath = join(basePath, '.gitignore');
  if (existsSync(gitignorePath)) {
    try {
      const gitignoreContent = readFileSync(gitignorePath, 'utf8');
      ig.add(gitignoreContent);
    } catch {
      console.warn(`Warning: Could not read .gitignore at ${gitignorePath}`);
    }
  }

  return ig;
}

/**
 * Filter files based on ignore patterns
 */
export function filterIgnoredFiles(files: string[], basePath: string, ig: Ignore): string[] {
  return files.filter((file) => {
    const relativePath = relative(basePath, file);
    return !ig.ignores(relativePath);
  });
}
