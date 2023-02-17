const NodeCache = require('node-cache');
const { fetchWithProxy } = require('./fetch');
const logger = require('../logger');
const stats = require('./stats');
const { responseStatusHandler } = require('./utils');

const tpCache = new NodeCache();
const CONFIG_BACKEND_URL = process.env.CONFIG_BACKEND_URL || 'https://api.rudderlabs.com';
const TRACKING_PLAN_URL = `${CONFIG_BACKEND_URL}/workspaces`;

/**
 * @param {*} tpId
 * @param {*} version
 * @param {*} workspaceId
 * @returns {Object}
 *
 * Gets the tracking plan from config backend.
 * Stores the tracking plan object in memory with time to live after which it expires.
 * tpId is updated any time user changes the code in transformation, so there wont be any stale code issues.
 * TODO: if version is not given, latest TP may be fetched, extract version and populate node cache
 */
async function getTrackingPlan(tpId, version, workspaceId) {
  const trackingPlan = tpCache.get(`${tpId}::${version}`);
  if (trackingPlan) return trackingPlan;
  try {
    const url = `${TRACKING_PLAN_URL}/${workspaceId}/tracking-plans/${tpId}?version=${version}`;
    const startTime = new Date();
    const response = await fetchWithProxy(url);

    responseStatusHandler(response.status, 'Tracking plan', tpId, url);
    stats.timing('get_tracking_plan', startTime);
    const myJson = await response.json();
    tpCache.set(`${tpId}::${version}`, myJson);
    return myJson;
  } catch (error) {
    logger.error(`Failed during trackingPlan fetch : ${error}`);
    stats.increment('get_tracking_plan.error');
    throw error;
  }
}

/**
 * @param {*} tpId
 * @param {*} tpVersion
 * @param {*} eventType
 * @param {*} eventName
 * @param {*} workspaceId
 * @returns {Object}
 *
 * Gets the event schema.
 */
async function getEventSchema(tpId, tpVersion, eventType, eventName, workspaceId) {
  try {
    let eventSchema;
    const tp = await getTrackingPlan(tpId, tpVersion, workspaceId);

    if (eventType !== 'track') {
      if (Object.prototype.hasOwnProperty.call(tp.rules, eventType)) {
        eventSchema = tp.rules[eventType];
      }
    } else if (Object.prototype.hasOwnProperty.call(tp.rules, 'events')) {
      const { events } = tp.rules;
      for (const event of events) {
        // eventName will be unique
        if (event.name === eventName) {
          eventSchema = event.rules;
          break;
        }
      }
    }
    return eventSchema;
  } catch (error) {
    logger.info(`Failed during eventSchema fetch : ${JSON.stringify(error)}`);
    stats.increment('get_eventSchema.error');
    throw error;
  }
}

module.exports = {
  getEventSchema,
  getTrackingPlan,
};
