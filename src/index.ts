// Main exports for programmatic usage
export { scan } from './scanner/index.js';
export { loadConfig, mergeConfig } from './config/loader.js';
export { formatTerminalOutput, printSummary } from './output/terminal.js';
export { formatJsonOutput, formatCompactJsonOutput } from './output/json.js';
export { formatSarifOutput } from './output/sarif.js';

// Type exports
export type {
  ScanConfig,
  ScanResult,
  ScanFinding,
  SecretPattern,
  Severity,
  OutputFormat,
} from './types/index.js';

// Pattern exports
export { getSecretPatterns, getPatternsBySeverity } from './patterns/secrets.js';
export {
  getVulnerabilityPatterns,
  getVulnerabilityPatternsBySeverity,
} from './patterns/vulnerabilities.js';
export { loadAllPatterns, loadPatternsByCategory } from './patterns/loader.js';

// Utility exports
export { calculateEntropy, hasHighEntropy, findHighEntropyStrings } from './scanner/entropy.js';
