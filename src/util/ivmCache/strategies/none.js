const logger = require('../../../logger');

/**
 * None strategy - no caching, current behavior
 * Creates and destroys IVM for every call
 */
class NoneStrategy {
  constructor() {
    this.name = 'none';
    logger.debug('IVM Cache strategy: none (no caching)');
  }

  /**
   * Get cached isolate (always returns null for none strategy)
   * @param {string} cacheKey Cache key
   * @returns {null} Always null for none strategy
   */
  async get(cacheKey) {
    return null;
  }

  /**
   * Set cached isolate (no-op for none strategy)
   * @param {string} cacheKey Cache key
   * @param {Object} isolateData Isolate data to cache
   */
  async set(cacheKey, isolateData) {
    // No-op for none strategy
    return;
  }

  /**
   * Delete cached isolate (no-op for none strategy)
   * @param {string} cacheKey Cache key
   */
  async delete(cacheKey) {
    // No-op for none strategy
    return;
  }

  /**
   * Clear all cached isolates (no-op for none strategy)
   */
  async clear() {
    // No-op for none strategy
    return;
  }

  /**
   * Get cache statistics
   * @returns {Object} Empty stats for none strategy
   */
  getStats() {
    return {
      strategy: 'none',
      hits: 0,
      misses: 0,
      hitRate: 0,
      currentSize: 0,
      maxSize: 0,
    };
  }

  /**
   * Destroy the strategy (no-op for none strategy)
   */
  async destroy() {
    // No-op for none strategy
    return;
  }
}

module.exports = NoneStrategy;
