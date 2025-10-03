const OneIVMPerTransformationIdStrategy = require('../../../../src/util/ivmCache/strategies/isolate');

// Mock dependencies
jest.mock('../../../../src/logger', () => ({
  info: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

jest.mock('../../../../src/util/stats', () => ({
  timing: jest.fn(),
  increment: jest.fn(),
  gauge: jest.fn(),
  counter: jest.fn(),
  summary: jest.fn(),
}));

jest.mock('../../../../src/util/ivmCache/contextReset', () => ({
  createNewContext: jest.fn(),
}));

const { createNewContext } = require('../../../../src/util/ivmCache/contextReset');

describe('Isolate Cache Strategy', () => {
  let strategy;
  let mockIsolateData;

  beforeEach(() => {
    jest.clearAllMocks();
    
    strategy = new OneIVMPerTransformationIdStrategy({ maxSize: 3, ttlMs: 1000 });

    mockIsolateData = {
      isolate: {
        dispose: jest.fn().mockResolvedValue(undefined),
      },
      bootstrap: {
        release: jest.fn(),
      },
      customScriptModule: {
        release: jest.fn(),
      },
      context: {
        release: jest.fn(),
      },
      fnRef: {
        release: jest.fn(),
      },
      compiledModules: {
        lodash: { module: {} },
      },
      transformationId: 'test-transformation-123',
      workspaceId: 'test-workspace-456',
      fName: 'transformEvent',
    };
  });

  afterEach(() => {
    if (strategy) {
      strategy.clear();
    }
  });

  describe('constructor', () => {
    test('should initialize with correct name and options', () => {
      expect(strategy.name).toBe('isolate');
      expect(strategy.cache.maxSize).toBe(3);
      expect(strategy.cache.ttlMs).toBe(1000);
    });

    test('should use default options when none provided', () => {
      const defaultStrategy = new OneIVMPerTransformationIdStrategy();
      expect(defaultStrategy.name).toBe('isolate');
      expect(defaultStrategy.cache.maxSize).toBe(10); // default
    });
  });

  describe('set method', () => {
    test('should cache isolate data successfully', async () => {
      const cacheKey = 'test:key:123';

      await strategy.set(cacheKey, mockIsolateData);

      expect(strategy.cache.has(cacheKey)).toBe(true);
      const cached = strategy.cache.get(cacheKey);
      expect(cached).toMatchObject({
        isolate: mockIsolateData.isolate,
        bootstrap: mockIsolateData.bootstrap,
        customScriptModule: mockIsolateData.customScriptModule,
        transformationId: mockIsolateData.transformationId,
        workspaceId: mockIsolateData.workspaceId,
        fName: mockIsolateData.fName,
      });
      expect(cached.cachedAt).toBeGreaterThan(0);
      expect(typeof cached.destroy).toBe('function');
    });

    test('should handle caching errors gracefully', async () => {
      const invalidData = null;

      // When isolateData is null, the set method should handle it gracefully and not cache
      await expect(strategy.set('test:key', invalidData)).resolves.toBeUndefined();
      expect(strategy.cache.has('test:key')).toBe(false);
    });

    test('should create proper destroy function', async () => {
      const cacheKey = 'test:key:123';
      await strategy.set(cacheKey, mockIsolateData);

      const cached = strategy.cache.get(cacheKey);
      expect(typeof cached.destroy).toBe('function');

      // Test destroy function
      await cached.destroy();

      expect(mockIsolateData.fnRef.release).toHaveBeenCalled();
      expect(mockIsolateData.bootstrap.release).toHaveBeenCalled();
      expect(mockIsolateData.customScriptModule.release).toHaveBeenCalled();
      expect(mockIsolateData.isolate.dispose).toHaveBeenCalled();
    });

    test('should handle destroy errors gracefully', async () => {
      mockIsolateData.isolate.dispose.mockRejectedValue(new Error('Dispose failed'));

      const cacheKey = 'test:key:123';
      await strategy.set(cacheKey, mockIsolateData);

      const cached = strategy.cache.get(cacheKey);
      await expect(cached.destroy()).resolves.toBeUndefined();
    });
  });

  describe('get method', () => {
    test('should return null for non-existent keys', async () => {
      const result = await strategy.get('nonexistent:key');
      expect(result).toBeNull();
    });

    test('should return reset isolate for existing keys', async () => {
      const cacheKey = 'test:key:123';
      const credentials = { apiKey: 'test' };
      const cachedIsolateWithResetContext = { ...mockIsolateData, reset: true };

      createNewContext.mockResolvedValue(cachedIsolateWithResetContext);

      await strategy.set(cacheKey, mockIsolateData);
      
      // Mock the cache.get to return our mock data structure
      const mockCachedData = {
        isolate: mockIsolateData.isolate,
        transformationId: mockIsolateData.transformationId,
        workspaceId: mockIsolateData.workspaceId,
        bootstrap: mockIsolateData.bootstrap,
        customScriptModule: mockIsolateData.customScriptModule,
        compiledModules: mockIsolateData.compiledModules,
        fName: mockIsolateData.fName,
        cachedAt: Date.now(),
        destroy: jest.fn(),
      };
      jest.spyOn(strategy.cache, 'get').mockReturnValue(mockCachedData);
      
      const result = await strategy.get(cacheKey, credentials);

      expect(createNewContext).toHaveBeenCalledWith(
        mockCachedData,
        credentials
      );
      expect(result).toBe(cachedIsolateWithResetContext);
    });

    test('should handle reset context errors', async () => {
      const cacheKey = 'test:key:123';
      createNewContext.mockRejectedValue(new Error('Reset failed'));

      await strategy.set(cacheKey, mockIsolateData);
      const result = await strategy.get(cacheKey);

      expect(result).toBeNull();
      expect(strategy.cache.has(cacheKey)).toBe(false); // Should be removed due to error
    });

    test('should handle missing cached data gracefully', async () => {
      // Manually add corrupted data to cache
      strategy.cache.set('corrupted:key', null);

      const result = await strategy.get('corrupted:key');
      expect(result).toBeNull();
    });

    test('should track timing metrics', async () => {
      const stats = require('../../../../src/util/stats');
      const cacheKey = 'test:key:123';

      // Test cache miss
      await strategy.get(cacheKey);
      expect(stats.timing).toHaveBeenCalledWith(
        'ivm_cache_get_duration',
        expect.any(Date),
        { strategy: 'isolate', result: 'miss' }
      );

      // Test cache hit
      createNewContext.mockResolvedValue(mockIsolateData);
      await strategy.set(cacheKey, mockIsolateData);
      await strategy.get(cacheKey);

      expect(stats.timing).toHaveBeenCalledWith(
        'ivm_cache_get_duration',
        expect.any(Date),
        { strategy: 'isolate', result: 'hit' }
      );
    });
  });

  describe('delete method', () => {
    test('should delete cached isolate', async () => {
      const cacheKey = 'test:key:123';
      await strategy.set(cacheKey, mockIsolateData);

      expect(strategy.cache.has(cacheKey)).toBe(true);

      await strategy.delete(cacheKey);

      expect(strategy.cache.has(cacheKey)).toBe(false);
    });

    test('should call destroy method when deleting', async () => {
      const cacheKey = 'test:key:123';
      await strategy.set(cacheKey, mockIsolateData);

      await strategy.delete(cacheKey);

      expect(mockIsolateData.fnRef.release).toHaveBeenCalled();
      expect(mockIsolateData.isolate.dispose).toHaveBeenCalled();
    });

    test('should handle delete errors gracefully', async () => {
      mockIsolateData.isolate.dispose.mockRejectedValue(new Error('Dispose failed'));

      const cacheKey = 'test:key:123';
      await strategy.set(cacheKey, mockIsolateData);

      await expect(strategy.delete(cacheKey)).resolves.toBeUndefined();
    });

    test('should handle deleting non-existent keys', async () => {
      await expect(strategy.delete('nonexistent')).resolves.toBeUndefined();
    });
  });

  describe('clear method', () => {
    test('should clear all cached isolates', async () => {
      await strategy.set('key1', mockIsolateData);
      await strategy.set('key2', { ...mockIsolateData });
      await strategy.set('key3', { ...mockIsolateData });

      expect(strategy.cache.cache.size).toBe(3);

      await strategy.clear();

      expect(strategy.cache.cache.size).toBe(0);
    });

    test('should call destroy on all cached items', async () => {
      const mockData1 = { ...mockIsolateData };
      const mockData2 = { 
        ...mockIsolateData,
        fnRef: { release: jest.fn() },
        isolate: { dispose: jest.fn().mockResolvedValue(undefined) },
      };

      await strategy.set('key1', mockData1);
      await strategy.set('key2', mockData2);

      // Mock the cache to return items with destroy methods
      const destroyMock1 = jest.fn();
      const destroyMock2 = jest.fn();
      jest.spyOn(strategy.cache.cache, 'entries').mockReturnValue([
        ['key1', { destroy: destroyMock1 }],
        ['key2', { destroy: destroyMock2 }],
      ]);

      await strategy.clear();

      expect(destroyMock1).toHaveBeenCalled();
      expect(destroyMock2).toHaveBeenCalled();
    });

    test('should handle clear errors gracefully', async () => {
      mockIsolateData.isolate.dispose.mockRejectedValue(new Error('Dispose failed'));

      await strategy.set('key1', mockIsolateData);
      await expect(strategy.clear()).resolves.toBeUndefined();
    });
  });

  describe('getStats method', () => {
    test('should return stats with strategy name', () => {
      const stats = strategy.getStats();

      expect(stats).toMatchObject({
        strategy: 'isolate',
        hits: expect.any(Number),
        misses: expect.any(Number),
        hitRate: expect.any(Number),
        currentSize: expect.any(Number),
        maxSize: expect.any(Number),
      });
    });

    test('should reflect actual cache state', async () => {
      await strategy.set('key1', mockIsolateData);
      createNewContext.mockResolvedValue(mockIsolateData);

      // Generate some hits and misses
      await strategy.get('key1'); // hit
      await strategy.get('nonexistent'); // miss

      const stats = strategy.getStats();
      expect(stats.hits).toBeGreaterThan(0);
      expect(stats.misses).toBeGreaterThan(0);
      expect(stats.currentSize).toBe(1);
    });
  });

  describe('destroy method', () => {
    test('should destroy strategy and clean up resources', async () => {
      await strategy.set('key1', mockIsolateData);
      await strategy.set('key2', { ...mockIsolateData });

      await strategy.clear();

      expect(strategy.cache.cache.size).toBe(0);
    });
  });

  describe('LRU and TTL behavior', () => {
    test('should evict least recently used items', async () => {
      await strategy.set('key1', mockIsolateData);
      await strategy.set('key2', { ...mockIsolateData });
      await strategy.set('key3', { ...mockIsolateData });

      // Cache is now full, adding another should evict key1
      await strategy.set('key4', { ...mockIsolateData });

      expect(strategy.cache.has('key1')).toBe(false);
      expect(strategy.cache.has('key2')).toBe(true);
      expect(strategy.cache.has('key3')).toBe(true);
      expect(strategy.cache.has('key4')).toBe(true);
    });

    test('should call destroy on evicted items', async () => {
      const mockData1 = { ...mockIsolateData };
      await strategy.set('key1', mockData1);
      await strategy.set('key2', { ...mockIsolateData });
      await strategy.set('key3', { ...mockIsolateData });

      // This should evict key1
      await strategy.set('key4', { ...mockIsolateData });

      expect(mockData1.fnRef.release).toHaveBeenCalled();
      expect(mockData1.isolate.dispose).toHaveBeenCalled();
    });

    test('should expire items after TTL', (done) => {
      const shortTtlStrategy = new OneIVMPerTransformationIdStrategy({ maxSize: 5, ttlMs: 100 });

      shortTtlStrategy.set('key1', mockIsolateData).then(() => {
        expect(shortTtlStrategy.cache.has('key1')).toBe(true);

        setTimeout(() => {
          expect(shortTtlStrategy.cache.has('key1')).toBe(false);
          // With lru-cache library, TTL expiry is handled automatically
          // We verify the behavior through cache state rather than mock calls
          shortTtlStrategy.clear();
          done();
        }, 150);
      });
    });
  });

  describe('concurrent operations', () => {
    test('should handle concurrent get operations', async () => {
      const cacheKey = 'test:concurrent:get';
      createNewContext.mockResolvedValue(mockIsolateData);

      await strategy.set(cacheKey, mockIsolateData);

      const getPromises = Array.from({ length: 10 }, () =>
        strategy.get(cacheKey, {}, false)
      );

      const results = await Promise.all(getPromises);
      results.forEach((result) => {
        expect(result).toBeDefined();
      });

      expect(createNewContext).toHaveBeenCalledTimes(10);
    });

    test('should handle concurrent set operations', async () => {
      const setPromises = Array.from({ length: 5 }, (_, i) =>
        strategy.set(`key${i}`, { ...mockIsolateData, id: i })
      );

      await Promise.all(setPromises);

      // Only 3 should remain due to maxSize=3
      expect(strategy.cache.cache.size).toBe(3);
    });

    test('should handle mixed concurrent operations', async () => {
      createNewContext.mockResolvedValue(mockIsolateData);

      const operations = [
        strategy.set('key1', mockIsolateData),
        strategy.set('key2', mockIsolateData),
        strategy.get('key1'),
        strategy.delete('key2'),
        strategy.set('key3', mockIsolateData),
        strategy.get('key3'),
      ];

      await expect(Promise.all(operations)).resolves.toHaveLength(6);
    });
  });

  describe('error scenarios', () => {
    test('should handle createNewContext throwing errors', async () => {
      createNewContext.mockRejectedValue(new Error('Reset context failed'));

      const cacheKey = 'test:error:key';
      await strategy.set(cacheKey, mockIsolateData);

      const result = await strategy.get(cacheKey);
      expect(result).toBeNull();
      expect(strategy.cache.has(cacheKey)).toBe(false);
    });

    test('should handle isolate disposal errors during destroy', async () => {
      mockIsolateData.isolate.dispose.mockRejectedValue(new Error('Disposal error'));

      const cacheKey = 'test:error:disposal';
      await strategy.set(cacheKey, mockIsolateData);

      const cached = strategy.cache.get(cacheKey);
      await expect(cached.destroy()).resolves.toBeUndefined();
    });

    test('should handle reference release errors during destroy', async () => {
      mockIsolateData.fnRef.release.mockImplementation(() => {
        throw new Error('Release error');
      });

      const cacheKey = 'test:error:release';
      await strategy.set(cacheKey, mockIsolateData);

      const cached = strategy.cache.get(cacheKey);
      await expect(cached.destroy()).resolves.toBeUndefined();
    });
  });

  describe('memory and performance', () => {
    test('should not leak memory with frequent operations', async () => {
      createNewContext.mockResolvedValue(mockIsolateData);

      const initialMemory = process.memoryUsage().heapUsed;

      // Perform many operations
      for (let i = 0; i < 100; i++) {
        await strategy.set(`key${i}`, { ...mockIsolateData });
        if (i % 2 === 0) {
          await strategy.get(`key${Math.floor(i / 2)}`);
        }
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // Less than 50MB
    });

    test('should maintain consistent performance', async () => {
      createNewContext.mockResolvedValue(mockIsolateData);

      const timings = [];

      for (let i = 0; i < 10; i++) {
        const start = Date.now();
        await strategy.set(`key${i}`, mockIsolateData);
        await strategy.get(`key${i}`);
        const end = Date.now();
        timings.push(end - start);
      }

      // Performance should be consistent (no significant degradation)
      const avgTiming = timings.reduce((a, b) => a + b, 0) / timings.length;
      expect(avgTiming).toBeLessThan(100); // Should be fast with mocks
    });
  });
});
