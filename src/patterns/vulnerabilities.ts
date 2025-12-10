import { SecretPattern } from '../types/index.js';

/**
 * SAST (Static Application Security Testing) vulnerability patterns
 * Detects common security vulnerabilities in source code
 */
export const VULNERABILITY_PATTERNS: SecretPattern[] = [
  // SQL Injection
  {
    id: 'sql-injection-concatenation',
    description: 'Potential SQL Injection - String Concatenation in Query',
    regex: /(execute|query|exec)\s*\(\s*['"`].*?(SELECT|INSERT|UPDATE|DELETE).*?\+/gi,
    keywords: ['query', 'execute', 'sql'],
    severity: 'high',
    category: 'sast',
  },
  {
    id: 'sql-injection-template',
    description: 'Potential SQL Injection - Template Literal in Query',
    regex: /(execute|query|exec)\s*\(\s*`.*?(SELECT|INSERT|UPDATE|DELETE).*?\$\{/gi,
    keywords: ['query', 'execute', 'sql'],
    severity: 'high',
    category: 'sast',
  },
  {
    id: 'sql-injection-user-input',
    description: 'Potential SQL Injection - User Input in Query',
    regex: /(WHERE|SET|VALUES)\s+.*?\+\s*(req\.|request\.|params\.|query\.|body\.)/gi,
    keywords: ['where', 'req', 'params'],
    severity: 'critical',
    category: 'sast',
  },

  // Cross-Site Scripting (XSS)
  {
    id: 'xss-innerhtml',
    description: 'Potential XSS - innerHTML with User Input',
    regex: /innerHTML\s*=\s*(req\.|request\.|params\.|query\.|body\.|input\.|user\.)/gi,
    keywords: ['innerHTML'],
    severity: 'high',
    category: 'sast',
  },
  {
    id: 'xss-dangerously-set',
    description: 'Potential XSS - dangerouslySetInnerHTML with User Input',
    regex: /dangerouslySetInnerHTML.*?(req\.|request\.|params\.|query\.|body\.|input\.|user\.)/gi,
    keywords: ['dangerouslySetInnerHTML'],
    severity: 'high',
    category: 'sast',
  },
  {
    id: 'xss-document-write',
    description: 'Potential XSS - document.write without Sanitization',
    regex: /document\.write\s*\(\s*(?!['"`])/gi,
    keywords: ['document.write'],
    severity: 'medium',
    category: 'sast',
  },
  {
    id: 'xss-eval',
    description: 'Potential XSS - eval() with User Input',
    regex: /eval\s*\(\s*(req\.|request\.|params\.|query\.|body\.|input\.|user\.)/gi,
    keywords: ['eval'],
    severity: 'critical',
    category: 'sast',
  },

  // Command Injection
  {
    id: 'command-injection-exec',
    description: 'Potential Command Injection - exec with User Input',
    regex: /(exec|spawn|execSync|spawnSync)\s*\([^)]*?(req\.|request\.|params\.|query\.|body\.)/gi,
    keywords: ['exec', 'spawn'],
    severity: 'critical',
    category: 'sast',
  },
  {
    id: 'command-injection-shell',
    description: 'Potential Command Injection - Shell Command with User Input',
    regex: /child_process\.(exec|spawn).*?(req\.|request\.|params\.|query\.|body\.)/gi,
    keywords: ['child_process'],
    severity: 'critical',
    category: 'sast',
  },

  // Path Traversal
  {
    id: 'path-traversal',
    description: 'Potential Path Traversal - User Input in File Path',
    regex:
      /(readFile|writeFile|appendFile|unlink|rmdir|mkdir)\s*\([^)]*?(req\.|request\.|params\.|query\.|body\.)/gi,
    keywords: ['readFile', 'writeFile'],
    severity: 'high',
    category: 'sast',
  },
  {
    id: 'path-traversal-join',
    description: 'Potential Path Traversal - Unsafe Path Join',
    regex: /path\.join\s*\([^)]*?(req\.|request\.|params\.|query\.|body\.)/gi,
    keywords: ['path.join'],
    severity: 'medium',
    category: 'sast',
  },

  // Hardcoded Credentials
  {
    id: 'hardcoded-password',
    description: 'Hardcoded Password',
    regex: /password\s*[:=]\s*['"`][^'"`\s]{6,}['"`]/gi,
    keywords: ['password'],
    severity: 'high',
    category: 'sast',
  },
  {
    id: 'hardcoded-secret',
    description: 'Hardcoded Secret',
    regex: /(const|let|var)\s+\w*[Ss]ecret\w*\s*[:=]\s*['"`][^'"`\s]{8,}['"`]/gi,
    keywords: ['secret'],
    severity: 'high',
    category: 'sast',
  },
  {
    id: 'hardcoded-api-key',
    description: 'Hardcoded API Key',
    regex: /(apiKey|api_key|apikey)\s*[:=]\s*['"`][^'"`\s]{20,}['"`]/gi,
    keywords: ['apikey', 'api_key'],
    severity: 'critical',
    category: 'sast',
  },

  // Insecure Randomness
  {
    id: 'weak-random',
    description: 'Weak Random Number Generator',
    regex: /Math\.random\(\)/gi,
    keywords: ['Math.random'],
    severity: 'low',
    category: 'sast',
  },

  // Insecure Cryptography
  {
    id: 'weak-hash-md5',
    description: 'Weak Cryptographic Hash - MD5',
    regex: /createHash\s*\(\s*['"`]md5['"`]\s*\)/gi,
    keywords: ['md5'],
    severity: 'medium',
    category: 'sast',
  },
  {
    id: 'weak-hash-sha1',
    description: 'Weak Cryptographic Hash - SHA1',
    regex: /createHash\s*\(\s*['"`]sha1['"`]\s*\)/gi,
    keywords: ['sha1'],
    severity: 'medium',
    category: 'sast',
  },

  // Insecure Deserialization
  {
    id: 'unsafe-deserialize',
    description: 'Potential Insecure Deserialization',
    regex: /(JSON\.parse|eval|Function)\s*\([^)]*?(req\.|request\.|params\.|query\.|body\.)/gi,
    keywords: ['JSON.parse', 'eval'],
    severity: 'high',
    category: 'sast',
  },

  // CORS Misconfiguration
  {
    id: 'cors-wildcard',
    description: 'CORS Misconfiguration - Wildcard Origin',
    regex: /Access-Control-Allow-Origin.*?\*/gi,
    keywords: ['Access-Control-Allow-Origin'],
    severity: 'medium',
    category: 'sast',
  },

  // Insecure HTTP
  {
    id: 'http-not-https',
    description: 'Insecure HTTP URL',
    regex: /http:\/\/(?!localhost|127\.0\.0\.1|0\.0\.0\.0)/gi,
    keywords: ['http://'],
    severity: 'low',
    category: 'sast',
  },

  // Debug Code in Production
  {
    id: 'console-log',
    description: 'Console.log in Production Code',
    regex: /console\.(log|debug|info|warn|error)/gi,
    keywords: ['console.log'],
    severity: 'low',
    category: 'sast',
  },
  {
    id: 'debugger-statement',
    description: 'Debugger Statement',
    regex: /\bdebugger\b/gi,
    keywords: ['debugger'],
    severity: 'low',
    category: 'sast',
  },

  // Regex Denial of Service (ReDoS)
  {
    id: 'redos-vulnerable-pattern',
    description: 'Potential ReDoS - Vulnerable Regex Pattern',
    regex: /new RegExp\([^)]*(\(.*\*.*\).*\+|\+.*\(.*\*.*\))/gi,
    keywords: ['RegExp'],
    severity: 'medium',
    category: 'sast',
  },

  // XXE (XML External Entity)
  {
    id: 'xxe-vulnerable',
    description: 'Potential XXE Vulnerability',
    regex: /parseFromString|DOMParser|XMLHttpRequest/gi,
    keywords: ['parseFromString', 'XMLHttpRequest'],
    severity: 'medium',
    category: 'sast',
  },

  // Insecure Direct Object Reference
  {
    id: 'idor-user-id',
    description: 'Potential IDOR - Direct User ID Reference',
    regex: /findById\s*\([^)]*?(req\.|request\.|params\.|query\.)/gi,
    keywords: ['findById'],
    severity: 'medium',
    category: 'sast',
  },

  // Unvalidated Redirects
  {
    id: 'open-redirect',
    description: 'Potential Open Redirect',
    regex: /redirect\s*\([^)]*?(req\.|request\.|params\.|query\.|body\.)/gi,
    keywords: ['redirect'],
    severity: 'medium',
    category: 'sast',
  },

  // JWT Without Verification
  {
    id: 'jwt-no-verify',
    description: 'JWT Decoded Without Verification',
    regex: /jwt\.decode\s*\(/gi,
    keywords: ['jwt.decode'],
    severity: 'high',
    category: 'sast',
  },

  // Sensitive Data Exposure
  {
    id: 'sensitive-data-log',
    description: 'Potential Sensitive Data in Logs',
    regex: /console\.log.*?(password|secret|token|key|credential)/gi,
    keywords: ['console.log', 'password'],
    severity: 'medium',
    category: 'sast',
  },
];

/**
 * Get all vulnerability patterns
 */
export function getVulnerabilityPatterns(): SecretPattern[] {
  return VULNERABILITY_PATTERNS;
}

/**
 * Get vulnerability patterns by severity
 */
export function getVulnerabilityPatternsBySeverity(severity: string): SecretPattern[] {
  return VULNERABILITY_PATTERNS.filter((p) => p.severity === severity);
}
