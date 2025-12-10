import { ScanFinding, SecretPattern } from '../types/index.js';
import { FileContent } from './file-scanner.js';
import { findHighEntropyStrings } from './entropy.js';

/**
 * Detect secrets in file content using patterns
 */
export function detectSecrets(
  fileContent: FileContent,
  patterns: SecretPattern[],
  enableEntropy: boolean = false,
  entropyThreshold: number = 4.5
): ScanFinding[] {
  const findings: ScanFinding[] = [];

  // Pattern-based detection
  for (const pattern of patterns) {
    const matches = findPatternMatches(fileContent, pattern);
    findings.push(...matches);
  }

  // Entropy-based detection (optional)
  if (enableEntropy) {
    const entropyFindings = detectHighEntropySecrets(fileContent, entropyThreshold);
    findings.push(...entropyFindings);
  }

  // Remove duplicates
  return deduplicateFindings(findings);
}

/**
 * Find all matches for a given pattern in file content
 */
function findPatternMatches(fileContent: FileContent, pattern: SecretPattern): ScanFinding[] {
  const findings: ScanFinding[] = [];

  fileContent.lines.forEach((line, lineIndex) => {
    let match;
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);

    while ((match = regex.exec(line)) !== null) {
      // Skip if keywords are specified and not present
      if (pattern.keywords && pattern.keywords.length > 0) {
        const hasKeyword = pattern.keywords.some((keyword) =>
          line.toLowerCase().includes(keyword.toLowerCase())
        );
        if (!hasKeyword) {
          continue;
        }
      }

      findings.push({
        type: pattern.id,
        description: pattern.description,
        severity: pattern.severity,
        file: fileContent.path,
        line: lineIndex + 1,
        column: match.index + 1,
        match: obfuscateSecret(match[0]),
        context: line.trim(),
        category: pattern.category,
      });
    }
  });

  return findings;
}

/**
 * Detect high-entropy secrets
 */
function detectHighEntropySecrets(fileContent: FileContent, threshold: number): ScanFinding[] {
  const findings: ScanFinding[] = [];

  fileContent.lines.forEach((line, lineIndex) => {
    const highEntropyStrings = findHighEntropyStrings(line, 20, threshold);

    highEntropyStrings.forEach((item) => {
      findings.push({
        type: 'high-entropy-string',
        description: `High Entropy String (${item.entropy.toFixed(2)})`,
        severity: 'medium',
        file: fileContent.path,
        line: lineIndex + 1,
        column: item.index + 1,
        match: obfuscateSecret(item.value),
        context: line.trim(),
        category: 'secret',
      });
    });
  });

  return findings;
}

/**
 * Obfuscate secret values in output (show first 4 chars + ***)
 */
function obfuscateSecret(secret: string): string {
  if (secret.length <= 8) {
    return '***';
  }
  return secret.substring(0, 4) + '***' + secret.substring(secret.length - 4);
}

/**
 * Remove duplicate findings (same file, line, and type)
 */
function deduplicateFindings(findings: ScanFinding[]): ScanFinding[] {
  const seen = new Set<string>();
  return findings.filter((finding) => {
    const key = `${finding.file}:${finding.line}:${finding.type}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}
