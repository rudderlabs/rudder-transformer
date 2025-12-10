const Cache = require('../../src/v0/util/cache');
const stats = require('../../src/util/stats');

jest.mock('../../src/util/stats', () => {
  const statsMap = new Map();
  const getStatsKey = (name, tags) => {
    const tagStr = Object.entries(tags).map(([k, v]) => `${k}="${v}"`).join(',');
    return tagStr ? `${name}_{${tagStr}}` : name;
  };
  return {
    gauge: jest.fn().mockImplementation((name, value, tags) => {
      statsMap.set(getStatsKey(name, tags), value);
    }),
    counter: jest.fn().mockImplementation((name, value, tags) => {
      statsMap.set(getStatsKey(name, tags), value);
    }),
    getStats: (name, tags) => statsMap.get(getStatsKey(name, tags)),
  };
});

describe('Cache class', () => {
  let cache;
  const DEFAULT_TTL = 5; // 5 seconds

  beforeEach(() => {
    cache = new Cache("TEST", DEFAULT_TTL);
    jest.clearAllMocks();
  });

  describe('set method', () => {
    it('should set a value in cache with default TTL', () => {
      const key = 'testKey';
      const value = { data: 'test value' };

      const result = cache.set(key, value);

      expect(result).toBe(true);
    });

    it('should set a value in cache with custom TTL', () => {
      const key = 'testKey';
      const value = { data: 'test value' };
      const customTTL = 10;

      const result = cache.set(key, value, customTTL);

      expect(result).toBe(true);
    });

    it('should set primitive values in cache', () => {
      expect(cache.set('string', 'test')).toBe(true);
      expect(cache.set('number', 42)).toBe(true);
      expect(cache.set('boolean', true)).toBe(true);
      expect(cache.set('null', null)).toBe(true);
    });

    it('should set complex objects in cache', () => {
      const complexObject = {
        id: 1,
        nested: {
          array: [1, 2, 3],
          object: { key: 'value' },
        },
      };

      const result = cache.set('complex', complexObject);

      expect(result).toBe(true);
    });

    it('should overwrite existing cached values', () => {
      const key = 'overwriteKey';

      cache.set(key, 'original');
      cache.set(key, 'updated');

      // We'll verify this in the get tests
      expect(cache.set(key, 'updated')).toBe(true);
    });

    it('should emit stats when a value is set', async () => {
      const cache = new Cache("TEST", DEFAULT_TTL);
      const times = 10;
      for (let i = 0; i < times; i++) {
        cache.set(`testKey${i}`, `test value ${i}` );
      }
      expect(stats.getStats('node_cache_keys', {name: 'TEST'})).toBe(times);
      expect(stats.getStats('node_cache_ksize', {name: 'TEST'})).toBe(times * 8);
      expect(stats.getStats('node_cache_vsize', {name: 'TEST'})).toBe(times * 12);
    });
  });

  describe('get method without store function', () => {
    it('should return cached value when key exists', async () => {
      const key = 'existingKey';
      const value = { data: 'cached value' };

      cache.set(key, value);
      const result = await cache.get(key);

      expect(result).toEqual(value);
    });

    it('should return undefined when key does not exist and no store function provided', async () => {
      const result = await cache.get('nonExistentKey');

      expect(result).toBeUndefined();
    });

    it('should return undefined for expired keys when no store function provided', async () => {
      const shortTTLCache = new Cache("TEST", 0.1); // 100ms TTL
      const key = 'expiredKey';

      shortTTLCache.set(key, 'value');

      // Wait for expiration
      await new Promise((resolve) => {
        setTimeout(resolve, 150);
      });

      const result = await shortTTLCache.get(key);

      expect(result).toBeUndefined();
    });

    it('should return different values for different keys', async () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');

      const result1 = await cache.get('key1');
      const result2 = await cache.get('key2');

      expect(result1).toBe('value1');
      expect(result2).toBe('value2');
    });
  });

  describe('get method with store function (backward compatibility)', () => {
    it('should return cached value without calling store function when key exists', async () => {
      const key = 'cachedKey';
      const cachedValue = 'cached';
      const storeFunctionMock = jest.fn(async () => 'fetched');

      cache.set(key, cachedValue);
      const result = await cache.get(key, storeFunctionMock);

      expect(result).toBe(cachedValue);
      expect(storeFunctionMock).not.toHaveBeenCalled();
    });

    it('should call store function and cache result when key does not exist', async () => {
      const key = 'newKey';
      const fetchedValue = 'fetched value';
      const storeFunction = jest.fn(async () => fetchedValue);

      const result = await cache.get(key, storeFunction);

      expect(result).toBe(fetchedValue);
      expect(storeFunction).toHaveBeenCalledTimes(1);

      // Verify it was cached
      const cachedResult = await cache.get(key);
      expect(cachedResult).toBe(fetchedValue);
    });

    it('should handle store function returning object with value and age properties', async () => {
      const key = 'customTTLKey';
      const value = 'custom ttl value';
      const customAge = 3;
      const storeFunction = async () => ({ value, age: customAge });

      const result = await cache.get(key, storeFunction);

      expect(result).toBe(value);

      // Verify it was cached with the value (not the object)
      const cachedResult = await cache.get(key);
      expect(cachedResult).toBe(value);
    });

    it('should not cache null or undefined values from store function', async () => {
      const key1 = 'nullKey';
      const key2 = 'undefinedKey';

      const nullStoreFunction = async () => null;
      const undefinedStoreFunction = async () => undefined;

      const result1 = await cache.get(key1, nullStoreFunction);
      const result2 = await cache.get(key2, undefinedStoreFunction);

      expect(result1).toBeNull();
      expect(result2).toBeUndefined();

      // Verify they were not cached
      const cachedResult1 = await cache.get(key1);
      const cachedResult2 = await cache.get(key2);

      expect(cachedResult1).toBeUndefined();
      expect(cachedResult2).toBeUndefined();
    });

    it('should cache falsy values except null and undefined', async () => {
      const zeroKey = 'zero';
      const falseKey = 'false';
      const emptyStringKey = 'emptyString';

      await cache.get(zeroKey, async () => 0);
      await cache.get(falseKey, async () => false);
      await cache.get(emptyStringKey, async () => '');

      expect(await cache.get(zeroKey)).toBe(0);
      expect(await cache.get(falseKey)).toBe(false);
      expect(await cache.get(emptyStringKey)).toBe('');
    });

    it('should handle async store function errors', async () => {
      const key = 'errorKey';
      const error = new Error('Fetch failed');
      const storeFunction = async () => {
        throw error;
      };

      await expect(cache.get(key, storeFunction)).rejects.toThrow('Fetch failed');

      // Verify nothing was cached
      const cachedResult = await cache.get(key);
      expect(cachedResult).toBeUndefined();
    });

    it('should handle store function returning promise', async () => {
      const key = 'promiseKey';
      const value = { async: 'data' };
      const storeFunction = () => Promise.resolve(value);

      const result = await cache.get(key, storeFunction);

      expect(result).toEqual(value);
      expect(await cache.get(key)).toEqual(value);
    });

    it('should emit stats when a value is fetched', async () => {
      const cache = new Cache("TEST", DEFAULT_TTL);
      const times = 2;
      for (let i = 0; i < times; i+=2) {
        cache.set(`testKey${i}`, `test value ${i}`, DEFAULT_TTL);
      }
      for (let i = 0; i < times; i++) {
        const result = await cache.get(`testKey${i}`, async () => `test value ${i}`);
        expect(result).toEqual(`test value ${i}`);
      }
      expect(stats.getStats('node_cache_hits', {name: 'TEST'})).toBe(times / 2);
      expect(stats.getStats('node_cache_misses', {name: 'TEST'})).toBe(1);
      expect(stats.getStats('node_cache_keys', {name: 'TEST'})).toBe(times);
      expect(stats.getStats('node_cache_ksize', {name: 'TEST'})).toBe(times * 8);
      expect(stats.getStats('node_cache_vsize', {name: 'TEST'})).toBe(times * 12);
    });

    it('should correctly handle falsy values using get() instead of has()', async () => {
      // This test verifies that using get() instead of has() correctly handles
      // falsy values that would be problematic with has() check
      const testCases = [
        { key: 'zero', value: 0 },
        { key: 'false', value: false },
        { key: 'emptyString', value: '' },
        { key: 'null', value: null },
        { key: 'undefined', value: null },
      ];

      for (const { key, value } of testCases) {
        // Get should return the falsy value (not undefined)
        const result = await cache.get(key);
        expect(result).toBeUndefined();

        // Set falsy value directly
        cache.set(key, value);

        // Verify it's actually cached by getting again
        const result2 = await cache.get(key);
        expect(result2).toBe(value);
      }
    });
  });

  describe('del method', () => {
    it('should delete a key from cache', () => {
      const key = 'deleteKey';
      cache.set(key, 'value');

      const deleteCount = cache.del(key);

      expect(deleteCount).toBe(1);
    });

    it('should return 0 when deleting non-existent key', () => {
      const deleteCount = cache.del('nonExistentKey');

      expect(deleteCount).toBe(0);
    });

    it('should make get return undefined after deletion', async () => {
      const key = 'deletedKey';
      cache.set(key, 'value');

      cache.del(key);
      const result = await cache.get(key);

      expect(result).toBeUndefined();
    });

    it('should emit stats when a value is deleted', async () => {
      const cache = new Cache("TEST", DEFAULT_TTL);
      const times = 10;
      for (let i = 0; i < times; i++) {
        cache.set(`testKey${i}`, `test value ${i}`);
      }
      for (let i = 0; i < times; i+=2) {
        cache.del(`testKey${i}`);
      }
      expect(stats.getStats('node_cache_keys', {name: 'TEST'})).toBe(times / 2);
      expect(stats.getStats('node_cache_ksize', {name: 'TEST'})).toBe((times / 2) * 8);
      expect(stats.getStats('node_cache_vsize', {name: 'TEST'})).toBe((times / 2) * 12);
    });
  });

  describe('stats emission', () => {
    it('with custom tags', async () => {
      const tags = { module: 'test', feature: 'test' };
      const cache = new Cache("TEST", DEFAULT_TTL, tags);
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      const result = await cache.get('key1');
      expect(result).toBe('value1');
      cache.del('key1');
      expect(stats.getStats('node_cache_hits', {name: 'TEST', ...tags})).toBe(1);
      expect(stats.getStats('node_cache_misses', {name: 'TEST', ...tags})).toBe(0);
      expect(stats.getStats('node_cache_keys', {name: 'TEST', ...tags})).toBe(1);
      expect(stats.getStats('node_cache_ksize', {name: 'TEST', ...tags})).toBe(4);
      expect(stats.getStats('node_cache_vsize', {name: 'TEST', ...tags})).toBe(6);
    });
    it('without custom tags', async () => {
      const cache = new Cache("TEST", DEFAULT_TTL);
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      const result = await cache.get('key1');
      expect(result).toBe('value1');
      cache.del('key1');
      expect(stats.getStats('node_cache_hits', {name: 'TEST'})).toBe(1);
      expect(stats.getStats('node_cache_misses', {name: 'TEST'})).toBe(0);
      expect(stats.getStats('node_cache_keys', {name: 'TEST'})).toBe(1);
      expect(stats.getStats('node_cache_ksize', {name: 'TEST'})).toBe(4);
      expect(stats.getStats('node_cache_vsize', {name: 'TEST'})).toBe(6);
    });
  });
});
