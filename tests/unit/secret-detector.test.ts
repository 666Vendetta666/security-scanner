import { describe, it, expect } from 'vitest';
import { detectSecrets } from '../../src/scanner/secret-detector.js';
import { getSecretPatterns } from '../../src/patterns/secrets.js';
import { FileContent } from '../../src/scanner/file-scanner.js';

describe('Secret Detector', () => {
  const patterns = getSecretPatterns();

  describe('AWS Credentials Detection', () => {
    it('should detect AWS access key', () => {
      const fileContent: FileContent = {
        path: '/test/config.ts',
        content: "const key = 'AKIAIOSFODNN7EXAMPLE';",
        lines: ["const key = 'AKIAIOSFODNN7EXAMPLE';"],
      };

      const findings = detectSecrets(fileContent, patterns);

      expect(findings.length).toBeGreaterThan(0);
      const awsKey = findings.find((f) => f.type === 'aws-access-key-id');
      expect(awsKey).toBeDefined();
      expect(awsKey?.severity).toBe('critical');
      expect(awsKey?.match).toContain('AKIA');
    });

    it('should detect AWS secret key', () => {
      const fileContent: FileContent = {
        path: '/test/config.ts',
        content: 'aws_secret_key="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"',
        lines: ['aws_secret_key="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"'],
      };

      const findings = detectSecrets(fileContent, patterns);

      expect(findings.length).toBeGreaterThan(0);
      const awsSecret = findings.find((f) => f.type === 'aws-secret-access-key');
      expect(awsSecret).toBeDefined();
    });
  });

  describe('GitHub Token Detection', () => {
    it('should detect GitHub PAT', () => {
      const fileContent: FileContent = {
        path: '/test/.env',
        content: 'GITHUB_TOKEN=ghp_abcdefghijklmnopqrstuvwxyz1234567890',
        lines: ['GITHUB_TOKEN=ghp_abcdefghijklmnopqrstuvwxyz1234567890'],
      };

      const findings = detectSecrets(fileContent, patterns);

      const ghToken = findings.find((f) => f.type === 'github-pat');
      expect(ghToken).toBeDefined();
      expect(ghToken?.severity).toBe('critical');
    });

    it('should detect GitHub OAuth token', () => {
      const fileContent: FileContent = {
        path: '/test/auth.ts',
        content: 'token: "gho_abcdefghijklmnopqrstuvwxyz1234567890"',
        lines: ['token: "gho_abcdefghijklmnopqrstuvwxyz1234567890"'],
      };

      const findings = detectSecrets(fileContent, patterns);

      const ghOAuth = findings.find((f) => f.type === 'github-oauth');
      expect(ghOAuth).toBeDefined();
    });
  });

  describe('Private Key Detection', () => {
    it('should detect RSA private key', () => {
      const fileContent: FileContent = {
        path: '/test/key.pem',
        content: '-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA...\n-----END RSA PRIVATE KEY-----',
        lines: [
          '-----BEGIN RSA PRIVATE KEY-----',
          'MIIEpAIBAAKCAQEA...',
          '-----END RSA PRIVATE KEY-----',
        ],
      };

      const findings = detectSecrets(fileContent, patterns);

      const rsaKey = findings.find((f) => f.type === 'rsa-private-key');
      expect(rsaKey).toBeDefined();
      expect(rsaKey?.severity).toBe('critical');
    });

    it('should detect SSH private key', () => {
      const fileContent: FileContent = {
        path: '/test/id_rsa',
        content: '-----BEGIN OPENSSH PRIVATE KEY-----\nb3BlbnNzaC1rZXk...\n-----END OPENSSH PRIVATE KEY-----',
        lines: [
          '-----BEGIN OPENSSH PRIVATE KEY-----',
          'b3BlbnNzaC1rZXk...',
          '-----END OPENSSH PRIVATE KEY-----',
        ],
      };

      const findings = detectSecrets(fileContent, patterns);

      const sshKey = findings.find((f) => f.type === 'openssh-private-key');
      expect(sshKey).toBeDefined();
    });
  });

  describe('Entropy-based Detection', () => {
    it('should find high entropy strings when enabled', () => {
      const fileContent: FileContent = {
        path: '/test/config.ts',
        content: 'const secret = "kJ8h3nP9xL2vQ4wR7tY6uI5oP1aS3dF9gH2jK4lM6nB8v";',
        lines: ['const secret = "kJ8h3nP9xL2vQ4wR7tY6uI5oP1aS3dF9gH2jK4lM6nB8v";'],
      };

      const findings = detectSecrets(fileContent, patterns, true, 4.5);

      const entropyFinding = findings.find((f) => f.type === 'high-entropy-string');
      expect(entropyFinding).toBeDefined();
      expect(entropyFinding?.severity).toBe('medium');
    });

    it('should not find high entropy when disabled', () => {
      const fileContent: FileContent = {
        path: '/test/config.ts',
        content: 'const secret = "kJ8h3nP9xL2vQ4wR7tY6uI5oP1aS3dF9gH2jK4lM6nB8v";',
        lines: ['const secret = "kJ8h3nP9xL2vQ4wR7tY6uI5oP1aS3dF9gH2jK4lM6nB8v";'],
      };

      const findings = detectSecrets(fileContent, patterns, false);

      const entropyFindings = findings.filter((f) => f.type === 'high-entropy-string');
      expect(entropyFindings.length).toBe(0);
    });
  });

  describe('Obfuscation', () => {
    it('should obfuscate secret values in findings', () => {
      const fileContent: FileContent = {
        path: '/test/config.ts',
        content: "const key = 'AKIAIOSFODNN7EXAMPLE';",
        lines: ["const key = 'AKIAIOSFODNN7EXAMPLE';"],
      };

      const findings = detectSecrets(fileContent, patterns);

      const awsKey = findings.find((f) => f.type === 'aws-access-key-id');
      expect(awsKey?.match).not.toBe('AKIAIOSFODNN7EXAMPLE');
      expect(awsKey?.match).toContain('***');
      expect(awsKey?.match).toMatch(/^AKIA\*{3}MPLE$/);
    });
  });

  describe('Deduplication', () => {
    it('should remove duplicate findings', () => {
      const fileContent: FileContent = {
        path: '/test/config.ts',
        content: "const key1 = 'AKIAIOSFODNN7EXAMPLE';\nconst key2 = 'AKIAIOSFODNN7EXAMPLE';",
        lines: ["const key1 = 'AKIAIOSFODNN7EXAMPLE';", "const key2 = 'AKIAIOSFODNN7EXAMPLE';"],
      };

      const findings = detectSecrets(fileContent, patterns);

      // Should find 2 instances on different lines
      const awsKeys = findings.filter((f) => f.type === 'aws-access-key-id');
      expect(awsKeys.length).toBe(2);

      // Each should have different line numbers
      expect(awsKeys[0].line).not.toBe(awsKeys[1].line);
    });
  });

  describe('Line and Column Tracking', () => {
    it('should track correct line numbers', () => {
      const fileContent: FileContent = {
        path: '/test/multi.ts',
        content: 'line1\nline2\nconst key = "AKIAIOSFODNN7EXAMPLE";\nline4',
        lines: ['line1', 'line2', 'const key = "AKIAIOSFODNN7EXAMPLE";', 'line4'],
      };

      const findings = detectSecrets(fileContent, patterns);

      const awsKey = findings.find((f) => f.type === 'aws-access-key-id');
      expect(awsKey?.line).toBe(3);
    });

    it('should track correct column position', () => {
      const fileContent: FileContent = {
        path: '/test/config.ts',
        content: '    const key = "AKIAIOSFODNN7EXAMPLE";',
        lines: ['    const key = "AKIAIOSFODNN7EXAMPLE";'],
      };

      const findings = detectSecrets(fileContent, patterns);

      const awsKey = findings.find((f) => f.type === 'aws-access-key-id');
      expect(awsKey?.column).toBeGreaterThan(0);
    });
  });

  describe('Context Capturing', () => {
    it('should capture line context', () => {
      const fileContent: FileContent = {
        path: '/test/config.ts',
        content: "const awsKey = 'AKIAIOSFODNN7EXAMPLE';",
        lines: ["const awsKey = 'AKIAIOSFODNN7EXAMPLE';"],
      };

      const findings = detectSecrets(fileContent, patterns);

      const awsKey = findings.find((f) => f.type === 'aws-access-key-id');
      expect(awsKey?.context).toBe("const awsKey = 'AKIAIOSFODNN7EXAMPLE';");
    });
  });
});
