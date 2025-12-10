import { describe, it, expect } from 'vitest';
import { calculateEntropy, hasHighEntropy, findHighEntropyStrings } from '../../src/scanner/entropy.js';

describe('Entropy Detection', () => {
  describe('calculateEntropy', () => {
    it('should calculate entropy for uniform string', () => {
      const entropy = calculateEntropy('aaaaaaaaaa');
      expect(entropy).toBeLessThan(1);
    });

    it('should calculate high entropy for random string', () => {
      const entropy = calculateEntropy('kJ8h3nP9xL2vQ4wR7tY6uI5oP1aS3d');
      expect(entropy).toBeGreaterThan(4.5);
    });

    it('should calculate medium entropy for mixed string', () => {
      const entropy = calculateEntropy('password123');
      expect(entropy).toBeGreaterThan(2);
      expect(entropy).toBeLessThan(4);
    });

    it('should return 0 for empty string', () => {
      const entropy = calculateEntropy('');
      expect(entropy).toBe(0);
    });

    it('should handle single character', () => {
      const entropy = calculateEntropy('a');
      expect(entropy).toBe(0);
    });
  });

  describe('hasHighEntropy', () => {
    it('should detect high entropy with default threshold', () => {
      const result = hasHighEntropy('kJ8h3nP9xL2vQ4wR7tY6uI5oP1aS3d');
      expect(result).toBe(true);
    });

    it('should reject low entropy with default threshold', () => {
      const result = hasHighEntropy('password');
      expect(result).toBe(false);
    });

    it('should respect custom threshold', () => {
      const result = hasHighEntropy('abc123', 2.0);
      expect(result).toBe(true);
    });

    it('should reject strings below minimum length', () => {
      const result = hasHighEntropy('a1b2c3d4e5', 20);
      expect(result).toBe(false);
    });
  });

  describe('findHighEntropyStrings', () => {
    it('should find high entropy strings in text', () => {
      const text = 'The secret is "kJ8h3nP9xL2vQ4wR7tY6uI5oP1aS3d" in the config';
      const results = findHighEntropyStrings(text, 20, 4.5);

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].value).toContain('kJ8h3nP9xL2vQ4wR7tY6uI5oP1aS3d');
      expect(results[0].entropy).toBeGreaterThan(4.5);
    });

    it('should not find entropy in normal text', () => {
      const text = 'This is just normal text with no secrets';
      const results = findHighEntropyStrings(text, 20, 4.5);

      expect(results.length).toBe(0);
    });

    it('should handle multiple high entropy strings', () => {
      const text = 'key1="kJ8h3nP9xL2vQ4wR7tY6uI5oP" key2="mN4bV9cX1zQ5wE8rT2yU6iO1pA"';
      const results = findHighEntropyStrings(text, 20, 4.5);

      expect(results.length).toBeGreaterThanOrEqual(2);
    });

    it('should respect minimum length parameter', () => {
      const text = 'Short a1b2c3 vs long kJ8h3nP9xL2vQ4wR7tY6uI5oP1aS3d';
      const results = findHighEntropyStrings(text, 30, 4.5);

      expect(results.every((r) => r.value.length >= 30)).toBe(true);
    });

    it('should return empty array for empty string', () => {
      const results = findHighEntropyStrings('', 20, 4.5);
      expect(results).toEqual([]);
    });
  });
});
