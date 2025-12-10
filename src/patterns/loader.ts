import { SecretPattern } from '../types/index.js';
import { getSecretPatterns } from './secrets.js';
import { getVulnerabilityPatterns } from './vulnerabilities.js';

/**
 * Load all patterns (secrets + vulnerabilities)
 */
export function loadAllPatterns(): SecretPattern[] {
  return [...getSecretPatterns(), ...getVulnerabilityPatterns()];
}

/**
 * Load patterns by category
 */
export function loadPatternsByCategory(category: 'secret' | 'sast' | 'all'): SecretPattern[] {
  if (category === 'all') {
    return loadAllPatterns();
  }
  return loadAllPatterns().filter((p) => p.category === category);
}

/**
 * Load patterns with custom patterns merged
 */
export function loadPatternsWithCustom(customPatterns: SecretPattern[] = []): SecretPattern[] {
  return [...loadAllPatterns(), ...customPatterns];
}

/**
 * Get pattern by ID
 */
export function getPatternById(id: string): SecretPattern | undefined {
  return loadAllPatterns().find((p) => p.id === id);
}
