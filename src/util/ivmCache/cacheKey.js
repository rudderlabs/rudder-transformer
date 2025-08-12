const crypto = require('crypto');
const { isNil } = require('lodash');

/**
 * Generates a deterministic cache key for IVM instances
 * @param {string} transformationId - Unique transformation identifier
 * @param {string} code - User transformation code
 * @param {Array<string>} libraryVersionIds - Array of library version IDs
 * @param {boolean} testMode - Whether running in test mode
 * @param {string} workspaceId - Workspace identifier
 * @returns {string} Cache key for the IVM instance
 */
function generateCacheKey(transformationId, code, libraryVersionIds, testMode, workspaceId) {
  // Handle null/undefined inputs
  if (isNil(transformationId) || isNil(code)) {
    throw new Error('transformationId and code are required for cache key generation');
  }

  // Normalize inputs
  const normalizedLibraryIds = (libraryVersionIds || []).slice().sort();
  const normalizedTestMode = Boolean(testMode);
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
  const cacheKey = `${normalizedWorkspaceId}:${transformationId}:${codeHash}:${libsHash}:${normalizedTestMode}`;

  return cacheKey;
}

/**
 * Validates cache key components
 * @param {string} transformationId
 * @param {string} code
 * @param {Array<string>} libraryVersionIds
 * @param {boolean} testMode
 * @param {string} workspaceId
 * @returns {boolean} True if valid, throws error if invalid
 */
function validateCacheKeyInputs(transformationId, code, libraryVersionIds, testMode, workspaceId) {
  if (typeof transformationId !== 'string' || transformationId.length === 0) {
    throw new Error('transformationId must be a non-empty string');
  }

  if (typeof code !== 'string' || code.length === 0) {
    throw new Error('code must be a non-empty string');
  }

  if (libraryVersionIds && !Array.isArray(libraryVersionIds)) {
    throw new Error('libraryVersionIds must be an array');
  }

  if (workspaceId && typeof workspaceId !== 'string') {
    throw new Error('workspaceId must be a string');
  }

  return true;
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
  if (parts.length !== 5) {
    throw new Error('Invalid cache key format');
  }

  return {
    workspaceId: parts[0],
    transformationId: parts[1],
    codeHash: parts[2],
    libsHash: parts[3],
    testMode: parts[4] === 'true',
  };
}

module.exports = {
  generateCacheKey,
  validateCacheKeyInputs,
  parseCacheKey,
};
