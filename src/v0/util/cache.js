const NodeCache = require('node-cache');

/**
 * Cache class wrapper around NodeCache with support for async store functions
 * and explicit cache setting.
 *
 * Features:
 * - TTL-based cache expiration
 * - Async store function support for cache misses
 * - Explicit set method for manual cache updates
 * - Backward compatible with callback-based pattern
 */
class Cache {
  /**
   * Creates a new Cache instance
   * @param {number} ttlSeconds - Default time-to-live for cache entries in seconds
   */
  constructor(ttlSeconds) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false,
    });
  }

  /**
   * Get a value from cache or fetch it using the store function
   *
   * @param {string} key - Cache key
   * @param {Function} [storeFunction] - Optional async function to fetch value on cache miss
   * @returns {Promise<any>} The cached or fetched value, or undefined if not found and no storeFunction
   *
   * @example
   * // Get with store function (traditional callback pattern)
   * const value = await cache.get('myKey', async () => fetchFromAPI());
   *
   * @example
   * // Get without store function (returns undefined on cache miss)
   * const value = await cache.get('myKey'); // undefined if not cached
   */
  async get(key, storeFunction) {
    // Check if key exists in cache (use has() to handle falsy values correctly)
    if (this.cache.has(key)) {
      const value = this.cache.get(key);
      return Promise.resolve(value);
    }

    // If no store function provided, return undefined (cache miss)
    if (!storeFunction) {
      return undefined;
    }

    // Fetch value using store function
    const result = await storeFunction();

    // Store in cache if the value is valid (not null or undefined), else skip
    let retVal = result;
    if (result !== null && result !== undefined) {
      // Handle special case where result has 'value' and 'age' properties
      // This allows store functions to specify custom TTL
      if (typeof result === 'object' && 'value' in result && 'age' in result) {
        this.cache.set(key, result.value, result.age);
        retVal = result.value;
      } else {
        this.cache.set(key, result);
      }
    }
    return retVal;
  }

  /**
   * Explicitly set a value in cache with optional TTL
   *
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} [ttl] - Optional time-to-live in seconds. If not provided, uses default TTL
   * @returns {boolean} True if successful
   *
   * @example
   * // Set with default TTL
   * cache.set('myKey', { data: 'value' });
   *
   * @example
   * // Set with custom TTL (60 seconds)
   * cache.set('myKey', { data: 'value' }, 60);
   */
  set(key, value, ttl) {
    if (ttl !== undefined) {
      return this.cache.set(key, value, ttl);
    }
    return this.cache.set(key, value);
  }

  /**
   * Delete a key from cache
   * @param {string} key - Cache key to delete
   * @returns {number} Number of deleted entries
   */
  del(key) {
    return this.cache.del(key);
  }
}

module.exports = Cache;
