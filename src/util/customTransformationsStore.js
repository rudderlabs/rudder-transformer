const NodeCache = require('node-cache');
const { fetchWithProxy } = require('./fetch');
const logger = require('../logger');
const { responseStatusHandler, parseEnvInt } = require('./utils');
const { CONFIG_BACKEND_URL, configBackendRequestOptions } = require('./configBackend');

const DEFAULT_CACHE_TTL_SECONDS = 60 * 60 * 24 * 1;

// Set to 0 to disable expiry entirely. Anything else must be a plain non-negative integer:
// parseInt stops at the first non-digit, so '1e10' would silently mean a 1 second TTL, and
// NodeCache reads a NaN stdTTL as "never expires" and a negative one as "already expired".
// Those failure modes are invisible at runtime, so reject the value rather than pass it through.
const rawCacheTtlSeconds = process.env.TRANSFORMATION_STORE_CACHE_TTL_SECONDS;
const isCacheTtlValid = !rawCacheTtlSeconds || /^\d+$/.test(rawCacheTtlSeconds.trim());
const CACHE_TTL_SECONDS = isCacheTtlValid
  ? parseEnvInt(rawCacheTtlSeconds, DEFAULT_CACHE_TTL_SECONDS)
  : DEFAULT_CACHE_TTL_SECONDS;

if (!isCacheTtlValid) {
  logger.warn(
    `Ignoring invalid TRANSFORMATION_STORE_CACHE_TTL_SECONDS "${rawCacheTtlSeconds}": expected a non-negative integer`,
  );
}
logger.info(
  `Transformation store cache TTL: ${CACHE_TTL_SECONDS}s${CACHE_TTL_SECONDS === 0 ? ' (no expiry)' : ''}`,
);

// A store per entity rather than one shared instance: transformations and libraries are both
// keyed by versionId, so a single cache would let them collide.
//
// `inFlight` deduplicates concurrent fetches for the same key: without it, every caller that
// misses during the fetch window issues its own request to the config backend.
const createStore = () => ({
  cache: new NodeCache({ stdTTL: CACHE_TTL_SECONDS }),
  inFlight: new Map(),
});

const transformationStore = createStore();
const libraryStore = createStore();
const rudderLibraryStore = createStore();

const TRANSFORMATION_URL = `${CONFIG_BACKEND_URL}/transformation/getByVersionId`;
const TRANSFORMATION_LIBRARY_URL = `${CONFIG_BACKEND_URL}/transformationLibrary/getByVersionId`;
const RUDDER_LIBRARY_URL = `${CONFIG_BACKEND_URL}/rudderstackTransformationLibraries`;

// Returns the cached entry, or fetches and caches it. Failures are never cached, so a transient
// config backend outage does not poison the entry for the rest of the TTL.
async function fetchAndCache(store, { key, url, entity, logContext }) {
  // `has` rather than a truthiness check, so a legitimately falsy cached body is still a hit.
  if (store.cache.has(key)) return store.cache.get(key);

  const pending = store.inFlight.get(key);
  if (pending) return pending;

  const request = (async () => {
    const response = await fetchWithProxy(url, configBackendRequestOptions());

    responseStatusHandler(response.status, entity, key, url);
    const myJson = await response.json();
    store.cache.set(key, myJson);
    return myJson;
  })();
  store.inFlight.set(key, request);

  try {
    return await request;
  } catch (error) {
    logger.error(`Error fetching ${logContext}`, error.message);
    throw error;
  } finally {
    store.inFlight.delete(key);
  }
}

async function getTransformationCode(versionId) {
  return fetchAndCache(transformationStore, {
    key: versionId,
    url: `${TRANSFORMATION_URL}?versionId=${versionId}`,
    entity: 'Transformation',
    logContext: `transformation code for versionId: ${versionId}`,
  });
}

async function getLibraryCode(versionId) {
  return fetchAndCache(libraryStore, {
    key: versionId,
    url: `${TRANSFORMATION_LIBRARY_URL}?versionId=${versionId}`,
    entity: 'Transformation Library',
    logContext: `library code for versionId: ${versionId}`,
  });
}

async function getRudderLibByImportName(importName) {
  const [name, version] = importName.split('/').slice(-2);
  return fetchAndCache(rudderLibraryStore, {
    key: importName,
    url: `${RUDDER_LIBRARY_URL}/${name}?version=${version}`,
    entity: 'Rudder Library',
    logContext: `rudder library code for importName: ${importName}`,
  });
}

exports.getTransformationCode = getTransformationCode;
exports.getLibraryCode = getLibraryCode;
exports.getRudderLibByImportName = getRudderLibByImportName;
exports.CONFIG_BACKEND_URL = CONFIG_BACKEND_URL;
