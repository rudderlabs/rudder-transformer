const { fetchWithProxy } = require('./fetch');
const logger = require('../logger');
const stats = require('./stats');
const { responseStatusHandler } = require('./utils');

const transformationCache = {};
const libraryCache = {};

// const CONFIG_BACKEND_URL = "http://localhost:5000";
const CONFIG_BACKEND_URL = process.env.CONFIG_BACKEND_URL || 'https://api.rudderlabs.com';
const getTransformationURL = `${CONFIG_BACKEND_URL}/transformation/getByVersionId`;
const getLibrariesUrl = `${CONFIG_BACKEND_URL}/transformationLibrary/getByVersionId`;

// Gets the transformation from config backend.
// Stores the transformation object in memory with time to live after which it expires.
// VersionId is updated any time user changes the code in transformation, so there wont be any stale code issues.
async function getTransformationCodeV1(versionId) {
  const transformation = transformationCache[versionId];
  if (transformation) return transformation;
  const tags = {
    transformerVersionId: versionId,
    version: 1,
  };
  try {
    const url = `${getTransformationURL}?versionId=${versionId}`;
    const startTime = new Date();
    const response = await fetchWithProxy(url);

    responseStatusHandler(response.status, 'Transformation', versionId, url);
    stats.increment('get_transformation_code.success', tags);
    stats.timing('get_transformation_code', startTime, tags);
    const myJson = await response.json();
    transformationCache[versionId] = myJson;
    return myJson;
  } catch (error) {
    logger.error(error);
    stats.increment('get_transformation_code.error', tags);
    throw error;
  }
}

async function getLibraryCodeV1(versionId) {
  const library = libraryCache[versionId];
  if (library) return library;
  const tags = {
    libraryVersionId: versionId,
    version: 1,
  };
  try {
    const url = `${getLibrariesUrl}?versionId=${versionId}`;
    const startTime = new Date();
    const response = await fetchWithProxy(url);

    responseStatusHandler(response.status, 'Transformation Library', versionId, url);
    stats.increment('get_libraries_code.success', tags);
    stats.timing('get_libraries_code', startTime, tags);
    const myJson = await response.json();
    libraryCache[versionId] = myJson;
    return myJson;
  } catch (error) {
    logger.error(error);
    stats.increment('get_libraries_code.error', tags);
    throw error;
  }
}

module.exports = { getTransformationCodeV1, getLibraryCodeV1 };
