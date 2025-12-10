import { SecretPattern } from '../types/index.js';

/**
 * Comprehensive secret detection patterns
 * Based on industry-standard patterns from TruffleHog, GitLeaks, and secrets-patterns-db
 */
export const SECRET_PATTERNS: SecretPattern[] = [
  // AWS Credentials
  {
    id: 'aws-access-key-id',
    description: 'AWS Access Key ID',
    regex: /(A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/g,
    keywords: ['aws', 'access', 'key'],
    severity: 'critical',
    category: 'secret',
  },
  {
    id: 'aws-secret-access-key',
    description: 'AWS Secret Access Key',
    regex: /aws(.{0,20})?['"][0-9a-zA-Z/+]{40}['"]/gi,
    keywords: ['aws', 'secret'],
    severity: 'critical',
    category: 'secret',
  },

  // GitHub Tokens
  {
    id: 'github-pat',
    description: 'GitHub Personal Access Token',
    regex: /ghp_[a-zA-Z0-9]{36}/g,
    severity: 'critical',
    category: 'secret',
  },
  {
    id: 'github-oauth',
    description: 'GitHub OAuth Access Token',
    regex: /gho_[a-zA-Z0-9]{36}/g,
    severity: 'critical',
    category: 'secret',
  },
  {
    id: 'github-app-token',
    description: 'GitHub App Token',
    regex: /(ghu|ghs)_[a-zA-Z0-9]{36}/g,
    severity: 'critical',
    category: 'secret',
  },
  {
    id: 'github-refresh-token',
    description: 'GitHub Refresh Token',
    regex: /ghr_[a-zA-Z0-9]{36}/g,
    severity: 'critical',
    category: 'secret',
  },

  // Slack Tokens
  {
    id: 'slack-token',
    description: 'Slack Token',
    regex: /xox[baprs]-[0-9]{10,12}-[0-9]{10,12}-[a-zA-Z0-9]{24,32}/g,
    severity: 'high',
    category: 'secret',
  },
  {
    id: 'slack-webhook',
    description: 'Slack Webhook URL',
    regex: /https:\/\/hooks\.slack\.com\/services\/T[a-zA-Z0-9_]+\/B[a-zA-Z0-9_]+\/[a-zA-Z0-9_]+/g,
    severity: 'high',
    category: 'secret',
  },

  // Google Cloud
  {
    id: 'gcp-api-key',
    description: 'Google Cloud API Key',
    regex: /AIza[0-9A-Za-z\\-_]{35}/g,
    severity: 'critical',
    category: 'secret',
  },
  {
    id: 'gcp-service-account',
    description: 'Google Service Account',
    regex: /"type":\s*"service_account"/g,
    severity: 'critical',
    category: 'secret',
  },

  // Azure
  {
    id: 'azure-storage-key',
    description: 'Azure Storage Account Key',
    regex: /DefaultEndpointsProtocol=https;AccountName=[^;]+;AccountKey=[^;]+/g,
    severity: 'critical',
    category: 'secret',
  },

  // Private Keys
  {
    id: 'rsa-private-key',
    description: 'RSA Private Key',
    regex: /-----BEGIN RSA PRIVATE KEY-----/g,
    severity: 'critical',
    category: 'secret',
  },
  {
    id: 'openssh-private-key',
    description: 'OpenSSH Private Key',
    regex: /-----BEGIN OPENSSH PRIVATE KEY-----/g,
    severity: 'critical',
    category: 'secret',
  },
  {
    id: 'dsa-private-key',
    description: 'DSA Private Key',
    regex: /-----BEGIN DSA PRIVATE KEY-----/g,
    severity: 'critical',
    category: 'secret',
  },
  {
    id: 'ec-private-key',
    description: 'EC Private Key',
    regex: /-----BEGIN EC PRIVATE KEY-----/g,
    severity: 'critical',
    category: 'secret',
  },
  {
    id: 'pgp-private-key',
    description: 'PGP Private Key',
    regex: /-----BEGIN PGP PRIVATE KEY BLOCK-----/g,
    severity: 'critical',
    category: 'secret',
  },

  // API Keys (Generic)
  {
    id: 'generic-api-key',
    description: 'Generic API Key',
    regex: /(api[_-]?key|apikey|api[_-]?secret)['":\s]*=?\s*['"][a-zA-Z0-9_-]{20,}['"]/gi,
    keywords: ['api', 'key'],
    severity: 'high',
    category: 'secret',
  },

  // Stripe
  {
    id: 'stripe-api-key',
    description: 'Stripe API Key',
    regex: /(sk|pk)_(test|live)_[0-9a-zA-Z]{24,}/g,
    severity: 'critical',
    category: 'secret',
  },

  // Twilio
  {
    id: 'twilio-api-key',
    description: 'Twilio API Key',
    regex: /SK[a-z0-9]{32}/g,
    severity: 'high',
    category: 'secret',
  },

  // SendGrid
  {
    id: 'sendgrid-api-key',
    description: 'SendGrid API Key',
    regex: /SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}/g,
    severity: 'high',
    category: 'secret',
  },

  // Mailgun
  {
    id: 'mailgun-api-key',
    description: 'Mailgun API Key',
    regex: /key-[0-9a-zA-Z]{32}/g,
    severity: 'high',
    category: 'secret',
  },

  // JWT Tokens
  {
    id: 'jwt-token',
    description: 'JWT Token',
    regex: /eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g,
    severity: 'medium',
    category: 'secret',
  },

  // Database Connection Strings
  {
    id: 'postgres-connection',
    description: 'PostgreSQL Connection String',
    regex: /postgres(?:ql)?:\/\/[^\s'"]+:[^\s'"]+@[^\s'"]+/g,
    severity: 'critical',
    category: 'secret',
  },
  {
    id: 'mysql-connection',
    description: 'MySQL Connection String',
    regex: /mysql:\/\/[^\s'"]+:[^\s'"]+@[^\s'"]+/g,
    severity: 'critical',
    category: 'secret',
  },
  {
    id: 'mongodb-connection',
    description: 'MongoDB Connection String',
    regex: /mongodb(\+srv)?:\/\/[^\s'"]+:[^\s'"]+@[^\s'"]+/g,
    severity: 'critical',
    category: 'secret',
  },

  // NPM Tokens
  {
    id: 'npm-access-token',
    description: 'NPM Access Token',
    regex: /npm_[a-zA-Z0-9]{36}/g,
    severity: 'critical',
    category: 'secret',
  },

  // Docker
  {
    id: 'dockerhub-token',
    description: 'Docker Hub Token',
    regex: /dckr_pat_[a-zA-Z0-9_-]{36}/g,
    severity: 'high',
    category: 'secret',
  },

  // Generic Secrets
  {
    id: 'generic-secret',
    description: 'Generic Secret',
    regex: /(secret|password|passwd|pwd|token|auth)['":\s]*=?\s*['"][^\s'"]{8,}['"]/gi,
    keywords: ['secret', 'password', 'token'],
    severity: 'medium',
    category: 'secret',
  },

  // OAuth Client Secrets
  {
    id: 'oauth-client-secret',
    description: 'OAuth Client Secret',
    regex: /client[_-]?secret['":\s]*=?\s*['"][a-zA-Z0-9_-]{20,}['"]/gi,
    severity: 'high',
    category: 'secret',
  },

  // Heroku API Key
  {
    id: 'heroku-api-key',
    description: 'Heroku API Key',
    regex: /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g,
    keywords: ['heroku'],
    severity: 'high',
    category: 'secret',
  },

  // Shopify
  {
    id: 'shopify-token',
    description: 'Shopify Access Token',
    regex: /shpat_[a-fA-F0-9]{32}/g,
    severity: 'high',
    category: 'secret',
  },

  // PayPal
  {
    id: 'paypal-token',
    description: 'PayPal Token',
    regex: /access_token\$production\$[a-z0-9]{16}\$[a-f0-9]{32}/g,
    severity: 'critical',
    category: 'secret',
  },

  // Square
  {
    id: 'square-token',
    description: 'Square Access Token',
    regex: /sq0atp-[0-9A-Za-z\-_]{22}/g,
    severity: 'high',
    category: 'secret',
  },

  // Telegram Bot Token
  {
    id: 'telegram-bot-token',
    description: 'Telegram Bot Token',
    regex: /[0-9]+:AA[0-9A-Za-z_-]{33}/g,
    severity: 'medium',
    category: 'secret',
  },

  // Cloudinary
  {
    id: 'cloudinary-url',
    description: 'Cloudinary URL',
    regex: /cloudinary:\/\/[0-9]+:[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+/g,
    severity: 'high',
    category: 'secret',
  },

  // Firebase
  {
    id: 'firebase-url',
    description: 'Firebase Database URL',
    regex: /https:\/\/[a-z0-9-]+\.firebaseio\.com/g,
    severity: 'medium',
    category: 'secret',
  },
];

/**
 * Get all secret patterns
 */
export function getSecretPatterns(): SecretPattern[] {
  return SECRET_PATTERNS;
}

/**
 * Get patterns by severity
 */
export function getPatternsBySeverity(severity: string): SecretPattern[] {
  return SECRET_PATTERNS.filter((p) => p.severity === severity);
}
