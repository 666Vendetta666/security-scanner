import { ScanResult } from '../types/index.js';

/**
 * Format scan results as JSON
 */
export function formatJsonOutput(result: ScanResult): string {
  return JSON.stringify(result, null, 2);
}

/**
 * Format scan results as compact JSON (single line)
 */
export function formatCompactJsonOutput(result: ScanResult): string {
  return JSON.stringify(result);
}
