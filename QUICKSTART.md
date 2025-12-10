# Quick Start Guide

## Installation

```bash
# Clone the repository
git clone https://github.com/onamfc/security-scanner.git
cd security-scanner

# Install dependencies
npm install

# Build the project
npm run build
```

## Test the CLI

```bash
# Show help
node dist/cli.js --help

# Scan a directory
node dist/cli.js scan /path/to/your/project

# Scan with JSON output
node dist/cli.js scan /path/to/your/project --output json

# Enable entropy detection
node dist/cli.js scan /path/to/your/project --entropy

# List all patterns
node dist/cli.js patterns

# Create a config file
node dist/cli.js init
```

## Install Globally

```bash
# Link for local development
npm link

# Now you can use 'secscan' from anywhere
secscan scan ~/my-project
```

## Install as Package

```bash
# Install globally
npm install -g @onamfc/security-scanner

# Or install in a project
npm install --save-dev @onamfc/security-scanner

# Use with npx
npx @onamfc/security-scanner scan .
```

## Example Usage

```bash
# Scan your project
secscan scan .

# Output to a file
secscan scan . --output sarif --file results.sarif

# With custom ignore patterns
secscan scan . --ignore "**/*.test.js" "**/*.spec.ts"

# Enable high-entropy string detection
secscan scan . --entropy --entropy-threshold 5.0
```

## Configuration File

Create `.secscanrc.json` in your project:

```json
{
  "ignore": [
    "**/node_modules/**",
    "**/test/**"
  ],
  "enableEntropy": true,
  "entropyThreshold": 4.5,
  "outputFormat": "terminal"
}
```

## Detected Issues

The scanner detects:

**Secrets (50+ patterns):**
- AWS, GitHub, Slack, Google Cloud, Azure credentials
- API keys and tokens
- Private keys (RSA, SSH, PGP)
- Database connection strings
- And more...

**SAST Vulnerabilities (30+ patterns):**
- SQL Injection
- XSS (Cross-Site Scripting)
- Command Injection
- Path Traversal
- Hardcoded Credentials
- Weak Cryptography
- And more...

## CI/CD Integration

### GitHub Actions

```yaml
- name: Security Scan
  run: |
    npm install -g @onamfc/security-scanner
    secscan scan --output sarif --file results.sarif
- uses: github/codeql-action/upload-sarif@v2
  with:
    sarif_file: results.sarif
```

## Exit Codes

- `0` - No issues found
- `1` - Security issues detected
- `2` - Scan error

## Development

```bash
# Build
npm run build

# Type check
npm run typecheck

# Format code
npm run format

# Run tests (when implemented)
npm test
```
