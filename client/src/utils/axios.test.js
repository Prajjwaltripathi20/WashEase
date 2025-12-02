import { describe, it, expect } from 'vitest';

/**
 * Unit tests for axios URL normalization logic
 * Prevents regression of duplicate /api paths
 */

// Extracted from axios.js for testing
const normalizeBase = (base) => {
  if (!base) {
    return '/api';
  }
  const trimmed = base.replace(/\/+$/g, '');
  if (trimmed.endsWith('/api')) {
    return trimmed;
  }
  return `${trimmed}/api`;
};

const normalizeRequestUrl = (url, base) => {
  if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
    return url;
  }
  if (base.endsWith('/api')) {
    if (url && url.startsWith('/api/')) {
      return url.substring(4);
    }
    if (url === '/api') {
      return '';
    }
  }
  if (url && !url.startsWith('/')) {
    return `/${url}`;
  }
  return url;
};

describe('API URL Normalization', () => {
  describe('normalizeBase', () => {
    it('should default to /api when base is empty', () => {
      expect(normalizeBase('')).toBe('/api');
      expect(normalizeBase(null)).toBe('/api');
      expect(normalizeBase(undefined)).toBe('/api');
    });

    it('should add /api suffix to full URLs without it', () => {
      expect(normalizeBase('https://wash-ease-backend.vercel.app')).toBe(
        'https://wash-ease-backend.vercel.app/api'
      );
      expect(normalizeBase('http://localhost:5001')).toBe('http://localhost:5001/api');
    });

    it('should not duplicate /api suffix', () => {
      expect(normalizeBase('https://wash-ease-backend.vercel.app/api')).toBe(
        'https://wash-ease-backend.vercel.app/api'
      );
      expect(normalizeBase('http://localhost:5001/api/')).toBe('http://localhost:5001/api');
    });

    it('should remove trailing slashes', () => {
      expect(normalizeBase('http://localhost:5001/')).toBe('http://localhost:5001/api');
      expect(normalizeBase('http://localhost:5001///')).toBe('http://localhost:5001/api');
    });
  });

  describe('normalizeRequestUrl', () => {
    const base = 'https://wash-ease-backend.vercel.app/api';

    it('should strip leading /api from request URL when base ends with /api', () => {
      expect(normalizeRequestUrl('/api/laundry', base)).toBe('/laundry');
      expect(normalizeRequestUrl('/api/auth/signup', base)).toBe('/auth/signup');
      expect(normalizeRequestUrl('/api/employee/orders', base)).toBe('/employee/orders');
    });

    it('should leave URLs without /api prefix unchanged', () => {
      expect(normalizeRequestUrl('/laundry', base)).toBe('/laundry');
      expect(normalizeRequestUrl('/auth/login', base)).toBe('/auth/login');
    });

    it('should not modify absolute external URLs', () => {
      expect(normalizeRequestUrl('https://other-service.com/data', base)).toBe(
        'https://other-service.com/data'
      );
      expect(normalizeRequestUrl('http://example.com/api', base)).toBe(
        'http://example.com/api'
      );
    });

    it('should ensure relative URLs start with /', () => {
      expect(normalizeRequestUrl('laundry', base)).toBe('/laundry');
      expect(normalizeRequestUrl('auth/login', base)).toBe('/auth/login');
    });

    it('should handle edge case of plain /api', () => {
      expect(normalizeRequestUrl('/api', base)).toBe('');
    });
  });

  describe('Final URL Resolution (Integration)', () => {
    it('should produce https://wash-ease-backend.vercel.app/api/laundry for production', () => {
      const base = normalizeBase('https://wash-ease-backend.vercel.app/api');
      const url = normalizeRequestUrl('/api/laundry', base);
      const final = `${base}${url}`;
      expect(final).toBe('https://wash-ease-backend.vercel.app/api/laundry');
    });

    it('should produce http://localhost:5001/api/auth/signup for dev', () => {
      const base = normalizeBase('http://localhost:5001');
      const url = normalizeRequestUrl('/auth/signup', base);
      const final = `${base}${url}`;
      expect(final).toBe('http://localhost:5001/api/auth/signup');
    });

    it('should not produce duplicate /api under any env combo', () => {
      const testCases = [
        ['https://wash-ease-backend.vercel.app/api', '/api/laundry'],
        ['https://wash-ease-backend.vercel.app/api', '/laundry'],
        ['https://wash-ease-backend.vercel.app', '/api/laundry'],
        ['http://localhost:5001/api', '/api/auth/signup'],
        ['http://localhost:5001', '/api/auth/signup'],
        ['/api', '/laundry'],
        ['', '/laundry'],
      ];

      testCases.forEach(([baseInput, urlInput]) => {
        const base = normalizeBase(baseInput);
        const url = normalizeRequestUrl(urlInput, base);
        const final = `${base}${url}`;
        expect(final).not.toMatch(/\/api\/api/, `Failed for base="${baseInput}", url="${urlInput}"`);
      });
    });
  });

  describe('Regression: Real-world scenarios', () => {
    it('Production: Vercel backend with /api/api calls should work', () => {
      // User code accidentally calls with /api/laundry when base already has /api
      const base = normalizeBase('https://wash-ease-backend.vercel.app/api');
      const url = normalizeRequestUrl('/api/laundry/692e0a1e9833b90b6d2dac9c', base);
      const final = `${base}${url}`;
      expect(final).toBe('https://wash-ease-backend.vercel.app/api/laundry/692e0a1e9833b90b6d2dac9c');
    });

    it('Local: localhost dev with proper paths', () => {
      const base = normalizeBase('http://localhost:5001');
      const url = normalizeRequestUrl('/auth/signup', base);
      const final = `${base}${url}`;
      expect(final).toBe('http://localhost:5001/api/auth/signup');
    });

    it('Proxy: /api relative path for Vite proxy', () => {
      const base = normalizeBase('/api');
      const url = normalizeRequestUrl('/laundry', base);
      const final = `${base}${url}`;
      expect(final).toBe('/api/laundry');
    });
  });
});
