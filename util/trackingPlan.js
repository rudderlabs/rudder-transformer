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

// TODO: if TP returns all event schemas directly, no api call is needed.
// else another api call to config-be for schema
async function getEventSchema(tpId, eventType, eventName) {
  const trackingPlan = myCache.get(tpId);
  var tp;
  var eventSchema;
  try {
    if (trackingPlan) tp = trackingPlan;
    else tp = getTrackingPlan(tpId);
    eventSchema = tp.rules[eventType][eventName];
    if (!eventSchema) {
      logger.info(`no schema for eventName : ${eventName} in trackingPlanID : ${tpId}`);
      eventSchema = {};
    }
    return eventSchema;
  } catch (error) {
    logger.error(error);
    stats.increment("get_trackingplan.error");
    throw error;
  }
}

async function getTrackingPlanBySourceID(sourceId) {
  return "";
}

exports.getTrackingPlan = getTrackingPlan;
exports.getEventSchema = getEventSchema;

