const NodeCache = require("node-cache");
const { fetchWithProxy } = require("./fetch");
const logger = require("../logger");
const stats = require("./stats");

const tpCache = new NodeCache();

// todo : uncomment
const CONFIG_BACKEND_URL = "http://localhost:5000";
// process.env.CONFIG_BACKEND_URL || "https://api.rudderlabs.com";
const getTrackingPlanURL = `${CONFIG_BACKEND_URL}/workspaces`;

// Gets the trackingplan from config backend.
// Stores the trackingplan object in memory with time to live after which it expires.
// tpId is updated any time user changes the code in transformation, so there wont be any stale code issues.
async function getTrackingPlan(tpId, version, workspaceId) {
  // TODO: if version is not given, latest TP may be fetched, extract version and populate node cache
  const trackingPlan = tpCache.get(`${tpId}::${version}`);
  if (trackingPlan) return trackingPlan;
  try {
    const startTime = new Date();
    const response = await fetchWithProxy(
      `${getTrackingPlanURL}/${workspaceId}/tracking-plans/${tpId}?version=${version}`
    );
    stats.timing("get_trackingplan", startTime);
    const myJson = await response.json();
    if(myJson.error || response.status !== 200){
      throw new Error(`${tpId}::${version}  :: ${myJson.error}`);
    }
    tpCache.set(`${tpId}::${version}`, myJson);
    return myJson;
  } catch (error) {
    logger.error(`Failed during trackingPlan fetch : ${error}`);
    stats.increment("get_trackingplan.error");
    throw error.message;
  }
}

async function getEventSchema(tpId, tpVersion, eventType, eventName, workspaceId) {
  var eventSchema;
  try {
    const tp = await getTrackingPlan(tpId, tpVersion, workspaceId);

    if (eventType !== "track") {
      if (Object.prototype.hasOwnProperty.call(tp.rules, eventType)) {
        eventSchema = tp.rules[eventType];
      }
    } else if (Object.prototype.hasOwnProperty.call(tp.rules, "events")) {
      const { events } = tp.rules;
      for (var i = 0; i < events.length; i++) {
        // eventName will be unique
        if (events[i].name === eventName) {
          eventSchema = events[i].rules;
          break;
        }
      }
    }
    // // UnPlanned event case. Violation is raised
    // if (!eventSchema || eventSchema === {}) {
    //   rudderValidationError = {
    //     type: "Unplanned Event",
    //     message: `no schema for eventName : ${eventName}, eventType : ${eventType} in trackingPlanID : ${tpId}::${tpVersion}`,
    //     meta: {}
    //   };
    //   return [null, rudderValidationError];
    // }
    // return [eventSchema, null];
    return eventSchema;
  } catch (error) {
    logger.info(`Failed during eventSchema fetch : ${JSON.stringify(error)}`);
    stats.increment("get_eventSchema.error");
    throw error;
  }
}

exports.getTrackingPlan = getTrackingPlan;
exports.getEventSchema = getEventSchema;
