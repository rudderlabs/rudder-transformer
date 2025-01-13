const get = require('get-value');
const moment = require('moment');
const { InstrumentationError } = require('@rudderstack/integrations-lib');
const {
  SEVERITIES,
  EVENT_ACTIONS,
  MAPPING_CONFIG,
  DEFAULT_SEVERITY,
  CONFIG_CATEGORIES,
  DEFAULT_EVENT_ACTION,
} = require('./config');
const { constructPayload, getIntegrationsObj } = require('../../util');

/**
 * Validates the timestamp
 * @param {*} payload
 * @returns
 */
const validateTimeStamp = (payload) => {
  if (payload.payload?.timestamp) {
    const start = moment.unix(moment(payload.payload.timestamp).format('X'));
    const current = moment.unix(moment().format('X'));
    // calculates past event in hours
    const deltaDay = Math.ceil(moment.duration(current.diff(start)).asHours());
    if (deltaDay > 90) {
      throw new InstrumentationError('Events must be sent within ninety days of their occurrence');
    }
  }
};

/**
 * Returns the valid links array
 * @param {*} links
 * @returns
 */
const getValidLinks = (links) => {
  if (typeof links === 'string') {
    return [{ href: links }];
  }
  // Removing the objects where href key is not present
  return links.filter((link) => link.href);
};

/**
 * Returns the valid images array
 * @param {*} images
 * @returns
 */
const getValidImages = (images) => {
  if (typeof images === 'string') {
    return [{ src: images }];
  }
  // Removing the objects where src key is not present
  return images.filter((image) => image.src);
};

/**
 * Returns the valid severity value
 * @param {*} payload
 * @returns
 */
const getValidSeverity = (payload) => {
  if (payload.payload?.severity && SEVERITIES.includes(payload.payload.severity)) {
    return payload.payload.severity;
  }
  // If severity is not found in payload then fallback to default value which is "critical"
  return DEFAULT_SEVERITY;
};

/**
 * Returns the valid eventAction value
 * @param {*} message
 * @returns
 */
const getValidEventAction = (message) => {
  const eventAction = get(message.properties, 'action');
  if (eventAction && EVENT_ACTIONS.includes(eventAction)) {
    return eventAction;
  }
  // If action is not found in payload then fallback to default value which is "trigger"
  return DEFAULT_EVENT_ACTION;
};

/**
 * Returns the alert event payload
 * Ref: https://developer.pagerduty.com/docs/ZG9jOjExMDI5NTgx-send-an-alert-event
 * @param {*} message
 * @param {*} Config
 * @returns
 */
const prepareAlertEventPayload = (message, Config) => {
  const eventAction = getValidEventAction(message);

  let dedupKey;
  if (Config.dedupKeyFieldIdentifier) {
    dedupKey = get(message, Config.dedupKeyFieldIdentifier);
  }

  if (eventAction === 'acknowledge' || eventAction === 'resolve') {
    // dedup_key is required if you want to acknowledge or resolve an incident
    if (!dedupKey) {
      throw new InstrumentationError(`dedup_key required for ${eventAction} events`);
    }

    return {
      dedup_key: dedupKey,
      event_action: eventAction,
    };
  }

  const payload = constructPayload(message, MAPPING_CONFIG[CONFIG_CATEGORIES.ALERT_EVENT.name]);

  // If dedup_key is not found when incident is triggered then fallback to messageId
  payload.dedup_key = dedupKey || message.messageId;
  payload.event_action = eventAction;
  payload.payload.severity = getValidSeverity(payload);

  return payload;
};

/**
 * Returns the track call payload
 * @param {*} message
 * @param {*} Config
 * @returns
 */
const trackEventPayloadBuilder = (message, Config) => {
  const integrationsObj = getIntegrationsObj(message, 'pagerduty');

  let payload;
  let endpoint;

  if (integrationsObj && integrationsObj.type && integrationsObj.type === 'changeEvent') {
    payload = constructPayload(message, MAPPING_CONFIG[CONFIG_CATEGORIES.CHANGE_EVENT.name]);
    endpoint = CONFIG_CATEGORIES.CHANGE_EVENT.endpoint;
  } else {
    payload = prepareAlertEventPayload(message, Config);
    endpoint = CONFIG_CATEGORIES.ALERT_EVENT.endpoint;
  }

  validateTimeStamp(payload);
  if (payload.links) {
    payload.links = getValidLinks(payload.links);
  }
  if (payload.images) {
    payload.images = getValidImages(payload.images);
  }
  const { routingKey } = Config;
  payload.routing_key = routingKey;
  return { payload, endpoint };
};

module.exports = {
  trackEventPayloadBuilder,
};
