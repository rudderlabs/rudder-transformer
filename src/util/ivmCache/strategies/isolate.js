const IvmCache = require('../index');
const { resetContext } = require('../contextReset');
const logger = require('../../../logger');
const stats = require('../../stats');

/**
 * Isolate strategy - cache entire isolate with compiled modules
 * Reset context for each execution to ensure clean state
 */
class IsolateStrategy {
  constructor(options = {}) {
    this.name = 'isolate';
    this.cache = new IvmCache(options);

    logger.info('IVM Cache strategy: isolate', {
      maxSize: this.cache.maxSize,
      ttlMs: this.cache.ttlMs,
    });
  }

  /**
   * Get cached isolate and reset context for fresh execution
   * @param {string} cacheKey Cache key
   * @param {Object} credentials Fresh credentials for this execution
   * @param {boolean} testMode Whether running in test mode
   * @returns {Object|null} Reset isolate ready for execution or null if not cached
   */
  async get(cacheKey, credentials = {}, testMode = false) {
    const startTime = new Date();

    try {
      const cachedIsolate = this.cache.get(cacheKey);

      if (!cachedIsolate) {
        stats.timing('ivm_cache_get_duration', startTime, {
          strategy: 'isolate',
          result: 'miss',
        });
        return null;
      }

      // Reset context for fresh execution
      const resetIsolate = await resetContext(cachedIsolate, credentials, testMode);

      stats.timing('ivm_cache_get_duration', startTime, {
        strategy: 'isolate',
        result: 'hit',
      });

      logger.debug('IVM Cache isolate retrieved and reset', {
        cacheKey,
        transformationId: cachedIsolate.transformationId,
      });

      return resetIsolate;
    } catch (error) {
      logger.error('Error getting cached isolate', {
        error: error.message,
        cacheKey,
      });

      // Remove corrupted entry from cache
      this.cache.delete(cacheKey);

      stats.timing('ivm_cache_get_duration', startTime, {
        strategy: 'isolate',
        result: 'error',
      });

      return null;
    }
  }

  /**
   * Cache an isolate with proper cleanup handling
   * @param {string} cacheKey Cache key
   * @param {Object} isolateData Isolate data to cache
   */
  async set(cacheKey, isolateData) {
    const startTime = new Date();

    try {
      // Prepare isolate for caching by storing essential components
      const cachableIsolate = {
        // Core isolate components
        isolate: isolateData.isolate,
        bootstrap: isolateData.bootstrap,
        customScriptModule: isolateData.customScriptModule,
        compiledModules: isolateData.compiledModules,

        // Metadata for debugging and reset
        transformationId: isolateData.transformationId,
        workspaceId: isolateData.workspaceId,
        fName: isolateData.fName,

        // Cache metadata
        cachedAt: Date.now(),

        // Cleanup function for cache eviction
        destroy: async () => {
          try {
            logger.debug('Destroying cached isolate', {
              cacheKey,
              transformationId: isolateData.transformationId,
            });

            // Release all references
            if (isolateData.fnRef) {
              isolateData.fnRef.release();
            }

            if (isolateData.bootstrap) {
              isolateData.bootstrap.release();
            }

            if (isolateData.customScriptModule) {
              isolateData.customScriptModule.release();
            }

            if (isolateData.context) {
              isolateData.context.release();
            }

            // Dispose the isolate
            if (isolateData.isolate) {
              await isolateData.isolate.dispose();
            }

            stats.increment('ivm_cache_destroyed_total', {
              strategy: 'isolate',
            });
          } catch (cleanupError) {
            logger.error('Error during cached isolate cleanup', {
              error: cleanupError.message,
              cacheKey,
            });
          }
        },
      };

      this.cache.set(cacheKey, cachableIsolate);

      stats.timing('ivm_cache_set_duration', startTime, {
        strategy: 'isolate',
      });

      logger.debug('IVM isolate cached successfully', {
        cacheKey,
        transformationId: isolateData.transformationId,
        cacheSize: this.cache.cache.size,
      });
    } catch (error) {
      logger.error('Error caching isolate', {
        error: error.message,
        cacheKey,
      });

      stats.timing('ivm_cache_set_duration', startTime, {
        strategy: 'isolate',
        result: 'error',
      });
    }
  }

  /**
   * Delete cached isolate
   * @param {string} cacheKey Cache key
   */
  async delete(cacheKey) {
    try {
      const cachedIsolate = this.cache.get(cacheKey);

      if (cachedIsolate && typeof cachedIsolate.destroy === 'function') {
        await cachedIsolate.destroy();
      }

      this.cache.delete(cacheKey);

      logger.debug('IVM cached isolate deleted', { cacheKey });
    } catch (error) {
      logger.error('Error deleting cached isolate', {
        error: error.message,
        cacheKey,
      });
    }
  }

  /**
   * Clear all cached isolates
   */
  async clear() {
    try {
      // Destroy all cached isolates
      for (const [key, cachedIsolate] of this.cache.cache.entries()) {
        if (cachedIsolate && typeof cachedIsolate.destroy === 'function') {
          await cachedIsolate.destroy();
        }
      }

      this.cache.clear();

      logger.info('IVM isolate cache cleared');
    } catch (error) {
      logger.error('Error clearing isolate cache', {
        error: error.message,
      });
    }
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getStats() {
    const baseStats = this.cache.getStats();
    return {
      ...baseStats,
      strategy: 'isolate',
    };
  }

  /**
   * Destroy the strategy and cleanup all resources
   */
  async destroy() {
    await this.clear();
    logger.info('IVM isolate strategy destroyed');
  }

  /**
   * Get cache health information
   * @returns {Object} Health information
   */
  getHealthInfo() {
    const stats = this.getStats();
    const memoryPressure = stats.currentSize / stats.maxSize;

    return {
      strategy: 'isolate',
      healthy: memoryPressure < 0.9, // Consider unhealthy if >90% full
      memoryPressure: Math.round(memoryPressure * 100),
      cacheSize: stats.currentSize,
      maxSize: stats.maxSize,
      hitRate: stats.hitRate,
    };
  }
}

module.exports = IsolateStrategy;
