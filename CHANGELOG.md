# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-XX

### Added
- 🔐 **Secret Detection** with 50+ patterns for API keys, tokens, and credentials
  - AWS, GitHub, Slack, Stripe, Google Cloud, Azure credentials
  - Private keys (RSA, SSH, PGP, EC, DSA)
  - Database connection strings
  - Generic API keys and OAuth tokens
- 🛡️ **SAST Vulnerability Detection** with 30+ patterns
  - SQL Injection detection
  - Cross-Site Scripting (XSS)
  - Command Injection
  - Path Traversal
  - Hardcoded Credentials
  - Weak Cryptography (MD5, SHA1)
  - CORS Misconfiguration
  - Open Redirects
  - JWT vulnerabilities
  - And more...
- 🧠 **Entropy Analysis** using Shannon entropy calculation for unknown secrets
- ⚡ **Parallel Scanning** with worker threads for improved performance
  - Automatic parallel/sequential mode selection
  - Configurable worker count (default: 4)
  - Processes 10,000+ files efficiently
- 📊 **Multiple Output Formats**
  - Terminal output with colored tables and severity badges
  - JSON format for programmatic consumption
  - SARIF 2.1.0 format for CI/CD integration (GitHub Security, VS Code)
- ⚙️ **Flexible Configuration**
  - `.secscanrc.json`, `.secscanrc.js`, or `package.json` configuration
  - Custom pattern support
  - Configurable ignore patterns
  - Entropy threshold customization
- 🎯 **Smart Filtering**
  - Respects `.gitignore` patterns
  - Automatic binary file detection and skipping
  - Pattern-based file exclusion
- 🔧 **CLI Commands**
  - `secscan scan` - Scan directories for security issues
  - `secscan patterns` - List all detection patterns
  - `secscan init` - Create configuration file
- 📚 **Programmatic API** for library usage
- ✅ **Comprehensive Test Suite** with 56 tests
  - Unit tests for core functionality
  - Integration tests for end-to-end scanning
  - Test fixtures for pattern validation
- 🚀 **CI/CD Integration**
  - GitHub Actions workflow examples
  - Pre-commit hook support
  - Exit codes for pipeline integration (0=clean, 1=issues, 2=error)

### Features
- Built with TypeScript for type safety
- ESM and CommonJS support
- Node.js 18+ compatibility
- Fast file discovery with fast-glob
- Line-by-line scanning for memory efficiency
- Secret obfuscation in output (shows first/last 4 chars)
- Deduplication of findings
- Context-aware detection with keyword filtering

### Documentation
- Comprehensive README with usage examples
- QUICKSTART guide for quick setup
- Example configuration file
- CLAUDE.md for AI-assisted development

[1.0.0]: https://github.com/onamfc/security-scanner/releases/tag/v1.0.0
