// Test fixture with various secrets for testing detection

// AWS Credentials
const awsAccessKey = 'AKIAIOSFODNN7EXAMPLE';
const awsSecretKey = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY';

// GitHub Token
const githubToken = 'ghp_1234567890abcdefghijklmnopqrstuv';

// Stripe API Key (fake for testing)
const stripeKey = 'sk_test_FAKE1234567890abcdefghijklmnop';

// Generic API Key
const apiKey = 'api_key=1234567890abcdefghijklmnop';

// Private SSH Key
const sshKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA0Z3VS5JJcds3xfn/ygWyF5SAh4aPZLMiqZsT4g71L3a6Lkm9
-----END RSA PRIVATE KEY-----`;

// Database Connection String
const dbUrl = 'postgresql://user:password123@localhost:5432/mydb';

// High entropy string (potential secret)
const suspiciousString = 'kJ8h3nP9xL2vQ4wR7tY6uI5oP1aS3dF9gH2jK4lM6nB8v';

export { awsAccessKey, githubToken, stripeKey, apiKey, sshKey, dbUrl };
