import ora from 'ora';
import { Worker } from 'worker_threads';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { ScanConfig, ScanResult, ScanFinding, SecretPattern } from '../types/index.js';
import { scanFiles, FileContent } from './file-scanner.js';
import { detectSecrets } from './secret-detector.js';
import { loadPatternsWithCustom } from '../patterns/loader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Main scanner function - orchestrates the entire scanning process
 */
export async function scan(config: ScanConfig): Promise<ScanResult> {
  const startTime = Date.now();
  const spinner = ora('Initializing scanner...').start();

  try {
    // Load patterns
    spinner.text = 'Loading detection patterns...';
    const patterns = loadPatternsWithCustom(config.customPatterns);

    // Scan directory for files
    spinner.text = 'Scanning directory for files...';
    const fileContents = await scanFiles(config.path, config.ignore);

    // Analyze files (parallel or sequential based on config)
    spinner.text = `Analyzing ${fileContents.length} files...`;
    let allFindings: ScanFinding[] = [];
    let errors: string[] = [];

    if (config.parallel && fileContents.length > 10) {
      // Use parallel scanning for larger codebases
      const result = await scanParallel(
        fileContents,
        patterns,
        config.enableEntropy ?? false,
        config.entropyThreshold ?? 4.5,
        config.workers ?? 4
      );
      allFindings = result.findings;
      errors = result.errors;
    } else {
      // Use sequential scanning for small codebases
      for (const fileContent of fileContents) {
        try {
          const findings = detectSecrets(
            fileContent,
            patterns,
            config.enableEntropy,
            config.entropyThreshold
          );
          allFindings.push(...findings);
        } catch (error) {
          errors.push(`Error scanning ${fileContent.path}: ${error}`);
        }
      }
    }

    const duration = Date.now() - startTime;

    spinner.succeed(`Scan complete! Found ${allFindings.length} potential issues in ${duration}ms`);

    return {
      findings: allFindings,
      filesScanned: fileContents.length,
      duration,
      errors,
    };
  } catch (error) {
    spinner.fail('Scan failed');
    throw error;
  }
}

/**
 * Scan files in parallel using worker threads
 */
async function scanParallel(
  fileContents: FileContent[],
  patterns: SecretPattern[],
  enableEntropy: boolean,
  entropyThreshold: number,
  workerCount: number
): Promise<{ findings: ScanFinding[]; errors: string[] }> {
  // Divide files among workers
  const chunkSize = Math.ceil(fileContents.length / workerCount);
  const chunks: FileContent[][] = [];

  for (let i = 0; i < fileContents.length; i += chunkSize) {
    chunks.push(fileContents.slice(i, i + chunkSize));
  }

  // Create workers and collect results
  const workerPromises = chunks.map((chunk) => {
    return new Promise<{ findings: ScanFinding[]; errors: string[] }>((resolve, reject) => {
      // Worker file is built to dist/scanner-worker.js
      const workerPath = join(__dirname, 'scanner-worker.js');

      const worker = new Worker(workerPath, {
        workerData: {
          fileContents: chunk,
          patterns,
          enableEntropy,
          entropyThreshold,
        },
      });

      worker.on('message', (result) => {
        resolve(result);
      });

      worker.on('error', (error) => {
        reject(error);
      });

      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  });

  // Wait for all workers to complete
  const results = await Promise.all(workerPromises);

  // Combine results
  const allFindings: ScanFinding[] = [];
  const allErrors: string[] = [];

  for (const result of results) {
    allFindings.push(...result.findings);
    allErrors.push(...result.errors);
  }

  return {
    findings: allFindings,
    errors: allErrors,
  };
}
