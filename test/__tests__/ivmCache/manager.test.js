const IvmCacheManager = require('../../../src/util/ivmCache/manager');

// Mock strategies
jest.mock('../../../src/util/ivmCache/strategies/none', () => {
  return jest.fn().mockImplementation(() => ({
    name: 'none',
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
    clear: jest.fn().mockResolvedValue(undefined),
    getStats: jest.fn().mockReturnValue({
      strategy: 'none',
      hits: 0,
      misses: 0,
      hitRate: 0,
      currentSize: 0,
      maxSize: 0,
    }),
    destroy: jest.fn().mockResolvedValue(undefined),
  }));
});

jest.mock('../../../src/util/ivmCache/strategies/isolate', () => {
  return jest.fn().mockImplementation(() => ({
    name: 'isolate',
    get: jest.fn().mockResolvedValue({ reset: true }),
    set: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
    clear: jest.fn().mockResolvedValue(undefined),
    getStats: jest.fn().mockReturnValue({
      strategy: 'isolate',
      hits: 5,
      misses: 2,
      hitRate: 71.43,
      currentSize: 3,
      maxSize: 50,
    }),
    getHealthInfo: jest.fn().mockReturnValue({
      strategy: 'isolate',
      healthy: true,
      memoryPressure: 6,
      cacheSize: 3,
      maxSize: 50,
      hitRate: 71.43,
    }),
    destroy: jest.fn().mockResolvedValue(undefined),
  }));
});

jest.mock('../../../src/util/ivmCache/cacheKey', () => ({
  generateCacheKey: jest.fn().mockReturnValue('mocked:cache:key'),
  validateCacheKeyInputs: jest.fn().mockReturnValue(true),
}));

