export interface SecretPattern {
  id: string;
  description: string;
  regex: RegExp;
  keywords?: string[];
  severity: Severity;
  category: 'secret' | 'sast';
}

export interface ScanFinding {
  type: string;
  description: string;
  severity: Severity;
  file: string;
  line: number;
  column: number;
  match: string;
  context?: string;
  category: 'secret' | 'sast';
}

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export type OutputFormat = 'terminal' | 'json' | 'sarif';

export interface ScanConfig {
  path: string;
  ignore?: string[];
  customPatterns?: SecretPattern[];
  enableEntropy?: boolean;
  entropyThreshold?: number;
  outputFormat?: OutputFormat;
  enableValidation?: boolean;
  parallel?: boolean;
  workers?: number;
}

export interface ScanResult {
  findings: ScanFinding[];
  filesScanned: number;
  duration: number;
  errors: string[];
}

export interface SARIFOutput {
  version: '2.1.0';
  $schema: string;
  runs: SARIFRun[];
}

export interface SARIFRun {
  tool: {
    driver: {
      name: string;
      version: string;
      informationUri?: string;
      rules: SARIFRule[];
    };
  };
  results: SARIFResult[];
}

export interface SARIFRule {
  id: string;
  shortDescription: {
    text: string;
  };
  fullDescription?: {
    text: string;
  };
  helpUri?: string;
  properties?: {
    category?: string;
    severity?: string;
  };
}

export interface SARIFResult {
  ruleId: string;
  message: {
    text: string;
  };
  locations: Array<{
    physicalLocation: {
      artifactLocation: {
        uri: string;
      };
      region: {
        startLine: number;
        startColumn: number;
      };
    };
  }>;
  level: 'error' | 'warning' | 'note';
}
