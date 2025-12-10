# Publishing Guide

This guide will help you publish `@onamfc/security-scanner` to GitHub and npm.

## ✅ Pre-Publishing Checklist

All items completed:

- ✅ Package name: `@onamfc/security-scanner`
- ✅ Author: `onamfc`
- ✅ Repository: `https://github.com/onamfc/security-scanner`
- ✅ LICENSE: MIT with copyright holder
- ✅ All tests passing (56/56)
- ✅ Build succeeds
- ✅ TypeScript compiles
- ✅ ESLint passes
- ✅ CHANGELOG.md created
- ✅ GitHub Actions workflows created
- ✅ README updated with correct package name

## 📦 Package Contents

Verified with `npm pack --dry-run`:
- Package size: 98.7 kB
- Unpacked size: 453.0 kB
- Total files: 19
- Includes: dist/, README.md, LICENSE

## 🚀 Publishing to GitHub

### 1. Initialize Git Repository (if not already done)

```bash
git init
git add .
git commit -m "Initial release v1.0.0

Features:
- 50+ secret detection patterns
- 30+ SAST vulnerability patterns
- Parallel scanning with worker threads
- Multiple output formats (terminal, JSON, SARIF)
- Comprehensive test suite (56 tests)
- CLI and programmatic API"
```

### 2. Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `security-scanner`
3. Owner: `onamfc`
4. Description: "Enterprise-grade CLI security scanner for detecting secrets and vulnerabilities in codebases"
5. Public repository
6. **Do NOT** initialize with README (we already have one)
7. Click "Create repository"

### 3. Push to GitHub

```bash
git remote add origin https://github.com/onamfc/security-scanner.git
git branch -M main
git push -u origin main
```

### 4. Create GitHub Release

1. Go to https://github.com/onamfc/security-scanner/releases/new
2. Tag version: `v1.0.0`
3. Release title: `v1.0.0 - Initial Release`
4. Description: Copy from CHANGELOG.md
5. Click "Publish release"

**Note**: Publishing a release will automatically trigger the npm publish workflow (see `.github/workflows/publish.yml`)

## 📦 Publishing to NPM

### Option 1: Automatic (via GitHub Release) - RECOMMENDED

1. Set up npm token in GitHub Secrets:
   - Generate npm token: https://www.npmjs.com/settings/YOUR_USERNAME/tokens
   - Create "Automation" token
   - Add to GitHub: Settings → Secrets → Actions → New secret
   - Name: `NPM_TOKEN`
   - Value: Your npm token

2. Create a GitHub release (see above)
   - The `.github/workflows/publish.yml` workflow will automatically:
     - Run tests
     - Build the project
     - Publish to npm with `--provenance` flag

### Option 2: Manual Publishing

```bash
# 1. Make sure you're logged in to npm
npm login

# 2. Run all checks
npm run build
npm run typecheck
npm run lint
npm run test:run

# 3. Publish to npm (scoped packages require --access public)
npm publish --access public

# 4. Verify publication
npm view @onamfc/security-scanner
```

## 🔧 Post-Publishing

### Update CHANGELOG.md for next release

Add a new "Unreleased" section:

```markdown
## [Unreleased]

### Added

### Changed

### Fixed

## [1.0.0] - 2025-01-XX
...
```

### Add badges to README.md (optional)

```markdown
[![npm version](https://badge.fury.io/js/%40onamfc%2Fsecurity-scanner.svg)](https://badge.fury.io/js/%40onamfc%2Fsecurity-scanner)
[![CI](https://github.com/onamfc/security-scanner/workflows/CI/badge.svg)](https://github.com/onamfc/security-scanner/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
```

### Test the published package

```bash
# Install globally
npm install -g @onamfc/security-scanner

# Test it
secscan --help
secscan scan ./some-project

# Or use npx
npx @onamfc/security-scanner scan .
```

## 🔄 Future Releases

For subsequent releases:

1. Update version in `package.json`:
   ```bash
   npm version patch  # 1.0.1
   npm version minor  # 1.1.0
   npm version major  # 2.0.0
   ```

2. Update CHANGELOG.md with new version section

3. Commit changes:
   ```bash
   git add .
   git commit -m "chore: bump version to x.x.x"
   git push
   ```

4. Create GitHub release with new tag

5. Workflow will automatically publish to npm

## 📊 GitHub Actions Workflows

### CI Workflow (`.github/workflows/ci.yml`)
- Runs on: Push to main/develop, Pull Requests
- Tests on: Node 18.x, 20.x, 22.x
- Steps: Type check, lint, test, build
- Includes code coverage with Codecov

### Publish Workflow (`.github/workflows/publish.yml`)
- Runs on: Release published
- Steps: Type check, lint, test, build, publish to npm
- Uses: npm provenance for enhanced security

## 🔐 Security

The package includes:
- Provenance attestation (via `--provenance` flag)
- GitHub Actions security best practices
- No secrets in code
- Scoped package name (`@onamfc/`)

## 📝 Notes

- First publish must use `--access public` for scoped packages
- Subsequent publishes will remember this setting
- Consider enabling 2FA on npm account for security
- GitHub Actions will show build status on releases

## 🆘 Troubleshooting

### "You do not have permission to publish"
- Make sure you're logged in: `npm whoami`
- For scoped packages, use: `npm publish --access public`

### "Version already published"
- Bump version in package.json
- Or use: `npm version patch`

### GitHub Actions failing
- Check npm token is set in GitHub Secrets
- Verify token has publish permissions
- Check workflow logs for specific errors

## ✨ Success!

Once published, your package will be available at:
- npm: https://www.npmjs.com/package/@onamfc/security-scanner
- GitHub: https://github.com/onamfc/security-scanner

Users can install with:
```bash
npm install -g @onamfc/security-scanner
```
