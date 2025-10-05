const { LRUCache } = require('lru-cache');
const logger = require('../../logger');
const stats = require('../stats');

/**
 * Least Recently Used Cache implementation using battle-tested lru-cache library
 * Handles caching of IVM isolates with TTL support and proper cleanup
 */
class DisposableCache {
  constructor(options = {}) {
    this.maxSize = Number.parseInt(options.maxSize ?? process.env.IVM_CACHE_MAX_SIZE ?? '10', 10);
    this.ttlMs = Number.parseInt(options.ttlMs ?? process.env.IVM_CACHE_TTL_MS ?? '300000', 10);

    this.cache = new LRUCache({
      max: this.maxSize,
      ttl: this.ttlMs,
      allowStale: false,
      updateAgeOnGet: true,
      updateAgeOnHas: false,
      dispose: this.handleDispose.bind(this),
    });

    // Stats tracking
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      evictions: 0,
      ttlExpiries: 0,
      currentSize: 0,
    };

    logger.debug('IVM Cache initialized', {
      maxSize: this.maxSize,
      ttlMs: this.ttlMs,
    });
  }

  /**
   * Handle disposal of cache items with proper cleanup
   * @param {any} value The cached value being disposed
   * @param {string} key The cache key
   * @param {string} reason Disposal reason ('evict', 'set', 'delete')
   */
  handleDispose(value, key, reason) {
    try {
      // Track disposal reason
      if (reason === 'evict') {
        this.stats.evictions += 1;
      }
      value.destroy().catch((error) => {
        logger.error('Error in async destroy during disposal', {
          key,
          reason,
          error: error.message,
        });
      });
      logger.debug('IVM Cache item disposed', { key, reason });
    } catch (error) {
      logger.error('Error disposing cache item', {
        key,
        reason,
        error: error.message,
      });
    }

    this.stats.currentSize = this.cache.size;
    this.emitStats('dispose');
  }

  /**
   * Get an item from cache
   * @param {string} key Cache key
   * @returns {any|null} Cached value or null if not found
   */
  get(key) {
    const item = this.cache.get(key);

    if (!item) {
      this.stats.misses += 1;
      this.emitStats('miss');
      return null;
    }

    this.stats.hits += 1;
    this.emitStats('hit');

    logger.debug('IVM Cache hit', { key, cacheSize: this.cache.size });
    return item;
  }

  /**
   * Set an item in cache
   * @param {string} key Cache key
   * @param {any} value Value to cache
   */
  set(key, value) {
    // If maxSize is 0, don't cache anything
    if (this.maxSize === 0) {
      this.emitStats('set');
      return;
    }

    this.cache.set(key, value);
    this.stats.sets += 1;
    this.stats.currentSize = this.cache.size;

    logger.debug('IVM Cache set', {
      key,
      cacheSize: this.cache.size,
      ttlMs: this.ttlMs,
    });

    this.emitStats('set');
  }

  /**
   * Remove an item from cache
   * @param {string} key Cache key
   */
  delete(key) {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.stats.currentSize = this.cache.size;
      logger.debug('IVM Cache delete', { key, cacheSize: this.cache.size });
    }
    return deleted;
  }

  /**
   * Check if a key exists in cache
   * @param {string} key Cache key
   * @returns {boolean} True if key exists
   */
  has(key) {
    return this.cache.has(key);
  }

  /**
   * Clear all items from cache
   */
  clear() {
    this.cache.clear();
    // Reset all stats when clearing cache
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      evictions: 0,
      ttlExpiries: 0,
      currentSize: 0,
    };
    logger.info('IVM Cache cleared');
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getStats() {
    const hitRate =
      this.stats.hits + this.stats.misses > 0
        ? (this.stats.hits / (this.stats.hits + this.stats.misses)) * 100
        : 0;

    return {
      ...this.stats,
      hitRate: Math.round(hitRate),
      maxSize: this.maxSize,
      ttlMs: this.ttlMs,
    };
  }

  /**
   * Get cache keys
   * @returns {Array} Array of cache keys
   */
  keys() {
    return Array.from(this.cache.keys());
  }

  /**
   * Get cache values
   * @returns {Array} Array of cache values
   */
  values() {
    return Array.from(this.cache.values());
  }

  /**
   * Get cache entries
   * @returns {Array} Array of [key, value] pairs
   */
  entries() {
    return Array.from(this.cache.entries());
  }

  /**
   * Emit cache statistics
   * @param {string} operation Operation type
   */
  emitStats(operation) {
    const tags = {
      cache: 'ivm',
      operation,
    };

    // Emit operation-specific stats
    switch (operation) {
      case 'hit':
        stats.increment('ivm_cache_hits_total', tags);
        break;
      case 'miss':
        stats.increment('ivm_cache_misses_total', tags);
        break;
      case 'set':
        stats.increment('ivm_cache_sets_total', tags);
        break;
      case 'dispose':
        stats.increment('ivm_cache_disposals_total', tags);
        break;
      default:
        // No action for unknown operations
        break;
    }

    // Emit current cache size
    stats.gauge('ivm_cache_size', this.stats.currentSize, tags);
  }
}

module.exports = DisposableCache;
