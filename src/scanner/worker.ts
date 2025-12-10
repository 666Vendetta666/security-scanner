import { parentPort, workerData } from 'worker_threads';
import { detectSecrets } from './secret-detector.js';
import { FileContent } from './file-scanner.js';
import { SecretPattern, ScanFinding } from '../types/index.js';

interface WorkerData {
  fileContents: FileContent[];
  patterns: SecretPattern[];
  enableEntropy: boolean;
  entropyThreshold: number;
}

interface WorkerResult {
  findings: ScanFinding[];
  errors: string[];
}

// Worker thread execution
if (parentPort) {
  const { fileContents, patterns, enableEntropy, entropyThreshold } = workerData as WorkerData;

  const findings: ScanFinding[] = [];
  const errors: string[] = [];

  // Process assigned files
  for (const fileContent of fileContents) {
    try {
      const fileFindings = detectSecrets(fileContent, patterns, enableEntropy, entropyThreshold);
      findings.push(...fileFindings);
    } catch (error) {
      errors.push(`Error scanning ${fileContent.path}: ${error}`);
    }
  }

  const result: WorkerResult = {
    findings,
    errors,
  };

  parentPort.postMessage(result);
}
