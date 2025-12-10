import { Command } from 'commander';
import { scan } from './scanner/index.js';
import { loadConfig, mergeConfig } from './config/loader.js';
import { formatTerminalOutput } from './output/terminal.js';
import { formatJsonOutput } from './output/json.js';
import { formatSarifOutput } from './output/sarif.js';
import { ScanConfig, OutputFormat } from './types/index.js';
import { writeFileSync } from 'fs';

const program = new Command();

program
  .name('secscan')
  .description('Enterprise-grade security scanner for detecting secrets and vulnerabilities')
  .version('1.0.0');

program
  .command('scan')
  .description('Scan a directory for security issues')
  .argument('[path]', 'Path to scan', process.cwd())
  .option('-o, --output <format>', 'Output format (terminal, json, sarif)', 'terminal')
  .option('-f, --file <path>', 'Write output to file instead of stdout')
  .option('--entropy', 'Enable entropy-based detection')
  .option('--entropy-threshold <number>', 'Entropy threshold (default: 4.5)', '4.5')
  .option('--ignore <patterns...>', 'Additional ignore patterns')
  .option('--no-parallel', 'Disable parallel scanning')
  .option('--workers <number>', 'Number of worker threads', '4')
  .action(async (path: string, options) => {
    try {
      // Load config from file
      const fileConfig = await loadConfig(path);

      // Merge with CLI options
      const cliOptions: Partial<ScanConfig> = {
        path,
        outputFormat: options.output as OutputFormat,
        enableEntropy: options.entropy,
        entropyThreshold: parseFloat(options.entropyThreshold),
        ignore: options.ignore,
        parallel: options.parallel,
        workers: parseInt(options.workers),
      };

      const config = mergeConfig(fileConfig, cliOptions);

      // Run scan
      const result = await scan(config);

      // Format output
      let output: string;
      switch (config.outputFormat) {
        case 'json':
          output = formatJsonOutput(result);
          break;
        case 'sarif':
          output = formatSarifOutput(result);
          break;
        case 'terminal':
        default:
          output = formatTerminalOutput(result);
          break;
      }

      // Write to file or stdout
      if (options.file) {
        writeFileSync(options.file, output);
        console.log(`Results written to ${options.file}`);
      } else {
        console.log(output);
      }

      // Exit with appropriate code
      // 0 = no issues, 1 = issues found, 2 = error
      if (result.findings.length > 0) {
        process.exit(1);
      } else {
        process.exit(0);
      }
    } catch (error) {
      console.error('Error:', error);
      process.exit(2);
    }
  });

program
  .command('patterns')
  .description('List all detection patterns')
  .option('-c, --category <type>', 'Filter by category (secret, sast, all)', 'all')
  .option('-s, --severity <level>', 'Filter by severity (critical, high, medium, low)')
  .action(async (options) => {
    const { loadPatternsByCategory } = await import('./patterns/loader.js');
    let patterns = loadPatternsByCategory(options.category);

    if (options.severity) {
      patterns = patterns.filter((p) => p.severity === options.severity);
    }

    console.log(`\nFound ${patterns.length} patterns:\n`);
    patterns.forEach((pattern) => {
      console.log(`• [${pattern.severity.toUpperCase()}] ${pattern.id}`);
      console.log(`  ${pattern.description}`);
      console.log(`  Category: ${pattern.category}\n`);
    });
  });

program
  .command('init')
  .description('Create a default configuration file')
  .option('-f, --format <type>', 'Config file format (json, js)', 'json')
  .action((options) => {
    const defaultConfig = {
      ignore: ['**/node_modules/**', '**/dist/**', '**/.git/**'],
      customPatterns: [],
      enableEntropy: false,
      entropyThreshold: 4.5,
      outputFormat: 'terminal',
      parallel: true,
      workers: 4,
    };

    const filename = options.format === 'js' ? '.secscanrc.js' : '.secscanrc.json';
    const content =
      options.format === 'js'
        ? `module.exports = ${JSON.stringify(defaultConfig, null, 2)};`
        : JSON.stringify(defaultConfig, null, 2);

    writeFileSync(filename, content);
    console.log(`Created ${filename}`);
  });

program.parse();
