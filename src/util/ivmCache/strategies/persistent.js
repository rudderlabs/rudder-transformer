const IvmCache = require('../index');
const logger = require('../../../logger');
const stats = require('../../stats');

class PersistentIsolateStrategy {
  constructor(options = {}) {
    this.name = 'persistent';
    this.cache = new IvmCache(options);

    logger.info('IVM Cache strategy: persistent', {
      maxSize: this.cache.maxSize,
      ttlMs: this.cache.ttlMs,
    });

    logger.warn('Persistent IVM cache mode enabled - ensure user transformations are trusted');
  }

  /**
   * Get cached persistent isolate
   * @param {string} cacheKey Cache key
   * @returns {Object|null} Persistent isolate or null if not cached
   */
  async get(cacheKey) {
    const startTime = new Date();

    try {
      const cachedIsolate = this.cache.get(cacheKey);

      if (!cachedIsolate) {
        stats.timing('ivm_cache_get_duration', startTime, {
          strategy: 'persistent',
          result: 'miss',
        });
        return null;
      }

      // In persistent mode, we simply return the cached isolate as-is
      // Credentials are already baked into the isolate during creation
      // No credential checking or context reset needed

      stats.timing('ivm_cache_get_duration', startTime, {
        strategy: 'persistent',
        result: 'hit',
      });

      logger.debug('Persistent IVM Cache isolate retrieved (no context reset)', {
        cacheKey,
        transformationId: cachedIsolate.transformationId,
      });

      // Return the cached isolate as-is (no context reset, no credential updates)
      return cachedIsolate;
    } catch (error) {
      logger.error('Error getting persistent cached isolate', {
        error: error.message,
        cacheKey,
      });

      // Remove corrupted entry from cache
      this.cache.delete(cacheKey);

      stats.timing('ivm_cache_get_duration', startTime, {
        strategy: 'persistent',
        result: 'error',
      });

      return null;
    }
  }

  /**
   * Cache a persistent isolate (entire state including context)
   * @param {string} cacheKey Cache key
   * @param {Object} isolateData Complete isolate data including context
   */
  async set(cacheKey, isolateData) {
    const startTime = new Date();

    try {
      // Store the complete isolate state (including context and bootstrapScriptResult)
      const persistentIsolate = {
        // Core isolate components
        isolate: isolateData.isolate,
        bootstrap: isolateData.bootstrap,
        customScriptModule: isolateData.customScriptModule,
        bootstrapScriptResult: isolateData.bootstrapScriptResult, // KEPT: Persistent mode keeps execution state
        context: isolateData.context, // KEPT: Persistent mode keeps context
        fnRef: isolateData.fnRef,
        fName: isolateData.fName,
        logs: isolateData.logs,

        // Compiled modules
        compiledModules: isolateData.compiledModules,

        // Metadata
        transformationId: isolateData.transformationId,
        workspaceId: isolateData.workspaceId,

        // Cache metadata
        cachedAt: Date.now(),
        mode: 'persistent',

        // Memory monitoring
        initialMemoryUsage: isolateData.isolate?.getHeapStatisticsSync?.()?.total_heap_size || 0,

        // Cleanup function for cache eviction
        destroy: async () => {
          try {
            logger.debug('Destroying persistent cached isolate', {
              cacheKey,
              transformationId: isolateData.transformationId,
            });

            // Release all references in reverse order of creation
            if (isolateData.fnRef) {
              isolateData.fnRef.release();
            }

            if (isolateData.bootstrapScriptResult) {
              isolateData.bootstrapScriptResult.release();
            }

            if (isolateData.context) {
              isolateData.context.release();
            }

            if (isolateData.bootstrap) {
              isolateData.bootstrap.release();
            }

            if (isolateData.customScriptModule) {
              isolateData.customScriptModule.release();
            }

            // Dispose the isolate
            if (isolateData.isolate) {
              await isolateData.isolate.dispose();
            }

            stats.increment('ivm_cache_destroyed_total', {
              strategy: 'persistent',
            });
          } catch (cleanupError) {
            logger.error('Error during persistent cached isolate cleanup', {
              error: cleanupError.message,
              cacheKey,
            });
          }
        },
      };

      this.cache.set(cacheKey, persistentIsolate);

      stats.timing('ivm_cache_set_duration', startTime, {
        strategy: 'persistent',
      });

      logger.debug('Persistent IVM isolate cached successfully', {
        cacheKey,
        transformationId: isolateData.transformationId,
        cacheSize: this.cache.cache.size,
        memoryUsage: persistentIsolate.initialMemoryUsage,
      });
    } catch (error) {
      logger.error('Error caching persistent isolate', {
        error: error.message,
        cacheKey,
      });

      stats.timing('ivm_cache_set_duration', startTime, {
        strategy: 'persistent',
        result: 'error',
      });
    }
  }

  /**
   * Delete cached persistent isolate
   * @param {string} cacheKey Cache key
   */
  async delete(cacheKey) {
    try {
      const cachedIsolate = this.cache.get(cacheKey);

      if (cachedIsolate && typeof cachedIsolate.destroy === 'function') {
        await cachedIsolate.destroy();
      }

      this.cache.delete(cacheKey);

      logger.debug('Persistent IVM cached isolate deleted', { cacheKey });
    } catch (error) {
      logger.error('Error deleting persistent cached isolate', {
        error: error.message,
        cacheKey,
      });
    }
  }

  /**
   * Get cache statistics with memory monitoring
   * @returns {Object} Cache statistics
   */
  getStats() {
    const baseStats = this.cache.getStats();

    // Calculate memory usage across all cached isolates
    let totalMemoryUsage = 0;
    let isolateCount = 0;

    try {
      const cacheEntries = Array.from(this.cache.cache.entries());
      cacheEntries.forEach(([, cachedIsolate]) => {
        if (cachedIsolate.isolate?.getHeapStatisticsSync) {
          const heapStats = cachedIsolate.isolate.getHeapStatisticsSync();
          totalMemoryUsage += heapStats.total_heap_size || 0;
          isolateCount += 1;
        }
      });
    } catch (error) {
      logger.debug('Error calculating memory usage', { error: error.message });
    }

    return {
      ...baseStats,
      strategy: 'persistent',
      memory: {
        totalHeapSize: totalMemoryUsage,
        averageHeapSize: isolateCount > 0 ? Math.round(totalMemoryUsage / isolateCount) : 0,
        isolateCount,
      },
    };
  }
}

module.exports = PersistentIsolateStrategy;
