const NoneStrategy = require('./strategies/none');
const IsolateStrategy = require('./strategies/isolate');
const { generateCacheKey } = require('./cacheKey');
const logger = require('../../logger');

/**
 * Main IVM Cache Manager
 * Handles strategy selection and provides unified interface
 */
class IvmCacheManager {
  constructor() {
    this.strategy = null;
    this.currentStrategyName = null;
    this.initializeStrategy();
  }

  /**
   * Initialize cache strategy based on environment configuration
   * Only called when strategy needs to be created or changed
   */
  initializeStrategy() {
    const strategyName = (process.env.IVM_CACHE_STRATEGY || 'none').toLowerCase();

    // If strategy is already initialized and matches, do nothing
    if (this.currentStrategyName === strategyName && this.strategy) {
      return;
    }

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

    switch (strategyName) {
      case 'none':
        this.strategy = new NoneStrategy();
        break;

      case 'isolate':
        this.strategy = new IsolateStrategy(options);
        break;

      default:
        logger.warn(`Unknown IVM cache strategy: ${strategyName}, falling back to 'none'`);
        this.strategy = new NoneStrategy();
        this.currentStrategyName = 'none';
        return;
    }

    this.currentStrategyName = strategyName;

    logger.info('IVM Cache Manager initialized', {
      strategy: this.currentStrategyName,
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
        strategy: this.currentStrategyName,
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
        strategy: this.currentStrategyName,
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
        strategy: this.currentStrategyName,
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
        strategy: this.currentStrategyName,
      });
    }
    logger.info('IVM cache cleared', { strategy: this.currentStrategyName });
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
          currentStrategy: this.currentStrategyName,
          environmentStrategy: process.env.IVM_CACHE_STRATEGY || 'none',
        },
      };
    } catch (error) {
      logger.error('Error getting cache stats', {
        error: error.message,
        strategy: this.currentStrategyName,
      });
      return {
        strategy: this.currentStrategyName,
        error: error.message,
      };
    }
  }

  /**
   * Get current strategy name
   * @returns {string} Strategy name
   */
  getCurrentStrategy() {
    return this.currentStrategyName;
  }

  /**
   * Check if caching is enabled
   * @returns {boolean} True if caching is enabled
   */
  isCachingEnabled() {
    return this.currentStrategyName !== 'none';
  }
}

// Create singleton instance
const ivmCacheManager = new IvmCacheManager();

module.exports = ivmCacheManager;
