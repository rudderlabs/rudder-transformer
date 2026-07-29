const { fetchWithProxy } = require('./fetch');
const logger = require('../logger');
const { responseStatusHandler } = require('./utils');
const stats = require('./stats');
const { CONFIG_BACKEND_URL, configBackendRequestOptions } = require('./configBackend');

const transformationCache = {};
const libraryCache = {};
const rudderLibraryCache = {};

const getTransformationURL = `${CONFIG_BACKEND_URL}/transformation/getByVersionId`;
const getLibrariesUrl = `${CONFIG_BACKEND_URL}/transformationLibrary/getByVersionId`;
const getRudderLibrariesUrl = `${CONFIG_BACKEND_URL}/rudderstackTransformationLibraries`;

// Gets the transformation from config backend.
// Stores the transformation object in memory with time to live after which it expires.
// VersionId is updated any time user changes the code in transformation, so there wont be any stale code issues.
async function getTransformationCodeV1(versionId) {
  const transformation = transformationCache[versionId];
  if (transformation) return transformation;
  try {
    const url = `${getTransformationURL}?versionId=${versionId}`;
    const response = await fetchWithProxy(url, configBackendRequestOptions());

    responseStatusHandler(response.status, 'Transformation', versionId, url);
    const myJson = await response.json();
    transformationCache[versionId] = myJson;
    return myJson;
  } catch (error) {
    logger.error(
      `Error fetching transformation V1 code for versionId: ${versionId}`,
      error.message,
    );
    throw error;
  }
}

async function getLibraryCodeV1(versionId) {
  const library = libraryCache[versionId];
  if (library) return library;
  try {
    const url = `${getLibrariesUrl}?versionId=${versionId}`;
    const response = await fetchWithProxy(url, configBackendRequestOptions());

    responseStatusHandler(response.status, 'Transformation Library', versionId, url);
    const myJson = await response.json();
    libraryCache[versionId] = myJson;
    return myJson;
  } catch (error) {
    logger.error(`Error fetching library code for versionId: ${versionId}`, error.message);
    throw error;
  }
}

async function getRudderLibByImportName(importName) {
  const rudderLibrary = rudderLibraryCache[importName];
  if (rudderLibrary) return rudderLibrary;
  try {
    const [name, version] = importName.split('/').slice(-2);
    const url = `${getRudderLibrariesUrl}/${name}?version=${version}`;
    const response = await fetchWithProxy(url, configBackendRequestOptions());

    responseStatusHandler(response.status, 'Rudder Library', importName, url);
    const myJson = await response.json();
    rudderLibraryCache[importName] = myJson;
    return myJson;
  } catch (error) {
    logger.error(`Error fetching rudder library code for importName: ${importName}`, error.message);
    throw error;
  }
}

module.exports = { getTransformationCodeV1, getLibraryCodeV1, getRudderLibByImportName };
