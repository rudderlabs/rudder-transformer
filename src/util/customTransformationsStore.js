const NodeCache = require('node-cache');
const { fetchWithProxy } = require('./fetch');
const logger = require('../logger');
const { responseStatusHandler } = require('./utils');
const { CONFIG_BACKEND_URL, configBackendRequestOptions } = require('./configBackend');

const DEFAULT_CACHE_TTL_SECONDS = 60 * 60 * 24 * 1;
// Set to 0 to disable expiry entirely.
const CACHE_TTL_SECONDS = DEFAULT_CACHE_TTL_SECONDS;

// A cache per entity rather than one shared instance: transformations and libraries are both
// keyed by versionId, so a single cache would let them collide.
// Every key is an immutable version identifier, so entries can never go stale -- a new version is
// a new key. The TTL is there to release memory, not to refresh content.
const transformationCache = new NodeCache({ stdTTL: CACHE_TTL_SECONDS });
const libraryCache = new NodeCache({ stdTTL: CACHE_TTL_SECONDS });
const rudderLibraryCache = new NodeCache({ stdTTL: CACHE_TTL_SECONDS });

const getTransformationURL = `${CONFIG_BACKEND_URL}/transformation/getByVersionId`;
const getLibrariesUrl = `${CONFIG_BACKEND_URL}/transformationLibrary/getByVersionId`;
const getRudderLibrariesUrl = `${CONFIG_BACKEND_URL}/rudderstackTransformationLibraries`;

// Gets the transformation from config backend.
// Stores the transformation object in memory with time to live after which it expires.
// VersionId is updated any time user changes the code in transformation, so there wont be any stale code issues.
async function getTransformationCode(versionId) {
  const transformation = transformationCache.get(versionId);
  if (transformation) return transformation;
  try {
    const url = `${getTransformationURL}?versionId=${versionId}`;
    const response = await fetchWithProxy(url, configBackendRequestOptions());

    responseStatusHandler(response.status, 'Transformation', versionId, url);
    const myJson = await response.json();
    transformationCache.set(versionId, myJson);
    return myJson;
  } catch (error) {
    logger.error(`Error fetching transformation code for versionId: ${versionId}`, error.message);
    throw error;
  }
}

async function getLibraryCode(versionId) {
  const library = libraryCache.get(versionId);
  if (library) return library;
  try {
    const url = `${getLibrariesUrl}?versionId=${versionId}`;
    const response = await fetchWithProxy(url, configBackendRequestOptions());

    responseStatusHandler(response.status, 'Transformation Library', versionId, url);
    const myJson = await response.json();
    libraryCache.set(versionId, myJson);
    return myJson;
  } catch (error) {
    logger.error(`Error fetching library code for versionId: ${versionId}`, error.message);
    throw error;
  }
}

async function getRudderLibByImportName(importName) {
  const rudderLibrary = rudderLibraryCache.get(importName);
  if (rudderLibrary) return rudderLibrary;
  try {
    const [name, version] = importName.split('/').slice(-2);
    const url = `${getRudderLibrariesUrl}/${name}?version=${version}`;
    const response = await fetchWithProxy(url, configBackendRequestOptions());

    responseStatusHandler(response.status, 'Rudder Library', importName, url);
    const myJson = await response.json();
    rudderLibraryCache.set(importName, myJson);
    return myJson;
  } catch (error) {
    logger.error(`Error fetching rudder library code for importName: ${importName}`, error.message);
    throw error;
  }
}

exports.getTransformationCode = getTransformationCode;
exports.getLibraryCode = getLibraryCode;
exports.getRudderLibByImportName = getRudderLibByImportName;
exports.CONFIG_BACKEND_URL = CONFIG_BACKEND_URL;
