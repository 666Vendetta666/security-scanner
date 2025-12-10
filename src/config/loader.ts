import { cosmiconfig } from 'cosmiconfig';
import { ScanConfig } from '../types/index.js';

const DEFAULT_CONFIG: Partial<ScanConfig> = {
  ignore: [],
  customPatterns: [],
  enableEntropy: false,
  entropyThreshold: 4.5,
  outputFormat: 'terminal',
  enableValidation: false,
  parallel: true,
  workers: 4,
};

/**
 * Load configuration from various sources
 * Searches for .secscanrc, .secscanrc.json, .secscanrc.js, etc.
 */
export async function loadConfig(searchFrom?: string): Promise<Partial<ScanConfig>> {
  const explorer = cosmiconfig('secscan');

  try {
    const result = await explorer.search(searchFrom);

    if (result && result.config) {
      return {
        ...DEFAULT_CONFIG,
        ...result.config,
      };
    }
  } catch (error) {
    console.warn('Warning: Error loading config file:', error);
  }

  return DEFAULT_CONFIG;
}

/**
 * Merge config from multiple sources (file + CLI options)
 */
export function mergeConfig(
  fileConfig: Partial<ScanConfig>,
  cliOptions: Partial<ScanConfig>
): ScanConfig {
  return {
    path: cliOptions.path || fileConfig.path || process.cwd(),
    ignore: [...(fileConfig.ignore || []), ...(cliOptions.ignore || [])],
    customPatterns: [...(fileConfig.customPatterns || []), ...(cliOptions.customPatterns || [])],
    enableEntropy: cliOptions.enableEntropy ?? fileConfig.enableEntropy ?? false,
    entropyThreshold: cliOptions.entropyThreshold ?? fileConfig.entropyThreshold ?? 4.5,
    outputFormat: cliOptions.outputFormat || fileConfig.outputFormat || 'terminal',
    enableValidation: cliOptions.enableValidation ?? fileConfig.enableValidation ?? false,
    parallel: cliOptions.parallel ?? fileConfig.parallel ?? true,
    workers: cliOptions.workers ?? fileConfig.workers ?? 4,
  };
}
