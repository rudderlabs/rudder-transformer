const fetch = require("node-fetch");
const NodeCache = require("node-cache");

const myCache = new NodeCache({ stdTTL: 5 * 60, checkperiod: 120 });
// TODO: Get config backend url from .env ??
const CONFIG_BACKEND_URL = "https://api.rudderlabs.com";
const getTransformationURL = `${CONFIG_BACKEND_URL}/transformation/getByVersionId`;

// Gets the transformation from config backend.
// Stores the transformation object in memory with time to live after which it expires.
// VersionId is updated any time user changes the code in transformation, so there wont be any stale code issues.
async function getTransformationCode(versionId) {
  // return code;
  const transformation = myCache.get(versionId);
  if (transformation) return transformation;
  try {
    const response = await fetch(
      `${getTransformationURL}?versionId=${versionId}`
    );
    const myJson = await response.json();
    myCache.set(versionId, myJson, 5 * 60);
    return myJson;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

exports.getTransformationCode = getTransformationCode;
