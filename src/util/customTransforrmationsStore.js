const NodeCache = require('node-cache');
const { fetchWithProxy } = require('./fetch');
const logger = require('../logger');
const { responseStatusHandler } = require('./utils');

const myCache = new NodeCache({ stdTTL: 60 * 60 * 24 * 1 });

// const CONFIG_BACKEND_URL = "http://localhost:5000";
const CONFIG_BACKEND_URL = process.env.CONFIG_BACKEND_URL || 'https://api.rudderlabs.com';
const getTransformationURL = `${CONFIG_BACKEND_URL}/transformation/getByVersionId`;

// Gets the transformation from config backend.
// Stores the transformation object in memory with time to live after which it expires.
// VersionId is updated any time user changes the code in transformation, so there wont be any stale code issues.
async function getTransformationCode(versionId) {
  const transformation = myCache.get(versionId);
  if (transformation) return transformation;
  try {
    const url = `${getTransformationURL}?versionId=${versionId}`;
    const response = await fetchWithProxy(url);

    responseStatusHandler(response.status, 'Transformation', versionId, url);
    const myJson = await response.json();
    myCache.set(versionId, myJson);
    return myJson;
  } catch (error) {
    logger.error(`Error fetching transformation code for versionId: ${versionId}`, error.message);
    throw error;
  }
}

exports.getTransformationCode = getTransformationCode;
exports.CONFIG_BACKEND_URL = CONFIG_BACKEND_URL;
