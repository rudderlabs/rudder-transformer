const logger = require('../../logger');
const stats = require('../stats');

/**
 * LRU Cache with TTL support for IVM instances
 */
class IvmCache {
  constructor(options = {}) {
    this.maxSize = parseInt(options.maxSize || process.env.IVM_CACHE_MAX_SIZE || '50', 10);
    this.ttlMs = parseInt(options.ttlMs || process.env.IVM_CACHE_TTL_MS || '1800000', 10); // 30 min default

    // Cache storage: Map maintains insertion order for LRU
    this.cache = new Map();

    // TTL tracking
    this.ttlTimeouts = new Map();

    // Statistics
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      ttlExpiries: 0,
      currentSize: 0,
    };

    logger.info('IVM Cache initialized', {
      maxSize: this.maxSize,
      ttlMs: this.ttlMs,
    });
  }

  /**
   * Get an item from cache
   * @param {string} key Cache key
   * @returns {any|null} Cached value or null if not found
   */
  get(key) {
    const item = this.cache.get(key);

    if (!item) {
      this.stats.misses++;
      this._emitStats('miss');
      return null;
    }

    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, item);

    this.stats.hits++;
    this._emitStats('hit');

    logger.debug('IVM Cache hit', { key, cacheSize: this.cache.size });
    return item.value;
  }

  /**
   * Set an item in cache
   * @param {string} key Cache key
   * @param {any} value Value to cache
   */
  set(key, value) {
    // Remove existing entry if present
    if (this.cache.has(key)) {
      this._clearTtl(key);
      this.cache.delete(key);
    }

    // Evict least recently used if at capacity
    if (this.cache.size >= this.maxSize) {
      this._evictLru();
    }

    // Add new entry
    const item = {
      value,
      createdAt: Date.now(),
    };

    this.cache.set(key, item);
    this.stats.currentSize = this.cache.size;

    // Set TTL timeout
    this._setTtl(key);

    logger.debug('IVM Cache set', {
      key,
      cacheSize: this.cache.size,
      ttlMs: this.ttlMs,
    });

    this._emitStats('set');
  }

  /**
   * Remove an item from cache
   * @param {string} key Cache key
   */
  delete(key) {
    if (this.cache.has(key)) {
      this._clearTtl(key);
      this.cache.delete(key);
      this.stats.currentSize = this.cache.size;

      logger.debug('IVM Cache delete', { key, cacheSize: this.cache.size });
    }
  }

  /**
   * Clear all cache entries
   */
  clear() {
    // Clear all TTL timeouts
    for (const key of this.ttlTimeouts.keys()) {
      this._clearTtl(key);
    }

    this.cache.clear();
    this.stats.currentSize = 0;

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
      hitRate: Math.round(hitRate * 100) / 100,
      maxSize: this.maxSize,
      ttlMs: this.ttlMs,
    };
  }

  /**
   * Check if cache has a key
   * @param {string} key Cache key
   * @returns {boolean} True if key exists
   */
  has(key) {
    return this.cache.has(key);
  }

  /**
   * Get all cache keys
   * @returns {Array<string>} Array of cache keys
   */
  keys() {
    return Array.from(this.cache.keys());
  }

  /**
   * Evict least recently used item
   * @private
   */
  _evictLru() {
    if (this.cache.size === 0) return;

    // First item in Map is least recently used
    const [lruKey] = this.cache.keys();
    const lruItem = this.cache.get(lruKey);

    // Clean up the evicted item if it has a destroy method
    if (lruItem && lruItem.value && typeof lruItem.value.destroy === 'function') {
      try {
        lruItem.value.destroy();
      } catch (error) {
        logger.error('Error destroying evicted cache item', { error: error.message, key: lruKey });
      }
    }

    this._clearTtl(lruKey);
    this.cache.delete(lruKey);
    this.stats.evictions++;
    this.stats.currentSize = this.cache.size;

    logger.debug('IVM Cache LRU eviction', { evictedKey: lruKey, cacheSize: this.cache.size });
  }

  /**
   * Set TTL timeout for a key
   * @private
   * @param {string} key Cache key
   */
  _setTtl(key) {
    const timeout = setTimeout(() => {
      const item = this.cache.get(key);

      // Clean up the expired item if it has a destroy method
      if (item && item.value && typeof item.value.destroy === 'function') {
        try {
          item.value.destroy();
        } catch (error) {
          logger.error('Error destroying expired cache item', { error: error.message, key });
        }
      }

      this.cache.delete(key);
      this.ttlTimeouts.delete(key);
      this.stats.ttlExpiries++;
      this.stats.currentSize = this.cache.size;

      logger.debug('IVM Cache TTL expiry', { key, cacheSize: this.cache.size });
    }, this.ttlMs);

    this.ttlTimeouts.set(key, timeout);
  }

  /**
   * Clear TTL timeout for a key
   * @private
   * @param {string} key Cache key
   */
  _clearTtl(key) {
    const timeout = this.ttlTimeouts.get(key);
    if (timeout) {
      clearTimeout(timeout);
      this.ttlTimeouts.delete(key);
    }
  }

  /**
   * Emit cache statistics
   * @private
   * @param {string} operation Operation type
   */
  _emitStats(operation) {
    const tags = {
      operation,
      cacheSize: this.cache.size,
      maxSize: this.maxSize,
    };

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
    }

    // Emit current cache size
    stats.gauge('ivm_cache_size_current', this.cache.size, tags);

    // Emit hit rate periodically
    if ((this.stats.hits + this.stats.misses) % 10 === 0) {
      const hitRate =
        this.stats.hits + this.stats.misses > 0
          ? (this.stats.hits / (this.stats.hits + this.stats.misses)) * 100
          : 0;
      stats.gauge('ivm_cache_hit_ratio', hitRate, tags);
    }
  }
}

module.exports = IvmCache;
