import { ScanResult, SARIFOutput, SARIFRule, SARIFResult } from '../types/index.js';

/**
 * Format scan results as SARIF 2.1.0
 * https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html
 */
export function formatSarifOutput(result: ScanResult, toolVersion: string = '1.0.0'): string {
  const sarif: SARIFOutput = {
    version: '2.1.0',
    $schema: 'https://json.schemastore.org/sarif-2.1.0.json',
    runs: [
      {
        tool: {
          driver: {
            name: 'SecurityScanner',
            version: toolVersion,
            informationUri: 'https://github.com/yourusername/security-scanner',
            rules: generateRules(result),
          },
        },
        results: generateResults(result),
      },
    ],
  };

  return JSON.stringify(sarif, null, 2);
}

/**
 * Generate SARIF rules from findings
 */
function generateRules(result: ScanResult): SARIFRule[] {
  const uniqueTypes = new Set(result.findings.map((f) => f.type));
  const rules: SARIFRule[] = [];

  uniqueTypes.forEach((type) => {
    const finding = result.findings.find((f) => f.type === type)!;
    rules.push({
      id: type,
      shortDescription: {
        text: finding.description,
      },
      fullDescription: {
        text: finding.description,
      },
      properties: {
        category: finding.category,
        severity: finding.severity,
      },
    });
  });

  return rules;
}

/**
 * Generate SARIF results from findings
 */
function generateResults(result: ScanResult): SARIFResult[] {
  return result.findings.map((finding) => ({
    ruleId: finding.type,
    message: {
      text: `${finding.description}: ${finding.match}`,
    },
    locations: [
      {
        physicalLocation: {
          artifactLocation: {
            uri: finding.file,
          },
          region: {
            startLine: finding.line,
            startColumn: finding.column,
          },
        },
      },
    ],
    level: severityToLevel(finding.severity),
  }));
}

/**
 * Convert severity to SARIF level
 */
function severityToLevel(severity: string): 'error' | 'warning' | 'note' {
  switch (severity) {
    case 'critical':
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    case 'low':
    default:
      return 'note';
  }
}
