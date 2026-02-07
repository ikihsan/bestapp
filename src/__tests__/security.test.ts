import { checkRateLimit, hashIp, sanitizeInput } from '@/lib/security';

describe('security utilities', () => {
  describe('checkRateLimit', () => {
    it('allows requests within limit', () => {
      const key = 'test-' + Date.now();
      const result = checkRateLimit(key, 5, 60000);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4);
    });

    it('blocks requests over limit', () => {
      const key = 'flood-' + Date.now();
      for (let i = 0; i < 5; i++) {
        checkRateLimit(key, 5, 60000);
      }
      const result = checkRateLimit(key, 5, 60000);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });
  });

  describe('hashIp', () => {
    it('returns consistent hash', () => {
      const hash1 = hashIp('192.168.1.1');
      const hash2 = hashIp('192.168.1.1');
      expect(hash1).toBe(hash2);
    });

    it('returns different hash for different IPs', () => {
      const hash1 = hashIp('192.168.1.1');
      const hash2 = hashIp('10.0.0.1');
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('sanitizeInput', () => {
    it('strips HTML tags', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert(xss)/script');
    });

    it('trims whitespace', () => {
      expect(sanitizeInput('  hello  ')).toBe('hello');
    });

    it('limits length to 5000 chars', () => {
      const long = 'a'.repeat(10000);
      expect(sanitizeInput(long).length).toBe(5000);
    });
  });
});
