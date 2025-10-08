const DisposableCache = require('../index');
const { createNewContext } = require('../contextReset');
const logger = require('../../../logger');
const stats = require('../../stats');

/**
 * Isolate strategy - cache entire isolate with compiled modules
 * Reset context for each execution to ensure clean state
 */
class OneIVMPerTransformationIdStrategy {
  constructor(options = {}) {
    this.name = 'isolate';
    this.cache = new DisposableCache(options);

    logger.info('IVM Cache strategy: isolate', {
      maxSize: this.cache.maxSize,
      ttlMs: this.cache.ttlMs,
    });
  }

  /**
   * Get cached isolate and reset context for fresh execution
   * @param {string} cacheKey Cache key
   * @param {Object} credentials Fresh credentials for this execution
   * @returns {Object|null} Reset isolate ready for execution or null if not cached
   */
  async get(cacheKey, credentials = {}) {
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
      const cachedIsolateWithResetContext = await createNewContext(cachedIsolate, credentials);

      stats.timing('ivm_cache_get_duration', startTime, {
        strategy: 'isolate',
        result: 'hit',
      });

      logger.debug('IVM Cache isolate retrieved and reset', {
        cacheKey,
        transformationId: cachedIsolate.transformationId,
      });

      return cachedIsolateWithResetContext;
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
      const cacheableIsolate = {
        isolate: isolateData.isolate,
        bootstrap: isolateData.bootstrap,
        customScriptModule: isolateData.customScriptModule,
        bootstrapScriptResult: isolateData.bootstrapScriptResult,
        fnRef: isolateData.fnRef,
        fName: isolateData.fName,
        logs: isolateData.logs,

        compiledModules: isolateData.compiledModules,

        // Metadata for debugging and reset
        transformationId: isolateData.transformationId,
        workspaceId: isolateData.workspaceId,
        moduleSource: isolateData.moduleSource,
        // Cache metadata
        cachedAt: Date.now(),

        // Cleanup function for cache eviction
        destroy: async () => {
          try {
            logger.debug('Destroying cached isolate', {
              cacheKey,
              transformationId: isolateData.transformationId,
            });

            // Release all references safely - each in its own try-catch to prevent cascade failures
            try {
              isolateData.fnRef?.release();
            } catch (refError) {
              logger.debug('fnRef already released or invalid', {
                cacheKey,
                error: refError.message,
              });
            }

            try {
              isolateData.bootstrap?.release();
            } catch (refError) {
              logger.debug('bootstrap already released or invalid', {
                cacheKey,
                error: refError.message,
              });
            }

            try {
              isolateData.customScriptModule?.release();
            } catch (refError) {
              logger.debug('customScriptModule already released or invalid', {
                cacheKey,
                error: refError.message,
              });
            }

            try {
              isolateData.bootstrapScriptResult?.release();
            } catch (refError) {
              logger.debug('bootstrapScriptResult already released or invalid', {
                cacheKey,
                error: refError.message,
              });
            }

            // Dispose the isolate
            try {
              await isolateData.isolate?.dispose();
            } catch (disposeError) {
              logger.error('isolate already disposed or invalid', {
                cacheKey,
                error: disposeError.message,
              });
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

      this.cache.set(cacheKey, cacheableIsolate);

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
      await cachedIsolate.destroy();
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
      const entries = Array.from(this.cache.cache.entries());
      await Promise.all(
        entries.map(async ([, cachedIsolate]) => {
          await cachedIsolate.destroy();
        }),
      );

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
}

module.exports = OneIVMPerTransformationIdStrategy;
