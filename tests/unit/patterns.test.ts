import { describe, it, expect } from 'vitest';
import { getSecretPatterns, getPatternsBySeverity } from '../../src/patterns/secrets.js';
import {
  getVulnerabilityPatterns,
  getVulnerabilityPatternsBySeverity,
} from '../../src/patterns/vulnerabilities.js';
import {
  loadAllPatterns,
  loadPatternsByCategory,
  loadPatternsWithCustom,
  getPatternById,
} from '../../src/patterns/loader.js';
import { SecretPattern } from '../../src/types/index.js';

describe('Pattern Loading', () => {
  describe('Secret Patterns', () => {
    it('should load all secret patterns', () => {
      const patterns = getSecretPatterns();
      expect(patterns.length).toBeGreaterThan(30);
      expect(patterns.every((p) => p.category === 'secret')).toBe(true);
    });

    it('should filter by severity', () => {
      const criticalPatterns = getPatternsBySeverity('critical');
      expect(criticalPatterns.length).toBeGreaterThan(0);
      expect(criticalPatterns.every((p) => p.severity === 'critical')).toBe(true);
    });

    it('should have valid regex patterns', () => {
      const patterns = getSecretPatterns();
      patterns.forEach((pattern) => {
        expect(pattern.regex).toBeInstanceOf(RegExp);
      });
    });

    it('should include AWS patterns', () => {
      const patterns = getSecretPatterns();
      const awsPatterns = patterns.filter((p) => p.id.startsWith('aws-'));
      expect(awsPatterns.length).toBeGreaterThan(0);
    });

    it('should include GitHub patterns', () => {
      const patterns = getSecretPatterns();
      const ghPatterns = patterns.filter((p) => p.id.startsWith('github-'));
      expect(ghPatterns.length).toBeGreaterThan(0);
    });
  });

  describe('Vulnerability Patterns', () => {
    it('should load all vulnerability patterns', () => {
      const patterns = getVulnerabilityPatterns();
      expect(patterns.length).toBeGreaterThan(25);
      expect(patterns.every((p) => p.category === 'sast')).toBe(true);
    });

    it('should filter by severity', () => {
      const highPatterns = getVulnerabilityPatternsBySeverity('high');
      expect(highPatterns.length).toBeGreaterThan(0);
      expect(highPatterns.every((p) => p.severity === 'high')).toBe(true);
    });

    it('should include SQL injection patterns', () => {
      const patterns = getVulnerabilityPatterns();
      const sqlPatterns = patterns.filter((p) => p.id.includes('sql'));
      expect(sqlPatterns.length).toBeGreaterThan(0);
    });

    it('should include XSS patterns', () => {
      const patterns = getVulnerabilityPatterns();
      const xssPatterns = patterns.filter((p) => p.id.includes('xss'));
      expect(xssPatterns.length).toBeGreaterThan(0);
    });
  });

  describe('Pattern Loader', () => {
    it('should load all patterns (secrets + vulnerabilities)', () => {
      const all = loadAllPatterns();
      const secrets = getSecretPatterns();
      const vulns = getVulnerabilityPatterns();

      expect(all.length).toBe(secrets.length + vulns.length);
    });

    it('should load patterns by category - secret', () => {
      const patterns = loadPatternsByCategory('secret');
      expect(patterns.every((p) => p.category === 'secret')).toBe(true);
    });

    it('should load patterns by category - sast', () => {
      const patterns = loadPatternsByCategory('sast');
      expect(patterns.every((p) => p.category === 'sast')).toBe(true);
    });

    it('should load patterns by category - all', () => {
      const patterns = loadPatternsByCategory('all');
      const all = loadAllPatterns();
      expect(patterns.length).toBe(all.length);
    });

    it('should merge custom patterns', () => {
      const customPattern: SecretPattern = {
        id: 'custom-test',
        description: 'Custom Test Pattern',
        regex: /CUSTOM_[A-Z0-9]{10}/g,
        severity: 'high',
        category: 'secret',
      };

      const patterns = loadPatternsWithCustom([customPattern]);
      const custom = patterns.find((p) => p.id === 'custom-test');

      expect(custom).toBeDefined();
      expect(custom?.description).toBe('Custom Test Pattern');
    });

    it('should get pattern by ID', () => {
      const pattern = getPatternById('aws-access-key-id');
      expect(pattern).toBeDefined();
      expect(pattern?.id).toBe('aws-access-key-id');
    });

    it('should return undefined for non-existent pattern', () => {
      const pattern = getPatternById('non-existent-pattern');
      expect(pattern).toBeUndefined();
    });
  });

  describe('Pattern Structure Validation', () => {
    it('should have required fields for all patterns', () => {
      const all = loadAllPatterns();

      all.forEach((pattern) => {
        expect(pattern.id).toBeDefined();
        expect(pattern.description).toBeDefined();
        expect(pattern.regex).toBeDefined();
        expect(pattern.severity).toBeDefined();
        expect(pattern.category).toBeDefined();
      });
    });

    it('should have valid severity values', () => {
      const all = loadAllPatterns();
      const validSeverities = ['low', 'medium', 'high', 'critical'];

      all.forEach((pattern) => {
        expect(validSeverities).toContain(pattern.severity);
      });
    });

    it('should have valid category values', () => {
      const all = loadAllPatterns();
      const validCategories = ['secret', 'sast'];

      all.forEach((pattern) => {
        expect(validCategories).toContain(pattern.category);
      });
    });

    it('should have unique pattern IDs', () => {
      const all = loadAllPatterns();
      const ids = all.map((p) => p.id);
      const uniqueIds = new Set(ids);

      expect(ids.length).toBe(uniqueIds.size);
    });
  });
});
