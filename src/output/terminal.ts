import chalk from 'chalk';
import Table from 'cli-table3';
import { ScanResult } from '../types/index.js';

/**
 * Format scan results for terminal output with colors
 */
export function formatTerminalOutput(result: ScanResult): string {
  const output: string[] = [];

  output.push(chalk.bold('\n🔍 Security Scan Results\n'));
  output.push(chalk.gray('─'.repeat(80)));

  if (result.findings.length === 0) {
    output.push(chalk.green.bold('\n✓ No security issues found!\n'));
    output.push(chalk.gray(`Files scanned: ${result.filesScanned}`));
    output.push(chalk.gray(`Duration: ${result.duration}ms\n`));
    return output.join('\n');
  }

  // Group findings by severity
  const critical = result.findings.filter((f) => f.severity === 'critical');
  const high = result.findings.filter((f) => f.severity === 'high');
  const medium = result.findings.filter((f) => f.severity === 'medium');
  const low = result.findings.filter((f) => f.severity === 'low');

  // Summary
  output.push(chalk.red.bold(`\n✖ Found ${result.findings.length} security issues:\n`));
  if (critical.length > 0) output.push(chalk.red(`  • ${critical.length} Critical`));
  if (high.length > 0) output.push(chalk.redBright(`  • ${high.length} High`));
  if (medium.length > 0) output.push(chalk.yellow(`  • ${medium.length} Medium`));
  if (low.length > 0) output.push(chalk.blue(`  • ${low.length} Low`));

  output.push(chalk.gray('\n' + '─'.repeat(80) + '\n'));

  // Detailed findings table
  const table = new Table({
    head: [
      chalk.bold('Severity'),
      chalk.bold('Type'),
      chalk.bold('File'),
      chalk.bold('Line'),
      chalk.bold('Description'),
    ],
    colWidths: [12, 30, 40, 8, 50],
    wordWrap: true,
    wrapOnWordBoundary: true,
  });

  // Sort by severity (critical -> high -> medium -> low)
  const sortedFindings = [...critical, ...high, ...medium, ...low];

  sortedFindings.forEach((finding) => {
    table.push([
      getSeverityBadge(finding.severity),
      chalk.cyan(finding.type),
      formatFilePath(finding.file),
      chalk.gray(finding.line.toString()),
      chalk.white(finding.description),
    ]);
  });

  output.push(table.toString());

  // Statistics
  output.push(chalk.gray('\n' + '─'.repeat(80)));
  output.push(chalk.gray(`\nFiles scanned: ${result.filesScanned}`));
  output.push(chalk.gray(`Duration: ${result.duration}ms`));

  if (result.errors.length > 0) {
    output.push(chalk.yellow(`\n⚠ Warnings: ${result.errors.length}`));
    result.errors.forEach((error) => {
      output.push(chalk.yellow(`  • ${error}`));
    });
  }

  output.push('');

  return output.join('\n');
}

/**
 * Get colored severity badge
 */
function getSeverityBadge(severity: string): string {
  switch (severity) {
    case 'critical':
      return chalk.bgRed.white.bold(' CRITICAL ');
    case 'high':
      return chalk.bgRedBright.white.bold('   HIGH   ');
    case 'medium':
      return chalk.bgYellow.black.bold('  MEDIUM  ');
    case 'low':
      return chalk.bgBlue.white.bold('   LOW    ');
    default:
      return chalk.bgGray.white.bold('  UNKNOWN ');
  }
}

/**
 * Format file path (truncate if too long)
 */
function formatFilePath(path: string, maxLength: number = 40): string {
  if (path.length <= maxLength) {
    return chalk.gray(path);
  }

  const parts = path.split('/');
  if (parts.length <= 2) {
    return chalk.gray('...' + path.slice(-(maxLength - 3)));
  }

  return chalk.gray('.../' + parts.slice(-2).join('/'));
}

/**
 * Print a simple summary
 */
export function printSummary(result: ScanResult): void {
  if (result.findings.length === 0) {
    console.log(chalk.green.bold('\n✓ No security issues found!'));
  } else {
    console.log(chalk.red.bold(`\n✖ Found ${result.findings.length} security issues`));
  }
  console.log(chalk.gray(`Files scanned: ${result.filesScanned}`));
  console.log(chalk.gray(`Duration: ${result.duration}ms\n`));
}
