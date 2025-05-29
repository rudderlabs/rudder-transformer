const NodeCache = require('node-cache');
const { TransformationIsolate } = require('./transformationIsolate');

// Environment variables for IVM cache configuration
const IVM_CACHE_MAX = parseInt(process.env.IVM_CACHE_MAX || '10', 10);
const IVM_CACHE_SECONDS = parseInt(process.env.IVM_CACHE_SECONDS || '300', 10); // Default: 5 minutes
const SHARE_ISOLATE = process.env.SHARE_ISOLATE === "true";
const IVM_CACHE = process.env.IVM_CACHE === "true";

let globalSharedIsolate = null;

// Cache for storing TransformationIsolate instances
const ivmCache = new NodeCache({
  stdTTL: IVM_CACHE_SECONDS,
  checkperiod: Math.min(IVM_CACHE_SECONDS / 10, 60), // Check for expired items at 1/10 of TTL or max 60 seconds
  useClones: false, // Don't clone objects when getting from cache
  deleteOnExpire: true, // Automatically delete expired items
});

// Setup cache event listeners for resource cleanup
ivmCache.on('expired', async (key, value) => {
  console.log(`IVM cache entry expired for transformationVersionId: ${key}`);
  if (value && typeof value.Release === 'function') {
    await value.Release();
  }
});

ivmCache.on('del', async (key, value) => {
  console.log(`IVM cache entry deleted for transformationVersionId: ${key}`);
  if (value && typeof value.Release === 'function') {
    await value.Release();
  }
});

/**
 * Release resources associated with a TransformationIsolate instance
 * @param {TransformationIsolate} isolateInstance - The TransformationIsolate instance to release
 */
async function releaseIvmResources(isolateInstance) {
  if (!isolateInstance) return;

  try {
    if (typeof isolateInstance.Release === 'function') {
      await isolateInstance.Release();
      console.log('TransformationIsolate resources released successfully');
    } else {
      console.warn('TransformationIsolate instance does not have a Release method');
    }
  } catch (error) {
    console.error('Error releasing TransformationIsolate resources:', error);
  }
}

/**
 * Create or retrieve a TransformationIsolate instance for a specific transformation version
 * @param {string} transformationVersionId - The version ID of the transformation
 * @param {string} code - The transformation code
 * @param {Object} secrets - The secrets for the transformation
 * @param {Object} eventsMetadata - The events metadata
 * @param {string} workspaceId - The workspace ID
 * @param {Array} libraryVersionIDs - The library version IDs
 * @param {Object} credentials - The credentials
 * @returns {Promise<TransformationIsolate>} - The TransformationIsolate instance
 */
async function createIvm(
  transformationVersionId,
  code,
  secrets = {},
  eventsMetadata = {},
  workspaceId = '',
  libraryVersionIDs = [],
  credentials = {}
) {
  if (SHARE_ISOLATE) {
    console.log("Sharing isolate between transformations.")
    if (!globalSharedIsolate) {
      globalSharedIsolate = createNewIvm(code, secrets, eventsMetadata, transformationVersionId, workspaceId, libraryVersionIDs, credentials);
    }
    return globalSharedIsolate;
  }

  // If caching is not enabled, create a new TransformationIsolate instance without caching
  if (!IVM_CACHE) {
    console.log('IVM_CACHE is disabled, creating new TransformationIsolate without caching');
    return createNewIvm(code, secrets, eventsMetadata, transformationVersionId, workspaceId, libraryVersionIDs, credentials);
  }

  // Caching is enabled, proceed with normal caching logic
  if (!transformationVersionId) {
    console.warn('No transformationVersionId provided, creating new TransformationIsolate without caching');
    return createNewIvm(code, secrets, eventsMetadata, transformationVersionId, workspaceId, libraryVersionIDs, credentials);
  }

  // Check if we already have a cached TransformationIsolate for this transformation version
  const cachedIvm = ivmCache.get(transformationVersionId);
  if (cachedIvm) {
    console.log(`Using cached TransformationIsolate for transformationVersionId: ${transformationVersionId}`);
    return cachedIvm;
  }

  // Check if we've reached the maximum cache size
  const currentCacheSize = ivmCache.keys().length;
  if (currentCacheSize >= IVM_CACHE_MAX) {
    console.warn(`IVM cache limit (${IVM_CACHE_MAX}) reached. Creating new TransformationIsolate without caching.`);
    return createNewIvm(code, secrets, eventsMetadata, transformationVersionId, workspaceId, libraryVersionIDs, credentials);
  }

  // Create a new TransformationIsolate and cache it
  const newIvm = await createNewIvm(code, secrets, eventsMetadata, transformationVersionId, workspaceId, libraryVersionIDs, credentials);
  ivmCache.set(transformationVersionId, newIvm);
  console.log(`Created and cached new TransformationIsolate for transformationVersionId: ${transformationVersionId}`);

  return newIvm;
}

/**
 * Create a new TransformationIsolate instance
 * @param {string} code - The transformation code
 * @param {Object} secrets - The secrets for the transformation
 * @param {Object} eventsMetadata - The events metadata
 * @param {string} transformationId - The transformation ID
 * @param {string} workspaceId - The workspace ID
 * @param {Array} libraryVersionIDs - The library version IDs
 * @param {Object} credentials - The credentials
 * @returns {Promise<TransformationIsolate>} - The new TransformationIsolate instance
 */
async function createNewIvm(
  code,
  secrets = {},
  eventsMetadata = {},
  transformationId = '',
  workspaceId = '',
  libraryVersionIDs = [],
  credentials = {}
) {
  // Create a new TransformationIsolate instance
  const isolate = new TransformationIsolate();
  
  // Build the TransformationIsolate with the provided parameters
  await isolate.Build(
    code,
    secrets,
    eventsMetadata,
    transformationId,
    workspaceId,
    libraryVersionIDs,
    credentials
  );
  
  return isolate;
}

/**
 * Get the current cache statistics
 * @returns {Object} - Cache statistics
 */
function getCacheStats() {
  return {
    size: ivmCache.keys().length,
    maxSize: IVM_CACHE_MAX,
    ttl: IVM_CACHE_SECONDS,
    keys: ivmCache.keys(),
  };
}

/**
 * Clear the IVM cache
 */
async function clearCache() {
  const keys = ivmCache.keys();
  for (const key of keys) {
    const isolateInstance = ivmCache.get(key);
    await releaseIvmResources(isolateInstance);
  }
  ivmCache.flushAll();
  console.log('IVM cache cleared');
}

module.exports = {
  createIvm,
  getCacheStats,
  clearCache,
  SHARE_ISOLATE,
  IVM_CACHE,
};