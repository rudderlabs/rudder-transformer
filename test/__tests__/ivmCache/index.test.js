// Mock logger and stats
jest.mock('../../../src/logger', () => ({
  info: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

jest.mock('../../../src/util/stats', () => ({
  increment: jest.fn(),
  gauge: jest.fn(),
  timing: jest.fn(),
  counter: jest.fn(),
  summary: jest.fn(),
}));

// Mock lru-cache to test our wrapper behavior
jest.mock('lru-cache', () => ({
  LRUCache: jest.fn().mockImplementation((options) => {
    const map = new Map();
    const timers = new Map();
    
    const mockCache = {
      _options: options,
      _map: map,
      _timers: timers,
      set: jest.fn().mockImplementation((key, value) => {
        // Clear existing timer if key exists
        if (timers.has(key)) {
          clearTimeout(timers.get(key));
          timers.delete(key);
        }
        
        // Simulate LRU behavior - if at max capacity, evict oldest
        if (map.size >= options.max && !map.has(key)) {
          const firstKey = map.keys().next().value;
          if (firstKey !== undefined) {
            const firstValue = map.get(firstKey);
            map.delete(firstKey);
            if (timers.has(firstKey)) {
              clearTimeout(timers.get(firstKey));
              timers.delete(firstKey);
            }
            if (options.dispose) {
              options.dispose(firstValue, firstKey, 'evict');
            }
          }
        }
        
        // If updating existing key, dispose old value
        if (map.has(key) && options.dispose) {
          const oldValue = map.get(key);
          options.dispose(oldValue, key, 'set');
        }
        
        map.set(key, value);
        
        // Set TTL timer if specified
        if (options.ttl && options.ttl > 0) {
          const timer = setTimeout(() => {
            if (map.has(key)) {
              const expiredValue = map.get(key);
              map.delete(key);
              timers.delete(key);
              if (options.dispose) {
                options.dispose(expiredValue, key, 'delete');
              }
            }
          }, options.ttl);
          timers.set(key, timer);
        }
        
        return mockCache;
      }),
      get: jest.fn().mockImplementation((key) => {
        const value = map.get(key);
        if (value !== undefined) {
          // Simulate LRU - move to end
          map.delete(key);
          map.set(key, value);
        }
        return value;
      }),
      has: jest.fn().mockImplementation((key) => map.has(key)),
      delete: jest.fn().mockImplementation((key) => {
        const had = map.has(key);
        if (had) {
          const value = map.get(key);
          map.delete(key);
          
          if (timers.has(key)) {
            clearTimeout(timers.get(key));
            timers.delete(key);
          }
          
          if (options.dispose) {
            options.dispose(value, key, 'delete');
          }
        }
        return had;
      }),
      clear: jest.fn().mockImplementation(() => {
        // Clear all timers
        for (const timer of timers.values()) {
          clearTimeout(timer);
        }
        timers.clear();
        
        if (options.dispose) {
          for (const [key, value] of map.entries()) {
            options.dispose(value, key, 'delete');
          }
        }
        map.clear();
      }),
      keys: jest.fn().mockImplementation(() => map.keys()),
      values: jest.fn().mockImplementation(() => map.values()),
      entries: jest.fn().mockImplementation(() => map.entries()),
      get size() { return map.size; }
    };
    return mockCache;
  })
}));

const DisposableCache = require('../../../src/util/ivmCache/index');

describe('IVM LRU Cache with TTL', () => {
  let cache;

  beforeEach(() => {
    jest.clearAllMocks();
    cache = new DisposableCache({ maxSize: 3, ttlMs: 1000 });
  });

  afterEach(() => {
    if (cache) {
      cache.clear();
    }
  });

  describe('constructor', () => {
    test('should initialize with default values', () => {
      const defaultCache = new DisposableCache();
      expect(defaultCache.maxSize).toBe(10);
      expect(defaultCache.ttlMs).toBe(300000);
    });

    test('should use environment variables', () => {
      process.env.IVM_CACHE_MAX_SIZE = '100';
      process.env.IVM_CACHE_TTL_MS = '3600000';
      
      const envCache = new DisposableCache();
      expect(envCache.maxSize).toBe(100);
      expect(envCache.ttlMs).toBe(3600000);
      
      delete process.env.IVM_CACHE_MAX_SIZE;
      delete process.env.IVM_CACHE_TTL_MS;
    });

    test('should use provided options over defaults', () => {
      const customCache = new DisposableCache({ maxSize: 25, ttlMs: 5000 });
      expect(customCache.maxSize).toBe(25);
      expect(customCache.ttlMs).toBe(5000);
    });
  });

  describe('basic operations', () => {
    test('should set and get values', () => {
      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');
    });

    test('should return null for non-existent keys', () => {
      expect(cache.get('nonexistent')).toBeNull();
    });

    test('should check if key exists', () => {
      cache.set('key1', 'value1');
      expect(cache.has('key1')).toBe(true);
      expect(cache.has('nonexistent')).toBe(false);
    });

    test('should delete values', () => {
      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');
      
      cache.delete('key1');
      expect(cache.get('key1')).toBeNull();
      expect(cache.has('key1')).toBe(false);
    });

    test('should clear all values', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      expect(cache.cache.size).toBe(2);
      
      cache.clear();
      expect(cache.cache.size).toBe(0);
      expect(cache.get('key1')).toBeNull();
      expect(cache.get('key2')).toBeNull();
    });

    test('should get all keys', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      
      const keys = cache.keys();
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
      expect(keys).toHaveLength(2);
    });
  });

  describe('LRU behavior', () => {
    test('should evict least recently used when at capacity', () => {
      // Fill cache to capacity
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');
      expect(cache.cache.size).toBe(3);
      
      // Adding fourth item should evict first
      cache.set('key4', 'value4');
      expect(cache.cache.size).toBe(3);
      expect(cache.get('key1')).toBeNull(); // evicted
      expect(cache.get('key2')).toBe('value2');
      expect(cache.get('key3')).toBe('value3');
      expect(cache.get('key4')).toBe('value4');
    });

    test('should update LRU order on access', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');
      
      // Access key1 to make it most recently used
      cache.get('key1');
      
      // Add key4, should evict key2 (now least recently used)
      cache.set('key4', 'value4');
      expect(cache.get('key1')).toBe('value1'); // still there
      expect(cache.get('key2')).toBeNull(); // evicted
      expect(cache.get('key3')).toBe('value3');
      expect(cache.get('key4')).toBe('value4');
    });

    test('should handle overwriting existing keys', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      
      // Overwrite existing key
      cache.set('key1', 'newvalue1');
      expect(cache.cache.size).toBe(2);
      expect(cache.get('key1')).toBe('newvalue1');
    });

    test('should call destroy method on evicted items', () => {
      const mockDestroy = jest.fn();
      const itemWithDestroy = { data: 'test', destroy: mockDestroy };
      
      cache.set('key1', itemWithDestroy);
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');
      
      // Fill cache and trigger eviction
      cache.set('key4', 'value4');
      
      expect(mockDestroy).toHaveBeenCalled();
    });
  });

  describe('TTL behavior', () => {
    beforeAll(() => {
      jest.useFakeTimers();
    });
  
    // ✅ Restore real timers after this block is done
    afterAll(() => {
      jest.useRealTimers();
    });
  
    test('should expire items after TTL', () => {
      // Note: No more `done` callback
      cache = new DisposableCache({ maxSize: 5, ttlMs: 100 });
      
      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');
      
      jest.advanceTimersByTime(150);
      
      expect(cache.get('key1')).toBeNull();
      expect(cache.cache.size).toBe(0);
    });
  
    test('should call destroy method on TTL expired items', () => {
      cache = new DisposableCache({ maxSize: 5, ttlMs: 100 });
      const mockDestroy = jest.fn();
      const itemWithDestroy = { data: 'test', destroy: mockDestroy };
      
      cache.set('key1', itemWithDestroy);
      
      jest.advanceTimersByTime(150);
      
      expect(mockDestroy).toHaveBeenCalled();
    });
  
    test('should reset TTL when item is overwritten', () => {
      cache = new DisposableCache({ maxSize: 5, ttlMs: 200 });
      
      cache.set('key1', 'value1');
      
      jest.advanceTimersByTime(100);
      
      // Overwrite the key, which should reset the timer
      cache.set('key1', 'value2');
      
      jest.advanceTimersByTime(150);
  
      // Should still exist because the timer was reset
      expect(cache.get('key1')).toBe('value2');
      
      jest.advanceTimersByTime(100);
      
      expect(cache.get('key1')).toBeNull();
    });
  
    // This test doesn't need fake timers, but it's fine to leave it here
    test('should handle TTL configuration', () => {
      expect(cache.cache._options.ttl).toBe(1000);
      expect(cache.cache._options.max).toBe(3);
    });
  });

  describe('statistics', () => {
    test('should track hit and miss stats', () => {
      // Miss
      cache.get('nonexistent');
      expect(cache.stats.misses).toBe(1);
      expect(cache.stats.hits).toBe(0);
      
      // Hit
      cache.set('key1', 'value1');
      cache.get('key1');
      expect(cache.stats.hits).toBe(1);
      expect(cache.stats.misses).toBe(1);
    });

    test('should track evictions', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');
      cache.set('key4', 'value4'); // triggers eviction
      
      expect(cache.stats.evictions).toBe(1);
    });

    test('should track current size', () => {
      expect(cache.stats.currentSize).toBe(0);
      
      cache.set('key1', 'value1');
      expect(cache.stats.currentSize).toBe(1);
      
      cache.set('key2', 'value2');
      expect(cache.stats.currentSize).toBe(2);
      
      cache.delete('key1');
      expect(cache.stats.currentSize).toBe(1);
    });

    test('should calculate hit rate correctly', () => {
      let stats = cache.getStats();
      expect(stats.hitRate).toBe(0); // No requests yet
      
      cache.set('key1', 'value1');
      cache.get('key1'); // hit
      cache.get('nonexistent'); // miss
      
      stats = cache.getStats();
      expect(stats.hitRate).toBe(50); // 1 hit out of 2 requests
    });

    test('should include all stats in getStats', () => {
      cache.set('key1', 'value1');
      cache.get('key1');
      cache.get('nonexistent');
      
      const stats = cache.getStats();
      expect(stats).toEqual({
        hits: 1,
        misses: 1,
        sets: 1,
        evictions: 0,
        ttlExpiries: 0,
        currentSize: 1,
        hitRate: 50,
        maxSize: 3,
        ttlMs: 1000,
      });
    });
  });

  describe('error handling', () => {
    test('should handle destroy errors gracefully', () => {
      const mockDestroy = jest.fn().mockImplementation(() => {
        throw new Error('Destroy failed');
      });
      const itemWithBadDestroy = { data: 'test', destroy: mockDestroy };
      
      cache.set('key1', itemWithBadDestroy);
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');
      
      // Should not throw even if destroy fails
      expect(() => cache.set('key4', 'value4')).not.toThrow();
      expect(mockDestroy).toHaveBeenCalled();
    });

    test('should handle TTL destroy errors gracefully', (done) => {
      cache = new DisposableCache({ maxSize: 5, ttlMs: 100 });
      const mockDestroy = jest.fn().mockImplementation(() => {
        throw new Error('TTL Destroy failed');
      });
      const itemWithBadDestroy = { data: 'test', destroy: mockDestroy };
      
      cache.set('key1', itemWithBadDestroy);
      
      setTimeout(() => {
        expect(mockDestroy).toHaveBeenCalled();
        done();
      }, 150);
    });
  });

  describe('memory management', () => {
    test('should handle zero max size', () => {
      const zeroCache = new DisposableCache({ maxSize: 0, ttlMs: 1000 });
      zeroCache.set('key1', 'value1');
      // With maxSize 0, item gets added then immediately evicted
      expect(zeroCache.cache.size).toBe(0);
      expect(zeroCache.get('key1')).toBeNull();
      zeroCache.clear();
    });

    test('should handle max size of 1', () => {
      const singleCache = new DisposableCache({ maxSize: 1, ttlMs: 1000 });
      
      singleCache.set('key1', 'value1');
      expect(singleCache.get('key1')).toBe('value1');
      
      singleCache.set('key2', 'value2');
      expect(singleCache.get('key1')).toBeNull();
      expect(singleCache.get('key2')).toBe('value2');
      expect(singleCache.cache.size).toBe(1);
      singleCache.clear();
    });

    test('should maintain correct size after operations', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      expect(cache.cache.size).toBe(2);
      
      cache.delete('key1');
      expect(cache.cache.size).toBe(1);
      
      cache.set('key3', 'value3');
      cache.set('key4', 'value4');
      expect(cache.cache.size).toBe(3);
      
      cache.set('key5', 'value5'); // Should trigger eviction
      expect(cache.cache.size).toBe(3);
    });
  });

  describe('edge cases', () => {
    test('should handle null and undefined values', () => {
      cache.set('nullKey', null);
      cache.set('undefinedKey', undefined);
      
      expect(cache.get('nullKey')).toBeNull();
      expect(cache.get('undefinedKey')).toBeNull(); // Our cache returns null for non-existent
      expect(cache.has('nullKey')).toBe(true);
      expect(cache.has('undefinedKey')).toBe(true);
    });

    test('should handle complex object values', () => {
      const complexObject = {
        nested: { data: 'test' },
        array: [1, 2, 3],
        fn: () => 'test',
      };
      
      cache.set('complex', complexObject);
      const retrieved = cache.get('complex');
      
      expect(retrieved).toBe(complexObject);
      expect(retrieved.nested.data).toBe('test');
      expect(retrieved.fn()).toBe('test');
    });

    test('should handle rapid successive operations', () => {
      // Rapid set/get operations
      for (let i = 0; i < 100; i++) {
        cache.set(`key${i}`, `value${i}`);
        if (i < 3) { // Only first 3 should be retained due to maxSize=3
          expect(cache.get(`key${i}`)).toBe(`value${i}`);
        }
      }
      
      expect(cache.cache.size).toBe(3);
    });
  });
});
