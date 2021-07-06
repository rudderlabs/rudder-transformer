const NodeCache = require("node-cache");
const { fetchWithProxy } = require("./fetch");
const logger = require("../logger");
const stats = require("./stats");

const myCache = new NodeCache();

const CONFIG_BACKEND_URL = "http://localhost:5000";
  // todo : uncomment
  // process.env.CONFIG_BACKEND_URL || "https://api.rudderlabs.com";
const getTrackingPlanURL = `${CONFIG_BACKEND_URL}/workspaces`;
// /trackingplan/getByTpId;

// workspaceID from token? any other way?
// pass it from metadata
const workspaceId = "1usxkCLnYPUn66quZqcx6FIy0Rw";

// Gets the trackingplan from config backend.
// Stores the trackingplan object in memory with time to live after which it expires.
// tpId is updated any time user changes the code in transformation, so there wont be any stale code issues.
async function getTrackingPlan(tpId, version) {
  const trackingPlan = myCache.get(`${tpId}::${version}`);
  if (trackingPlan) return trackingPlan;
  try {
    const startTime = new Date();
    const response = await fetchWithProxy(
      `${getTrackingPlanURL}/${workspaceId}/tracking-plans/${tpId}`
      // ?tpId=${tpId}
    );
    stats.timing("get_trackingplan", startTime);
    const myJson = await response.json();
    myCache.set(tpId+"::"+version, myJson);
    return myJson;
  } catch (error) {
    logger.error("Failed during trackingPlan fetch" + error);
    stats.increment("get_trackingplan.error");
    throw error;
  }
}

async function getEventSchema(tpId, tpVersion, eventType, eventName) {
  var eventSchema;
  try {
    const tp = await getTrackingPlan(tpId, tpVersion);

    if (eventType !== "track") {
      if (Object.prototype.hasOwnProperty.call(tp.rules, eventType)) {
        eventSchema = tp.rules[eventType];
      }
    } else if (Object.prototype.hasOwnProperty.call(tp.rules, "events")) {
      const { events } = tp.rules;
      for (var i = 0; i < events.length; i++) {
        // TODO: is name unique in track rules? Is it checked any where? - Will be
        if (events[i].name === eventName) {
          eventSchema = events[i].rules;
        }
      }
    }
    if (!eventSchema) {
      logger.info(
        `no schema for eventName : ${eventName}, eventType : ${eventType} in trackingPlanID : ${tpId}`
      );
      eventSchema = {};
    }
    return eventSchema;
  } catch (error) {
    logger.error("Failed during eventSchema fetch" + error);
    stats.increment("get_eventSchema.error");
    throw error;
  }
}

async function getTrackingPlanBySourceID(sourceId) {
  return "";
}

exports.getTrackingPlan = getTrackingPlan;
exports.getEventSchema = getEventSchema;
