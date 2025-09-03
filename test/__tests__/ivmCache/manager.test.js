const IvmCacheManager = require('../../../src/util/ivmCache/manager');

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
    destroy: jest.fn().mockResolvedValue(undefined),
  }));
});

jest.mock('../../../src/util/ivmCache/cacheKey', () => ({
  generateCacheKey: jest.fn().mockReturnValue('mocked:cache:key'),
}));

// Mock logger
jest.mock('../../../src/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

const logger = require('../../../src/logger');
const { generateCacheKey } = require('../../../src/util/ivmCache/cacheKey');

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
    IvmCacheManager.initializeStrategy();
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
    test('should pass options to strategy constructor', () => {
      process.env.IVM_CACHE_STRATEGY = 'isolate';
      process.env.IVM_CACHE_MAX_SIZE = '100';
      process.env.IVM_CACHE_TTL_MS = '3600000';
      
      const OneIVMPerTransformationIdStrategy = require('../../../src/util/ivmCache/strategies/isolate');
      IvmCacheManager.initializeStrategy();
      
      expect(OneIVMPerTransformationIdStrategy).toHaveBeenCalledWith({
        maxSize: '100',
        ttlMs: '3600000',
      });
    });

    test('should destroy previous strategy when reinitializing', async () => {
      process.env.IVM_CACHE_STRATEGY = 'isolate';
      IvmCacheManager.initializeStrategy();
      
      const previousStrategy = IvmCacheManager.strategy;
      
      process.env.IVM_CACHE_STRATEGY = 'none';
      IvmCacheManager.initializeStrategy();
      
      // Give a moment for async destroy to potentially complete
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(previousStrategy.clear).toHaveBeenCalled();
    });
  });

  describe('generateKey method', () => {
    test('should call cacheKey utilities correctly', () => {
      const params = ['trans-1', ['lib1']];
      
      const result = IvmCacheManager.generateKey(...params);
      
      expect(generateCacheKey).toHaveBeenCalledWith(...params);
      expect(result).toBe('mocked:cache:key');
    });
  });

  describe('get method', () => {
    test('should delegate to strategy with isolate strategy', async () => {
      process.env.IVM_CACHE_STRATEGY = 'isolate';
      IvmCacheManager.initializeStrategy();
      
      const result = await IvmCacheManager.get('test:key', { cred: 'test' }, false);
      
      expect(IvmCacheManager.strategy.get).toHaveBeenCalledWith('test:key', { cred: 'test' });
      expect(result).toEqual({ reset: true });
    });

    test('should handle strategy errors gracefully', async () => {
      // Ensure we have a strategy with a mocked get method
      if (IvmCacheManager.strategy && IvmCacheManager.strategy.get) {
        IvmCacheManager.strategy.get.mockImplementation(() => {
          throw new Error('Strategy error');
        });
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

  describe('getStats method', () => {
    test('should return strategy stats with manager info for isolate strategy', () => {
      process.env.IVM_CACHE_STRATEGY = 'isolate';
      IvmCacheManager.initializeStrategy();
      
      const stats = IvmCacheManager.getStats();
      
      expect(stats).toEqual({
        hits: 5,
        misses: 2,
        strategy: 'isolate',
        hitRate: 71.43,
        currentSize: 3,
        maxSize: 50,
        manager: {
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

  describe('integration scenarios', () => {
    test('should handle complete workflow with isolate strategy', async () => {
      process.env.IVM_CACHE_STRATEGY = 'isolate';
      IvmCacheManager.initializeStrategy();
      
      const cacheKey = IvmCacheManager.generateKey('trans-1', 'code', [], false, 'ws1');
      
      let result = await IvmCacheManager.get(cacheKey);
      expect(result).toEqual({ reset: true }); // Mock isolate strategy returns this
      
      await IvmCacheManager.set(cacheKey, { data: 'test' });
      
      result = await IvmCacheManager.get(cacheKey);
      expect(result).toEqual({ reset: true });
      
      const stats = IvmCacheManager.getStats();
      expect(stats.strategy).toBe('isolate');
    });

    test('should handle concurrent operations safely', async () => {
      process.env.IVM_CACHE_STRATEGY = 'isolate';
      
      const operations = [
        IvmCacheManager.get('key1'),
        IvmCacheManager.set('key2', { data: 'test' }),
        IvmCacheManager.delete('key3'),
        IvmCacheManager.getStats(),
        IvmCacheManager.clear(),
      ];
      
      const results = await Promise.all(operations);
      expect(results).toHaveLength(5);
    });
  });

  describe('error resilience', () => {
    test('should continue working after strategy errors', async () => {
      // Cause an error
      if (IvmCacheManager.strategy && IvmCacheManager.strategy.get) {
        IvmCacheManager.strategy.get.mockImplementationOnce(() => {
          throw new Error('Temporary error');
        });
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
        IvmCacheManager.strategy.get.mockImplementation(() => {
          throw new Error('Persistent error');
        });
      }
      
      for (let i = 0; i < 5; i++) {
        const result = await IvmCacheManager.get(`test:key:${i}`);
        expect(result).toBeNull();
      }
      
      expect(logger.error).toHaveBeenCalledTimes(5);
    });
  });
});
