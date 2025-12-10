/**
 * Calculate Shannon entropy for a string
 * Entropy measures the randomness of data (0.0 - 8.0 scale)
 * Higher entropy suggests more random data, which may indicate secrets
 */
export function calculateEntropy(str: string): number {
  if (str.length === 0) return 0;

  const frequencies = new Map<string, number>();

  // Count character frequencies
  for (const char of str) {
    frequencies.set(char, (frequencies.get(char) || 0) + 1);
  }

  // Calculate Shannon entropy
  let entropy = 0;
  const len = str.length;

  for (const count of frequencies.values()) {
    const probability = count / len;
    entropy -= probability * Math.log2(probability);
  }

  return entropy;
}

/**
 * Check if a string has high entropy (potentially a secret)
 */
export function hasHighEntropy(str: string, threshold: number = 4.5): boolean {
  return calculateEntropy(str) >= threshold;
}

/**
 * Extract high-entropy strings from text
 * Useful for finding unknown secrets that don't match patterns
 */
export function findHighEntropyStrings(
  text: string,
  minLength: number = 20,
  threshold: number = 4.5
): Array<{ value: string; entropy: number; index: number }> {
  const results: Array<{ value: string; entropy: number; index: number }> = [];

  // Match quoted strings and alphanumeric sequences
  const patterns = [/['"`]([a-zA-Z0-9_\-/+=]{20,})['"`]/g, /\b([a-zA-Z0-9_\-/+=]{32,})\b/g];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const value = match[1];

      if (value.length >= minLength) {
        const entropy = calculateEntropy(value);

        if (entropy >= threshold) {
          // Filter out common false positives
          if (!isFalsePositive(value)) {
            results.push({
              value,
              entropy,
              index: match.index,
            });
          }
        }
      }
    }
  }

  return results;
}

/**
 * Filter common false positives (UUIDs, hashes, etc.)
 */
function isFalsePositive(str: string): boolean {
  // UUID pattern
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)) {
    return true;
  }

  // SHA-256 hash
  if (/^[a-f0-9]{64}$/i.test(str)) {
    return true;
  }

  // MD5 hash
  if (/^[a-f0-9]{32}$/i.test(str)) {
    return true;
  }

  // Base64 encoded data URI
  if (str.startsWith('data:')) {
    return true;
  }

  // Very long strings (likely minified code or data)
  if (str.length > 200) {
    return true;
  }

  // All same character repeated
  if (/^(.)\1+$/.test(str)) {
    return true;
  }

  return false;
}

/**
 * Context-aware entropy detection
 * Returns true if the string has high entropy AND appears in a sensitive context
 */
export function isHighEntropySecret(
  str: string,
  context: string,
  threshold: number = 4.5
): boolean {
  if (!hasHighEntropy(str, threshold)) {
    return false;
  }

  // Check for sensitive keywords in context
  const sensitiveKeywords = [
    'api',
    'key',
    'secret',
    'token',
    'password',
    'passwd',
    'pwd',
    'auth',
    'credential',
    'private',
  ];

  const lowerContext = context.toLowerCase();
  return sensitiveKeywords.some((keyword) => lowerContext.includes(keyword));
}
