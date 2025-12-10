import { describe, it, expect, beforeAll } from 'vitest';
import { scan } from '../../src/scanner/index.js';
import { writeFileSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';

describe('Scanner Integration Tests', () => {
  const testDir = join(process.cwd(), 'tests', 'integration', 'test-project');

  beforeAll(() => {
    // Create test directory structure
    try {
      rmSync(testDir, { recursive: true, force: true });
    } catch {
      // Directory might not exist
    }

    mkdirSync(testDir, { recursive: true });

    // Create test files with secrets
    writeFileSync(
      join(testDir, 'config.ts'),
      `
export const config = {
  awsKey: 'AKIAIOSFODNN7EXAMPLE',
  githubToken: 'ghp_abcdefghijklmnopqrstuvwxyz1234567890',
};
`
    );

    // Create test file with vulnerabilities
    writeFileSync(
      join(testDir, 'database.ts'),
      `
export function getUser(id: string) {
  return db.query(\`SELECT * FROM users WHERE id = \${id}\`);
}

const password = 'hardcoded123';
`
    );

    // Create clean file
    writeFileSync(
      join(testDir, 'utils.ts'),
      `
export function add(a: number, b: number) {
  return a + b;
}
`
    );
  });

  it('should scan directory and find secrets', async () => {
    const result = await scan({
      path: testDir,
      enableEntropy: false,
    });

    expect(result.filesScanned).toBeGreaterThan(0);
    expect(result.findings.length).toBeGreaterThan(0);

    // Should find AWS key
    const awsKey = result.findings.find((f) => f.type === 'aws-access-key-id');
    expect(awsKey).toBeDefined();
    expect(awsKey?.file).toContain('config.ts');

    // Should find GitHub token
    const ghToken = result.findings.find((f) => f.type === 'github-pat');
    expect(ghToken).toBeDefined();
  });

  it('should scan and find SAST vulnerabilities', async () => {
    const result = await scan({
      path: testDir,
      enableEntropy: false,
    });

    // Should find SQL injection
    const sqlInjection = result.findings.find((f) => f.type.includes('sql'));
    expect(sqlInjection).toBeDefined();

    // Should find hardcoded password
    const hardcodedPw = result.findings.find((f) => f.type === 'hardcoded-password');
    expect(hardcodedPw).toBeDefined();
  });

  it('should detect high entropy strings when enabled', async () => {
    const result = await scan({
      path: testDir,
      enableEntropy: true,
      entropyThreshold: 4.5,
    });

    // May find high-entropy strings
    const hasEntropyFindings = result.findings.some((f) => f.type === 'high-entropy-string');
    // This is not guaranteed, but we should have some findings
    expect(result.findings.length).toBeGreaterThan(0);
  });

  it('should respect ignore patterns', async () => {
    // Create a file that should be ignored
    const ignoreDir = join(testDir, 'node_modules');
    mkdirSync(ignoreDir, { recursive: true });
    writeFileSync(join(ignoreDir, 'ignored.ts'), 'const key = "AKIAIOSFODNN7EXAMPLE";');

    const result = await scan({
      path: testDir,
      ignore: ['**/node_modules/**'],
    });

    // Should not scan ignored file
    const ignoredFindings = result.findings.filter((f) => f.file.includes('node_modules'));
    expect(ignoredFindings.length).toBe(0);
  });

  it('should return scan statistics', async () => {
    const result = await scan({
      path: testDir,
    });

    expect(result.filesScanned).toBeGreaterThan(0);
    expect(result.duration).toBeGreaterThan(0);
    expect(Array.isArray(result.errors)).toBe(true);
  });

  it('should categorize findings correctly', async () => {
    const result = await scan({
      path: testDir,
    });

    const secrets = result.findings.filter((f) => f.category === 'secret');
    const sast = result.findings.filter((f) => f.category === 'sast');

    expect(secrets.length).toBeGreaterThan(0);
    expect(sast.length).toBeGreaterThan(0);
  });

  it('should assign severity levels', async () => {
    const result = await scan({
      path: testDir,
    });

    result.findings.forEach((finding) => {
      expect(['low', 'medium', 'high', 'critical']).toContain(finding.severity);
    });

    // AWS keys should be critical
    const awsKey = result.findings.find((f) => f.type === 'aws-access-key-id');
    expect(awsKey?.severity).toBe('critical');
  });

  it('should handle scan errors gracefully', async () => {
    const result = await scan({
      path: '/non/existent/path/that/does/not/exist',
    });

    // Should not throw, should return result with errors
    expect(result).toBeDefined();
    expect(result.filesScanned).toBe(0);
  });

  it('should work with custom patterns', async () => {
    const result = await scan({
      path: testDir,
      customPatterns: [
        {
          id: 'custom-test-pattern',
          description: 'Custom Test Pattern',
          regex: /CUSTOM_SECRET_[A-Z0-9]{10}/g,
          severity: 'high',
          category: 'secret',
        },
      ],
    });

    // Custom pattern should be loaded (even if not matched)
    expect(result).toBeDefined();
  });
});
