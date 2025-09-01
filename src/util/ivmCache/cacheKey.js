/**
 * Generates a deterministic cache key for IVM instances
 * @param {string} transformationVersionId - Unique transformation identifier
 * @param {Array<string>} libraryVersionIds - Array of library version IDs
 * @returns {string} Cache key for the IVM instance
 */
function generateCacheKey(transformationVersionId, libraryVersionIds) {
  // Normalize inputs
  const normalizedLibraryIds = (libraryVersionIds || []).sort();
  // Create hash of library version IDs
  const libsHash = normalizedLibraryIds.join('-');

  // Combine all components into a cache key
  const cacheKey = `${transformationVersionId}:${libsHash}`;

  return cacheKey;
}

module.exports = {
  generateCacheKey,
};
