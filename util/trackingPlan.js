const NodeCache = require("node-cache");
const { fetchWithProxy } = require("./fetch");
const logger = require("../logger");
const stats = require("./stats");

const myCache = new NodeCache();

const CONFIG_BACKEND_URL =
  process.env.CONFIG_BACKEND_URL || "https://api.rudderlabs.com";
const getTransformationURL = `${CONFIG_BACKEND_URL}/trackingplan/getByTpId`;

// Gets the trackingplan from config backend.
// Stores the trackingplan object in memory with time to live after which it expires.
// tpId is updated any time user changes the code in transformation, so there wont be any stale code issues.
async function getTrackingPlan(tpId) {
  const trackingPlan = myCache.get(tpId);
  if (trackingPlan) return trackingPlan;
  try {
    const startTime = new Date();
    const response = await fetchWithProxy(
      `${getTransformationURL}?tpId=${tpId}`
    );
    stats.increment("get_trackingplan.success");
    stats.timing("get_trackingplan", startTime);
    const myJson = await response.json();
    myCache.set(tpId, myJson);
    return myJson;
  } catch (error) {
    logger.error(error);
    stats.increment("get_trackingplan.error");
    throw error;
  }
}

exports.getTrackingPlan = getTrackingPlan;
