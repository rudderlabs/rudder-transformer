/**
 * Generates a deterministic cache key for IVM instances
 * @param {string} transformationVersionId - Unique transformation identifier
 * @param {Array<string>} libraryVersionIds - Array of library version IDs
 * @returns {string} Cache key for the IVM instance
 */
function generateCacheKey(transformationVersionId, libraryVersionIds) {
  // Normalize inputs
  const normalizedLibraryIds = (libraryVersionIds || []).slice().sort((a, b) => a.localeCompare(b));
  // Create hash of library version IDs
  const libsHash = normalizedLibraryIds.join('-');

  // Combine all components into a cache key
  const cacheKey = `${transformationVersionId}:${libsHash}`;

  return cacheKey;
}

/**
 * Extracts components from a cache key for debugging
 * @param {string} cacheKey
 * @returns {Object} Components of the cache key
 */
function parseCacheKey(cacheKey) {
  if (typeof cacheKey !== 'string') {
    throw new Error('cacheKey must be a string');
  }

  const parts = cacheKey.split(':');
  if (parts.length !== 2) {
    throw new Error('Invalid cache key format');
  }

  return {
    transformationVersionId: parts[0],
    libsHash: parts[1],
  };
}

module.exports = {
  generateCacheKey,
  parseCacheKey,
};
