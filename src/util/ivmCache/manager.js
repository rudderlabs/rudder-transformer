const OneIVMPerTransformationIdStrategy = require('./strategies/isolate');
const { generateCacheKey } = require('./cacheKey');
const logger = require('../../logger');

/**
 * Main IVM Cache Manager
 * Handles strategy selection and provides unified interface
 */
class IvmCacheManager {
  constructor() {
    this.strategy = null;
    this.initializeStrategy();
  }

  /**
   * Initialize cache strategy based on environment configuration
   * Only called when strategy needs to be created or changed
   */
  initializeStrategy() {
    // Clean up existing strategy if different
    if (this.strategy && typeof this.strategy.clear === 'function') {
      this.strategy.clear().catch((error) => {
        logger.error('Error destroying previous cache strategy', {
          error: error.message,
          strategy: this.currentStrategyName,
        });
      });
    }

    // Initialize new strategy
    const options = {
      maxSize: process.env.IVM_CACHE_MAX_SIZE,
      ttlMs: process.env.IVM_CACHE_TTL_MS,
    };
    this.strategy = new OneIVMPerTransformationIdStrategy(options);

    logger.info('IVM Cache Manager initialized', {
      ...options,
    });
  }

  /**
   * Generate cache key for transformation
   * @param {string} transformationVersionId
   * @param {Array<string>} libraryVersionIds
   * @returns {string} Cache key
   */
  generateKey(transformationVersionId, libraryVersionIds) {
    try {
      return generateCacheKey(transformationVersionId, libraryVersionIds);
    } catch (error) {
      logger.error('Error generating cache key', {
        error: error.message,
        transformationVersionId,
      });
      throw error;
    }
  }

  /**
   * Get cached isolate
   * @param {string} cacheKey Cache key
   * @param {Object} credentials Fresh credentials for execution
   * @returns {Object|null} Cached isolate or null
   */
  async get(cacheKey, credentials = {}) {
    try {
      const result = await this.strategy.get(cacheKey, credentials);
      return result;
    } catch (error) {
      logger.error('Error getting from cache', {
        error: error.message,
        cacheKey,
      });
      return null;
    }
  }

  /**
   * Cache an isolate
   * @param {string} cacheKey Cache key
   * @param {Object} isolateData Isolate data to cache
   */
  async set(cacheKey, isolateData) {
    try {
      await this.strategy.set(cacheKey, isolateData);
    } catch (error) {
      logger.error('Error setting cache', {
        error: error.message,
        cacheKey,
      });
    }
  }

  /**
   * Delete cached isolate
   * @param {string} cacheKey Cache key
   */
  async delete(cacheKey) {
    try {
      await this.strategy.delete(cacheKey);
    } catch (error) {
      logger.error('Error deleting from cache', {
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
      await this.strategy.clear();
    } catch (error) {
      logger.error('Error clearing cache', {
        error: error.message,
      });
    }
    logger.info('IVM cache cleared');
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getStats() {
    try {
      const stats = this.strategy.getStats();
      return {
        ...stats,
        manager: {
          environmentStrategy: process.env.IVM_CACHE_STRATEGY || 'isolate',
        },
      };
    } catch (error) {
      logger.error('Error getting cache stats', {
        error: error.message,
      });
      return {
        error: error.message,
      };
    }
  }
}

// Create singleton instance
const ivmCacheManager = new IvmCacheManager();

module.exports = ivmCacheManager;
