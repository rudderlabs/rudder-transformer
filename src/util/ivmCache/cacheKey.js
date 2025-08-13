const crypto = require('crypto');

/**
 * Generates a deterministic cache key for IVM instances
 * @param {string} transformationId - Unique transformation identifier
 * @param {string} code - User transformation code
 * @param {Array<string>} libraryVersionIds - Array of library version IDs
 * @param {boolean} testMode - Whether running in test mode
 * @param {string} workspaceId - Workspace identifier
 * @returns {string} Cache key for the IVM instance
 */
function generateCacheKey(transformationId, code, libraryVersionIds, workspaceId) {
  // Normalize inputs
  const normalizedLibraryIds = (libraryVersionIds || []).slice().sort((a, b) => a.localeCompare(b));
  const normalizedWorkspaceId = workspaceId || 'default';

  // Create hash of the code to keep key length manageable
  const codeHash = crypto.createHash('sha256').update(code).digest('hex').substring(0, 16);

  // Create hash of library version IDs
  const libsHash = crypto
    .createHash('sha256')
    .update(JSON.stringify(normalizedLibraryIds))
    .digest('hex')
    .substring(0, 16);

  // Combine all components into a cache key
  const cacheKey = `${normalizedWorkspaceId}:${transformationId}:${codeHash}:${libsHash}`;

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
  if (parts.length !== 4) {
    throw new Error('Invalid cache key format');
  }

  return {
    workspaceId: parts[0],
    transformationId: parts[1],
    codeHash: parts[2],
    libsHash: parts[3],
  };
}

module.exports = {
  generateCacheKey,
  parseCacheKey,
};
