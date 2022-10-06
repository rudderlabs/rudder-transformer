const NodeCache = require("node-cache");
const { fetchWithProxy } = require("./fetch");
const logger = require("../logger");
const stats = require("./stats");
const { responseStatusHandler } = require("./utils");

const myCache = new NodeCache();

// const CONFIG_BACKEND_URL = "http://localhost:5000";
const CONFIG_BACKEND_URL =
  process.env.CONFIG_BACKEND_URL || "https://api.rudderlabs.com";
const getTransformationURL = `${CONFIG_BACKEND_URL}/transformation/getByVersionId`;

// Gets the transformation from config backend.
// Stores the transformation object in memory with time to live after which it expires.
// VersionId is updated any time user changes the code in transformation, so there wont be any stale code issues.
async function getTransformationCode(versionId) {
  const transformation = myCache.get(versionId);
  if (transformation) return transformation;
  try {
    const url = `${getTransformationURL}?versionId=${versionId}`;
    const startTime = new Date();
    const response = await fetchWithProxy(url);

    responseStatusHandler(response.status, "Transformation", versionId, url);
    stats.increment("get_transformation_code.success");
    stats.timing("get_transformation_code", startTime, { versionId });
    const myJson = await response.json();
    myCache.set(versionId, myJson);
    return myJson;
  } catch (error) {
    logger.error(error);
    stats.increment("get_transformation_code.error", 1, { versionId });
    throw error;
  }
}

exports.getTransformationCode = getTransformationCode;
exports.CONFIG_BACKEND_URL = CONFIG_BACKEND_URL;
