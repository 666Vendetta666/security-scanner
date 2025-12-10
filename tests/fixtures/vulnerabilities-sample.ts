// Test fixture with various SAST vulnerabilities for testing detection

// SQL Injection
function getUserData(userId: string) {
  const query = `SELECT * FROM users WHERE id = ${userId}`;
  return db.execute(query);
}

// XSS Vulnerability
function renderUserContent(userInput: string) {
  document.innerHTML = userInput;
}

// Command Injection
function runCommand(filename: string) {
  const { exec } = require('child_process');
  exec(`cat ${filename}`, (error, stdout) => {
    console.log(stdout);
  });
}

// Hardcoded Password
const password = 'admin123';
const credentials = { user: 'admin', pass: 'P@ssw0rd123' };

// Weak Cryptography
import crypto from 'crypto';
const hash = crypto.createHash('md5').update('password').digest('hex');

// Path Traversal
import path from 'path';
function readFile(userPath: string) {
  const filePath = path.join('/var/data', userPath);
  return fs.readFileSync(filePath);
}

export { getUserData, renderUserContent, runCommand };
