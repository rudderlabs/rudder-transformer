const { InstrumentationError } = require('@rudderstack/integrations-lib');
const { EVENT_TYPES, IMPRESSIONS_CONFIG, CLICKS_CONFIG, CONVERSIONS_CONFIG } = require('./config');
const {
  constructPayload,
  defaultRequestConfig,
  toUnixTimestamp,
  stripTrailingSlash,
} = require('../../../../v0/util');

const validateBidders = (bidders) => {
  if (!Array.isArray(bidders)) {
    throw new InstrumentationError('properties.bidders should be an array of objects. Aborting.');
  }
  if (bidders.length === 0) {
    throw new InstrumentationError(
      'properties.bidders should contains at least one bidder. Aborting.',
    );
  }
  bidders.forEach((bidder) => {
    if (!(bidder.bidder || bidder.alternate_bidder)) {
      throw new InstrumentationError('bidder or alternate_bidder is not present. Aborting.');
    }
    if (!bidder.count) {
      throw new InstrumentationError('count is not present. Aborting.');
    }
    if (!bidder.base_price) {
      throw new InstrumentationError('base_price is not present. Aborting.');
    }
  });
};

/**
 * This function constructs payloads based upon mappingConfig for all calls.
 * @param {*} eventType
 * @param {*} message
 * @param {*} Config
 * @returns
 */
const constructFullPayload = (eventType, message, Config) => {
  let payload;
  switch (eventType) {
    case EVENT_TYPES.IMPRESSIONS:
      payload = constructPayload(message, IMPRESSIONS_CONFIG);
      payload.clientName = Config.clientName;
      break;
    case EVENT_TYPES.CLICKS:
      payload = constructPayload(message, CLICKS_CONFIG);
      payload.clientName = Config.clientName;
      if (!Config.testVersionOverride) {
        payload.testVersionOverride = null;
      }
      if (!Config.overrides) {
        payload.overrides = null;
      }
      break;
    case EVENT_TYPES.CONVERSIONS:
      payload = constructPayload(message, CONVERSIONS_CONFIG);
      payload.client_name = Config.clientName;
      payload.unixtime = toUnixTimestamp(payload.unixtime);
      validateBidders(payload.bidders);
      break;
    default:
      throw new InstrumentationError(`event type ${eventType} is not supported.`);
  }
  return payload;
};

const getEndpoint = (eventType, Config) => {
  let endpoint = stripTrailingSlash(Config.apiBaseUrl);
  switch (eventType) {
    case EVENT_TYPES.IMPRESSIONS:
      endpoint += '?action=impression';
      break;
    case EVENT_TYPES.CLICKS:
      endpoint += '?action=click';
      break;
    case EVENT_TYPES.CONVERSIONS:
      endpoint += '/conversion';
      break;
    default:
      throw new InstrumentationError(`event type ${eventType} is not supported.`);
  }
  return endpoint;
};

/**
 * This function constructs response based upon event.
 * @param {*} eventType
 * @param {*} Config
 * @param {*} payload
 * @returns
 */
const constructResponse = (eventType, Config, payload) => {
  if (!Object.values(EVENT_TYPES).includes(eventType)) {
    throw new InstrumentationError(`event type ${eventType} is not supported.`);
  }
  const response = defaultRequestConfig();
  response.endpoint = getEndpoint(eventType, Config);
  response.headers = {
    accept: 'application/json',
  };
  if (eventType === EVENT_TYPES.CONVERSIONS) {
    response.body.JSON = payload;
    response.method = 'POST';
    response.headers = {
      ...response.headers,
      'content-type': 'application/json',
    };
  } else {
    response.params = payload;
    response.method = 'GET';
  }
  return response;
};

module.exports = { getEndpoint, validateBidders, constructFullPayload, constructResponse };