// Mock logger
jest.mock('../../../src/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

const logger = require('../../../src/logger');
const { generateCacheKey, validateCacheKeyInputs } = require('../../../src/util/ivmCache/cacheKey');

describe('IVM Cache Manager', () => {
  let originalEnv;

  beforeEach(() => {
    jest.clearAllMocks();
    originalEnv = { ...process.env };
    
    // Clear environment variables
    delete process.env.IVM_CACHE_STRATEGY;
    delete process.env.IVM_CACHE_MAX_SIZE;
    delete process.env.IVM_CACHE_TTL_MS;
    
    // Reset manager state
    IvmCacheManager.strategy = null;
    IvmCacheManager.currentStrategyName = null;
    
    // Initialize with default strategy
    IvmCacheManager._initializeStrategy();
  });

  afterEach(() => {
    process.env = originalEnv;
    
    // Reset manager state for next test
    try {
      if (IvmCacheManager.strategy && typeof IvmCacheManager.strategy.destroy === 'function') {
        IvmCacheManager.strategy.destroy();
      }
    } catch (e) {
      // Ignore cleanup errors in tests
    }
    IvmCacheManager.strategy = null;
    IvmCacheManager.currentStrategyName = null;
  });

  describe('strategy initialization', () => {
    test('should default to none strategy', () => {
      expect(IvmCacheManager.getCurrentStrategy()).toBe('none');
    });

    test('should initialize isolate strategy when configured', () => {
      process.env.IVM_CACHE_STRATEGY = 'isolate';
      IvmCacheManager._initializeStrategy();
      
      expect(IvmCacheManager.getCurrentStrategy()).toBe('isolate');
    });

    test('should fall back to none for unknown strategy', () => {
      process.env.IVM_CACHE_STRATEGY = 'unknown';
      IvmCacheManager._initializeStrategy();
      
      expect(IvmCacheManager.getCurrentStrategy()).toBe('none');
      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('Unknown IVM cache strategy: unknown')
      );
    });

    test('should pass options to strategy constructor', () => {
      process.env.IVM_CACHE_STRATEGY = 'isolate';
      process.env.IVM_CACHE_MAX_SIZE = '100';
      process.env.IVM_CACHE_TTL_MS = '3600000';
      
      const IsolateStrategy = require('../../../src/util/ivmCache/strategies/isolate');
      IvmCacheManager._initializeStrategy();
      
      expect(IsolateStrategy).toHaveBeenCalledWith({
        maxSize: '100',
        ttlMs: '3600000',
      });
    });

    test('should destroy previous strategy when reinitializing', async () => {
      process.env.IVM_CACHE_STRATEGY = 'isolate';
      IvmCacheManager._initializeStrategy();
      
      const previousStrategy = IvmCacheManager.strategy;
      
      process.env.IVM_CACHE_STRATEGY = 'none';
      IvmCacheManager._initializeStrategy();
      
      // Give a moment for async destroy to potentially complete
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(previousStrategy.destroy).toHaveBeenCalled();
    });

    test('should not reinitialize if strategy unchanged', () => {
      process.env.IVM_CACHE_STRATEGY = 'none';
      IvmCacheManager._initializeStrategy();
      
      const NoneStrategy = require('../../../src/util/ivmCache/strategies/none');
      const callCount = NoneStrategy.mock.calls.length;
      
      IvmCacheManager._initializeStrategy();
      
      expect(NoneStrategy.mock.calls.length).toBe(callCount); // No new calls
    });
  });

  describe('generateKey method', () => {
    test('should call cacheKey utilities correctly', () => {
      const params = ['trans-1', 'code', ['lib1'], false, 'ws1'];
      
      const result = IvmCacheManager.generateKey(...params);
      
      expect(validateCacheKeyInputs).toHaveBeenCalledWith(...params);
      expect(generateCacheKey).toHaveBeenCalledWith(...params);
      expect(result).toBe('mocked:cache:key');
    });

    test('should handle validation errors', () => {
      validateCacheKeyInputs.mockImplementationOnce(() => {
        throw new Error('Validation failed');
      });
      
      expect(() => IvmCacheManager.generateKey('invalid')).toThrow('Validation failed');
      expect(logger.error).toHaveBeenCalledWith(
        'Error generating cache key',
        expect.objectContaining({
          error: 'Validation failed',
        })
      );
      
      // Reset the mock for other tests
      validateCacheKeyInputs.mockReturnValue(true);
    });
  });

  describe('get method', () => {
    test('should delegate to strategy with none strategy', async () => {
      const result = await IvmCacheManager.get('test:key', { cred: 'test' }, true);
      
      expect(IvmCacheManager.strategy.get).toHaveBeenCalledWith('test:key', { cred: 'test' }, true);
      expect(result).toBeNull();
    });

    test('should delegate to strategy with isolate strategy', async () => {
      process.env.IVM_CACHE_STRATEGY = 'isolate';
      IvmCacheManager._initializeStrategy();
      
      const result = await IvmCacheManager.get('test:key', { cred: 'test' }, false);
      
      expect(IvmCacheManager.strategy.get).toHaveBeenCalledWith('test:key', { cred: 'test' }, false);
      expect(result).toEqual({ reset: true });
    });

    test('should handle strategy errors gracefully', async () => {
      // Ensure we have a strategy with a mocked get method
      if (IvmCacheManager.strategy && IvmCacheManager.strategy.get) {
        IvmCacheManager.strategy.get.mockRejectedValue(new Error('Strategy error'));
      }
      
      const result = await IvmCacheManager.get('test:key');
      
      expect(result).toBeNull();
      expect(logger.error).toHaveBeenCalledWith(
        'Error getting from cache',
        expect.objectContaining({
          error: 'Strategy error',
        })
      );
    });

    test('should ensure strategy is current before operation', async () => {
      process.env.IVM_CACHE_STRATEGY = 'isolate';
      
      await IvmCacheManager.get('test:key');
      
      expect(IvmCacheManager.getCurrentStrategy()).toBe('isolate');
    });
  });

  describe('set method', () => {
    test('should delegate to strategy', async () => {
      const isolateData = { test: 'data' };
      
      await IvmCacheManager.set('test:key', isolateData);
      
      expect(IvmCacheManager.strategy.set).toHaveBeenCalledWith('test:key', isolateData);
    });

    test('should handle strategy errors gracefully', async () => {
      // Ensure we have a strategy with a mocked set method
      if (IvmCacheManager.strategy && IvmCacheManager.strategy.set) {
        IvmCacheManager.strategy.set.mockRejectedValue(new Error('Set error'));
      }
      
      await expect(IvmCacheManager.set('test:key', {})).resolves.toBeUndefined();
      expect(logger.error).toHaveBeenCalledWith(
        'Error setting cache',
        expect.objectContaining({
          error: 'Set error',
        })
      );
    });
  });

  describe('delete method', () => {
    test('should delegate to strategy', async () => {
      await IvmCacheManager.delete('test:key');
      
      expect(IvmCacheManager.strategy.delete).toHaveBeenCalledWith('test:key');
    });

    test('should handle strategy errors gracefully', async () => {
      // Ensure we have a strategy with a mocked delete method
      if (IvmCacheManager.strategy && IvmCacheManager.strategy.delete) {
        IvmCacheManager.strategy.delete.mockRejectedValue(new Error('Delete error'));
      }
      
      await expect(IvmCacheManager.delete('test:key')).resolves.toBeUndefined();
      expect(logger.error).toHaveBeenCalledWith(
        'Error deleting from cache',
        expect.objectContaining({
          error: 'Delete error',
        })
      );
    });
  });

  describe('clear method', () => {
    test('should delegate to strategy', async () => {
      await IvmCacheManager.clear();
      
      expect(IvmCacheManager.strategy.clear).toHaveBeenCalled();
    });

    test('should handle strategy errors gracefully', async () => {
      // Ensure we have a strategy with a mocked clear method
      if (IvmCacheManager.strategy && IvmCacheManager.strategy.clear) {
        IvmCacheManager.strategy.clear.mockRejectedValue(new Error('Clear error'));
      }
      
      await expect(IvmCacheManager.clear()).resolves.toBeUndefined();
      expect(logger.error).toHaveBeenCalledWith(
        'Error clearing cache',
        expect.objectContaining({
          error: 'Clear error',
        })
      );
    });
  });

  describe('getStats method', () => {
    test('should return strategy stats with manager info for none strategy', () => {
      const stats = IvmCacheManager.getStats();
      
      expect(stats).toEqual({
        strategy: 'none',
        hits: 0,
        misses: 0,
        hitRate: 0,
        currentSize: 0,
        maxSize: 0,
        manager: {
          currentStrategy: 'none',
          environmentStrategy: 'none',
        },
      });
    });

    test('should return strategy stats with manager info for isolate strategy', () => {
      process.env.IVM_CACHE_STRATEGY = 'isolate';
      IvmCacheManager._initializeStrategy();
      
      const stats = IvmCacheManager.getStats();
      
      expect(stats).toEqual({
        strategy: 'isolate',
        hits: 5,
        misses: 2,
        hitRate: 71.43,
        currentSize: 3,
        maxSize: 50,
        manager: {
          currentStrategy: 'isolate',
          environmentStrategy: 'isolate',
        },
      });
    });

    test('should handle strategy errors gracefully', () => {
      // Ensure we have a strategy with a mocked getStats method
      if (IvmCacheManager.strategy && IvmCacheManager.strategy.getStats) {
        IvmCacheManager.strategy.getStats.mockImplementation(() => {
          throw new Error('Stats error');
        });
      }
      
      const stats = IvmCacheManager.getStats();
      
      expect(stats).toEqual({
        strategy: 'none',
        error: 'Stats error',
      });
      expect(logger.error).toHaveBeenCalledWith(
        'Error getting cache stats',
        expect.objectContaining({
          error: 'Stats error',
        })
      );
    });
  });

  describe('getCurrentStrategy method', () => {
    test('should return current strategy name', () => {
      expect(IvmCacheManager.getCurrentStrategy()).toBe('none');
      
      process.env.IVM_CACHE_STRATEGY = 'isolate';
      IvmCacheManager._initializeStrategy();
      
      expect(IvmCacheManager.getCurrentStrategy()).toBe('isolate');
    });
  });

  describe('isCachingEnabled method', () => {
    test('should return false for none strategy', () => {
      expect(IvmCacheManager.isCachingEnabled()).toBe(false);
    });

    test('should return true for isolate strategy', () => {
      process.env.IVM_CACHE_STRATEGY = 'isolate';
      IvmCacheManager._initializeStrategy();
      
      expect(IvmCacheManager.isCachingEnabled()).toBe(true);
    });
  });

  describe('getHealthInfo method', () => {
    test('should return health info from strategy if available', () => {
      process.env.IVM_CACHE_STRATEGY = 'isolate';
      IvmCacheManager._initializeStrategy();
      
      const health = IvmCacheManager.getHealthInfo();
      
      expect(health).toEqual({
        strategy: 'isolate',
        healthy: true,
        memoryPressure: 6,
        cacheSize: 3,
        maxSize: 50,
        hitRate: 71.43,
      });
    });

    test('should return basic health info for strategies without getHealthInfo', () => {
      const health = IvmCacheManager.getHealthInfo();
      
      expect(health).toMatchObject({
        strategy: 'none',
        healthy: true,
        stats: expect.any(Object),
      });
    });

    test('should handle health info errors gracefully', () => {
      process.env.IVM_CACHE_STRATEGY = 'isolate';
      IvmCacheManager._initializeStrategy();
      
      IvmCacheManager.strategy.getHealthInfo.mockImplementation(() => {
        throw new Error('Health error');
      });
      
      const health = IvmCacheManager.getHealthInfo();
      
      expect(health).toEqual({
        strategy: 'isolate',
        healthy: false,
        error: 'Health error',
      });
    });
  });

  describe('destroy method', () => {
    test('should destroy strategy and reset state', async () => {
      process.env.IVM_CACHE_STRATEGY = 'isolate';
      IvmCacheManager._initializeStrategy();
      
      const strategy = IvmCacheManager.strategy;
      
      await IvmCacheManager.destroy();
      
      expect(strategy.destroy).toHaveBeenCalled();
      expect(IvmCacheManager.strategy).toBeNull();
      expect(IvmCacheManager.currentStrategyName).toBeNull();
    });

    test('should handle destroy errors gracefully', async () => {
      process.env.IVM_CACHE_STRATEGY = 'isolate';
      IvmCacheManager._initializeStrategy();
      
      IvmCacheManager.strategy.destroy.mockRejectedValue(new Error('Destroy error'));
      
      await expect(IvmCacheManager.destroy()).resolves.toBeUndefined();
      expect(logger.error).toHaveBeenCalledWith(
        'Error destroying cache strategy',
        expect.objectContaining({
          error: 'Destroy error',
        })
      );
    });

    test('should handle missing strategy gracefully', async () => {
      IvmCacheManager.strategy = null;
      
      await expect(IvmCacheManager.destroy()).resolves.toBeUndefined();
    });
  });

  describe('environment changes', () => {
    test('should reinitialize when environment changes', () => {
      expect(IvmCacheManager.getCurrentStrategy()).toBe('none');
      
      process.env.IVM_CACHE_STRATEGY = 'isolate';
      IvmCacheManager._initializeStrategy();
      
      expect(IvmCacheManager.getCurrentStrategy()).toBe('isolate');
      
      process.env.IVM_CACHE_STRATEGY = 'none';
      IvmCacheManager._initializeStrategy();
      
      expect(IvmCacheManager.getCurrentStrategy()).toBe('none');
    });

    test('should handle strategy change during operation', async () => {
      // Start with none strategy
      await IvmCacheManager.get('test:key');
      expect(IvmCacheManager.getCurrentStrategy()).toBe('none');
      
      // Change environment and perform operation
      process.env.IVM_CACHE_STRATEGY = 'isolate';
      await IvmCacheManager.get('test:key');
      expect(IvmCacheManager.getCurrentStrategy()).toBe('isolate');
    });
  });

  describe('integration scenarios', () => {
    test('should handle complete workflow with none strategy', async () => {
      const cacheKey = IvmCacheManager.generateKey('trans-1', 'code', [], false, 'ws1');
      
      let result = await IvmCacheManager.get(cacheKey);
      expect(result).toBeNull();
      
      await IvmCacheManager.set(cacheKey, { data: 'test' });
      
      result = await IvmCacheManager.get(cacheKey);
      expect(result).toBeNull(); // Still null with none strategy
      
      await IvmCacheManager.delete(cacheKey);
      await IvmCacheManager.clear();
      
      const stats = IvmCacheManager.getStats();
      expect(stats.strategy).toBe('none');
    });

    test('should handle complete workflow with isolate strategy', async () => {
      process.env.IVM_CACHE_STRATEGY = 'isolate';
      IvmCacheManager._initializeStrategy();
      
      const cacheKey = IvmCacheManager.generateKey('trans-1', 'code', [], false, 'ws1');
      
      let result = await IvmCacheManager.get(cacheKey);
      expect(result).toEqual({ reset: true }); // Mock isolate strategy returns this
      
      await IvmCacheManager.set(cacheKey, { data: 'test' });
      
      result = await IvmCacheManager.get(cacheKey);
      expect(result).toEqual({ reset: true });
      
      const stats = IvmCacheManager.getStats();
      expect(stats.strategy).toBe('isolate');
      
      const health = IvmCacheManager.getHealthInfo();
      expect(health.strategy).toBe('isolate');
    });

    test('should handle concurrent operations safely', async () => {
      process.env.IVM_CACHE_STRATEGY = 'isolate';
      
      const operations = [
        IvmCacheManager.get('key1'),
        IvmCacheManager.set('key2', { data: 'test' }),
        IvmCacheManager.delete('key3'),
        IvmCacheManager.getStats(),
        IvmCacheManager.getHealthInfo(),
        IvmCacheManager.clear(),
      ];
      
      const results = await Promise.all(operations);
      expect(results).toHaveLength(6);
    });
  });

  describe('error resilience', () => {
    test('should continue working after strategy errors', async () => {
      // Cause an error
      if (IvmCacheManager.strategy && IvmCacheManager.strategy.get) {
        IvmCacheManager.strategy.get.mockRejectedValueOnce(new Error('Temporary error'));
      }
      
      let result = await IvmCacheManager.get('test:key');
      expect(result).toBeNull();
      
      // Should work normally after error
      if (IvmCacheManager.strategy && IvmCacheManager.strategy.get) {
        IvmCacheManager.strategy.get.mockResolvedValueOnce(null);
      }
      result = await IvmCacheManager.get('test:key');
      expect(result).toBeNull();
    });

    test('should handle multiple consecutive errors', async () => {
      if (IvmCacheManager.strategy && IvmCacheManager.strategy.get) {
        IvmCacheManager.strategy.get.mockRejectedValue(new Error('Persistent error'));
      }
      
      for (let i = 0; i < 5; i++) {
        const result = await IvmCacheManager.get(`test:key:${i}`);
        expect(result).toBeNull();
      }
      
      expect(logger.error).toHaveBeenCalledTimes(5);
    });
  });
});
