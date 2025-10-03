/**
 * Generates a deterministic cache key for IVM instances
 * @param {string} transformationVersionId - Unique transformation identifier
 * @param {Array<string>} libraryVersionIds - Array of library version IDs
 * @returns {string} Cache key for the IVM instance
 */
function generateCacheKey(transformationVersionId, libraryVersionIds) {
  const normalizedLibraryIds = (libraryVersionIds || []).sort((a, b) => a.localeCompare(b));
  const libsHash = normalizedLibraryIds.join('-');
  return `${transformationVersionId}:${libsHash}`;
}

module.exports = {
  generateCacheKey,
};
