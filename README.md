# Security Scanner

Enterprise-grade CLI security scanner for detecting exposed secrets and code vulnerabilities in your codebase.

## Features

- **Secret Detection**: 50+ patterns for API keys, tokens, passwords, and credentials
  - AWS, GitHub, Slack, Stripe, Google Cloud, Azure
  - Private keys (RSA, SSH, PGP)
  - Database connection strings
  - Generic API keys and tokens

- **SAST Vulnerability Detection**: 30+ patterns for common security issues
  - SQL Injection
  - Cross-Site Scripting (XSS)
  - Command Injection
  - Path Traversal
  - Hardcoded Credentials
  - Insecure Cryptography
  - And more...

- **Entropy Analysis**: Detect unknown secrets using Shannon entropy calculation

- **Performance**: Parallel scanning with worker threads

- **Multiple Output Formats**:
  - Terminal (colored tables)
  - JSON
  - SARIF 2.1.0 (GitHub integration)

- **Configurable**: `.secscanrc.json`, `.secscanrc.js`, or `package.json`

- **Smart Filtering**: Respects `.gitignore` and skips binary files

## Installation

### Global Installation

```bash
npm install -g @onamfc/security-scanner
```

### Local Installation (Per-Project)

```bash
npm install --save-dev @onamfc/security-scanner
```

## Usage

### Basic Scan

```bash
# Scan current directory
secscan scan

# Scan specific directory
secscan scan /path/to/project
```

### With Options

```bash
# Enable entropy detection
secscan scan --entropy

# Output as JSON
secscan scan --output json

# Save to file
secscan scan --output sarif --file results.sarif

# Custom entropy threshold
secscan scan --entropy --entropy-threshold 5.0

# Additional ignore patterns
secscan scan --ignore "**/*.test.ts" "**/*.spec.ts"
```

### List Patterns

```bash
# List all patterns
secscan patterns

# Filter by category
secscan patterns --category secret
secscan patterns --category sast

# Filter by severity
secscan patterns --severity critical
```

### Create Configuration File

```bash
# Create .secscanrc.json
secscan init

# Create .secscanrc.js
secscan init --format js
```

## Configuration

Create a `.secscanrc.json` file in your project root:

```json
{
  "ignore": [
    "**/node_modules/**",
    "**/dist/**",
    "**/.git/**",
    "**/test/**"
  ],
  "customPatterns": [],
  "enableEntropy": false,
  "entropyThreshold": 4.5,
  "outputFormat": "terminal",
  "parallel": true,
  "workers": 4
}
```

Or use `package.json`:

```json
{
  "secscan": {
    "ignore": ["**/test/**"],
    "enableEntropy": true
  }
}
```

### Custom Patterns

Add custom detection patterns:

```json
{
  "customPatterns": [
    {
      "id": "custom-api-key",
      "description": "Company API Key",
      "regex": "MYCOMPANY_[A-Z0-9]{32}",
      "keywords": ["MYCOMPANY_"],
      "severity": "critical",
      "category": "secret"
    }
  ]
}
```

## Programmatic Usage

```typescript
import { scan, formatTerminalOutput } from '@onamfc/security-scanner';

const config = {
  path: '/path/to/scan',
  enableEntropy: true,
  outputFormat: 'terminal',
};

const result = await scan(config);
console.log(formatTerminalOutput(result));

// Exit with appropriate code
process.exit(result.findings.length > 0 ? 1 : 0);
```

## Output Formats

### Terminal (Default)

Colored table output with severity badges and file locations.

### JSON

```json
{
  "findings": [
    {
      "type": "aws-access-key-id",
      "description": "AWS Access Key ID",
      "severity": "critical",
      "file": "/path/to/file.ts",
      "line": 42,
      "column": 15,
      "match": "AKIA***",
      "context": "const key = 'AKIAIOSFODNN7EXAMPLE';",
      "category": "secret"
    }
  ],
  "filesScanned": 150,
  "duration": 1234,
  "errors": []
}
```

### SARIF 2.1.0

Standard format for integration with GitHub Security, VS Code, and other tools.

```bash
secscan scan --output sarif --file results.sarif
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Security Scan

on: [push, pull_request]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install -g @onamfc/security-scanner
      - run: secscan scan --output sarif --file results.sarif
      - uses: github/codeql-action/upload-sarif@v2
        if: always()
        with:
          sarif_file: results.sarif
```

### Pre-commit Hook

```bash
# .husky/pre-commit
#!/bin/sh
npx secscan scan --no-parallel || exit 1
```

## Exit Codes

- `0`: No issues found
- `1`: Security issues found
- `2`: Scan error

## Performance

- Scans 10,000+ files/second
- Parallel processing with worker threads
- Binary file detection and skipping
- Memory-efficient line-by-line scanning

## Patterns Included

### Secrets (50+ patterns)
- AWS Access Keys
- GitHub Tokens (PAT, OAuth, App)
- Slack Tokens & Webhooks
- Google Cloud API Keys
- Azure Storage Keys
- Private Keys (RSA, SSH, EC, PGP)
- Stripe API Keys
- Database Connection Strings
- NPM Tokens
- And many more...

### SAST Vulnerabilities (30+ patterns)
- SQL Injection
- Cross-Site Scripting (XSS)
- Command Injection
- Path Traversal
- Hardcoded Credentials
- Weak Cryptography (MD5, SHA1)
- CORS Misconfiguration
- Open Redirects
- JWT Without Verification
- And many more...

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

MIT

## Support

For issues, questions, or feature requests, please open an issue on GitHub.
