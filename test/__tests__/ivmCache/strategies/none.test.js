const NoneStrategy = require('../../../../src/util/ivmCache/strategies/none');

// Mock logger
jest.mock('../../../../src/logger', () => ({
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

describe('None Cache Strategy', () => {
  let strategy;

  beforeEach(() => {
    jest.clearAllMocks();
    strategy = new NoneStrategy();
  });

  describe('constructor', () => {
    test('should initialize with correct name', () => {
      expect(strategy.name).toBe('none');
    });
  });

  describe('get method', () => {
    test('should always return null', async () => {
      const result = await strategy.get('any-key');
      expect(result).toBeNull();
    });

    test('should return null for any key variations', async () => {
      const keys = [
        'simple-key',
        'complex:key:with:colons',
        '',
        'very-long-key-with-many-characters-and-numbers-123456789',
        'key-with-special-chars-!@#$%',
      ];

      for (const key of keys) {
        const result = await strategy.get(key);
        expect(result).toBeNull();
      }
    });

    test('should handle credentials and testMode parameters', async () => {
      const credentials = { apiKey: 'secret' };
      const testMode = true;

      const result = await strategy.get('test-key', credentials, testMode);
      expect(result).toBeNull();
    });
  });

  describe('set method', () => {
    test('should be a no-op and not throw', async () => {
      const isolateData = {
        isolate: {},
        context: {},
        fnRef: {},
      };

      await expect(strategy.set('test-key', isolateData)).resolves.toBeUndefined();
    });

    test('should handle various isolate data structures', async () => {
      const testCases = [
        { simple: 'data' },
        null,
        undefined,
        { complex: { nested: { data: 'test' } } },
        { isolate: {}, context: {}, bootstrap: {}, customScriptModule: {} },
      ];

      for (const isolateData of testCases) {
        await expect(strategy.set('test-key', isolateData)).resolves.toBeUndefined();
      }
    });
  });

  describe('delete method', () => {
    test('should be a no-op and not throw', async () => {
      await expect(strategy.delete('test-key')).resolves.toBeUndefined();
    });

    test('should handle various key types', async () => {
      const keys = ['key1', '', 'very-long-key', null, undefined];

      for (const key of keys) {
        await expect(strategy.delete(key)).resolves.toBeUndefined();
      }
    });
  });

  describe('clear method', () => {
    test('should be a no-op and not throw', async () => {
      await expect(strategy.clear()).resolves.toBeUndefined();
    });
  });

  describe('getStats method', () => {
    test('should return empty stats', () => {
      const stats = strategy.getStats();

      expect(stats).toEqual({
        strategy: 'none',
        hits: 0,
        misses: 0,
        hitRate: 0,
        currentSize: 0,
        maxSize: 0,
      });
    });

    test('should always return same stats regardless of operations', async () => {
      // Perform various operations
      await strategy.get('key1');
      await strategy.set('key2', { data: 'test' });
      await strategy.delete('key3');
      await strategy.clear();

      const stats = strategy.getStats();
      expect(stats).toEqual({
        strategy: 'none',
        hits: 0,
        misses: 0,
        hitRate: 0,
        currentSize: 0,
        maxSize: 0,
      });
    });
  });

  describe('integration scenarios', () => {
    test('should handle typical cache workflow without errors', async () => {
      const cacheKey = 'test:transformation:abc123';
      const isolateData = {
        isolate: { mockIsolate: true },
        context: { mockContext: true },
        fnRef: { mockFnRef: true },
      };
      const credentials = { apiKey: 'test' };

      // Typical cache workflow
      let result = await strategy.get(cacheKey, credentials, false);
      expect(result).toBeNull();

      await strategy.set(cacheKey, isolateData);

      result = await strategy.get(cacheKey, credentials, false);
      expect(result).toBeNull(); // Still null because it's none strategy

      await strategy.delete(cacheKey);
      await strategy.clear();

      const stats = strategy.getStats();
      expect(stats.strategy).toBe('none');
    });

    test('should work with multiple concurrent operations', async () => {
      const operations = [];

      // Create multiple concurrent operations
      for (let i = 0; i < 10; i++) {
        operations.push(strategy.get(`key${i}`));
        operations.push(strategy.set(`key${i}`, { data: i }));
        operations.push(strategy.delete(`key${i}`));
      }

      // All should resolve without errors
      const results = await Promise.all(operations);

      // Get operations should return null
      const getResults = results.filter((_, index) => index % 3 === 0);
      getResults.forEach((result) => {
        expect(result).toBeNull();
      });

      // Set and delete operations should return undefined
      const setDeleteResults = results.filter((_, index) => index % 3 !== 0);
      setDeleteResults.forEach((result) => {
        expect(result).toBeUndefined();
      });
    });

    test('should maintain consistent behavior under stress', async () => {
      const iterations = 1000;
      const promises = [];

      for (let i = 0; i < iterations; i++) {
        promises.push(strategy.get(`stress-key-${i}`));
      }

      const results = await Promise.all(promises);
      results.forEach((result) => {
        expect(result).toBeNull();
      });

      const finalStats = strategy.getStats();
      expect(finalStats.strategy).toBe('none');
      expect(finalStats.currentSize).toBe(0);
    });
  });

  describe('error handling', () => {
    test('should not throw for malformed inputs', async () => {
      // These should not throw errors
      await expect(strategy.get()).resolves.toBeNull();
      await expect(strategy.set()).resolves.toBeUndefined();
      await expect(strategy.delete()).resolves.toBeUndefined();
    });

    test('should handle object with circular references', async () => {
      const circularObj = { name: 'test' };
      circularObj.self = circularObj;

      await expect(strategy.set('circular', circularObj)).resolves.toBeUndefined();
    });

    test('should handle very large data structures', async () => {
      const largeData = {
        bigArray: new Array(10000).fill('test'),
        bigString: 'x'.repeat(100000),
        deepNesting: {},
      };

      // Create deep nesting
      let current = largeData.deepNesting;
      for (let i = 0; i < 100; i++) {
        current.next = {};
        current = current.next;
      }

      await expect(strategy.set('large', largeData)).resolves.toBeUndefined();
    });
  });

  describe('memory usage', () => {
    test('should not retain any data', async () => {
      // Since none strategy doesn't cache anything, memory should not increase significantly
      // This is more of a conceptual test - the strategy never stores the data
      
      // Perform many operations
      for (let i = 0; i < 100; i++) {
        await strategy.set(`key${i}`, { data: `value${i}` });
        const result = await strategy.get(`key${i}`);
        expect(result).toBeNull(); // Always null for none strategy
      }
      
      // The important thing is that get always returns null, proving no retention
      expect(await strategy.get('any-key')).toBeNull();
    });
  });
});
