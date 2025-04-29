const get = require('get-value');
const sha256 = require('sha256');
const { InstrumentationError, ConfigurationError } = require('@rudderstack/integrations-lib');
const moment = require('moment/moment');
const logger = require('../../../logger');

const {
  isDefinedAndNotNull,
  getFieldValueFromMessage,
  defaultBatchRequestConfig,
  getValidDynamicFormConfig,
} = require('../../util');
const { JSON_MIME_TYPE } = require('../../util/constant');
const { ENDPOINT } = require('./config');

const channelMapping = {
  web: 'WEB',
  mobile: 'MOBILE_APP',
  mobile_app: 'MOBILE_APP',
  offline: 'OFFLINE',
};

function msUnixTimestamp(timestamp) {
  const time = new Date(timestamp);
  return time.getTime() * 1000 + time.getMilliseconds();
}

function getHashedValue(identifier) {
  if (identifier) {
    const regexExp = /^[\da-f]{64}$/gi;
    if (!regexExp.test(identifier)) {
      return sha256(identifier);
    }
    return identifier;
  }
  return null;
}

function getNormalizedPhoneNumber(message) {
  const regexExp = /^[\da-f]{64}$/i;
  const phoneNumber = getFieldValueFromMessage(message, 'phone');

  if (!phoneNumber) return null;
  if (regexExp.test(phoneNumber)) return phoneNumber;

  // Remove leading zeros and non-numeric characters
  return String(phoneNumber).replace(/\D/g, '').replace(/^0+/, '') || null;
}

function getDataUseValue(message) {
  const att = get(message, 'context.device.attTrackingStatus');
  let limitAdTracking;
  if (isDefinedAndNotNull(att)) {
    if (att === 3) {
      limitAdTracking = false;
    } else if (att === 2) {
      limitAdTracking = true;
    }
  }
  if (limitAdTracking) {
    limitAdTracking = "['lmu']";
    return limitAdTracking;
  }
  return null;
}

function getItemIds(message) {
  let itemIds = [];
  const products = get(message, 'properties.products');
  if (products && Array.isArray(products)) {
    products.forEach((element, index) => {
      const pId = element.product_id;
      if (pId) {
        itemIds.push(pId);
      } else {
        logger.debug(`product_id not present for product at index ${index}`);
      }
    });
  } else {
    itemIds = null;
  }
  return itemIds;
}
function getPriceSum(message) {
  let priceSum = 0;
  const products = get(message, 'properties.products');
  if (products && Array.isArray(products)) {
    products.forEach((element) => {
      const { price } = element;
      const { quantity = 1 } = element;
      if (price && !Number.isNaN(parseFloat(price)) && !Number.isNaN(parseInt(quantity, 10))) {
        priceSum += parseFloat(price) * parseInt(quantity, 10);
      }
    });
  } else {
    priceSum = null;
  }
  return String(priceSum);
}

/**
 * Create Snapchat Batch payload based on the passed events
 * @param {*} events
 * @returns
 */
function generateBatchedPayloadForArray(events, destination) {
  const batchResponseList = [];

  // extracting destination
  // from the first event in a batch
  const { apiKey } = destination.Config;

  const { batchedRequest } = defaultBatchRequestConfig();

  // Batch event into dest batch structure
  events.forEach((ev) => {
    batchResponseList.push(ev.body.JSON);
  });

  batchedRequest.body.JSON_ARRAY = {
    batch: JSON.stringify(batchResponseList),
  };

  batchedRequest.endpoint = ENDPOINT.Endpoint_v2;
  batchedRequest.headers = {
    'Content-Type': JSON_MIME_TYPE,
    Authorization: `Bearer ${apiKey}`,
  };

  return batchedRequest;
}

// Checks if there are any mapping events for the track event and returns them
const eventMappingHandler = (message, destination) => {
  let event = get(message, 'event');

  if (!event) {
    throw new InstrumentationError('Event name is required');
  }
  event = event.toString().trim().replace(/\s+/g, '_');

  let { rudderEventsToSnapEvents } = destination.Config;
  const mappedEvents = new Set();

  if (Array.isArray(rudderEventsToSnapEvents)) {
    rudderEventsToSnapEvents = getValidDynamicFormConfig(
      rudderEventsToSnapEvents,
      'from',
      'to',
      'snapchat_conversion',
      destination.ID,
    );
    rudderEventsToSnapEvents.forEach((mapping) => {
      if (mapping.from.trim().replace(/\s+/g, '_').toLowerCase() === event.toLowerCase()) {
        mappedEvents.add(mapping.to);
      }
    });
  }

  return [...mappedEvents];
};

const getEventConversionType = (message) => {
  const channel = get(message, 'channel');
  let eventConversionType = message?.properties?.eventConversionType;
  if (
    channelMapping[eventConversionType?.toLowerCase()] ||
    channelMapping[channel?.toLowerCase()]
  ) {
    eventConversionType = eventConversionType
      ? channelMapping[eventConversionType?.toLowerCase()]
      : channelMapping[channel?.toLowerCase()];
  } else {
    eventConversionType = 'OFFLINE';
  }
  return eventConversionType;
};

const validateEventConfiguration = (eventConversionType, pixelId, snapAppId, appId) => {
  if ((eventConversionType === 'WEB' || eventConversionType === 'OFFLINE') && !pixelId) {
    throw new ConfigurationError('Pixel Id is required for web and offline events');
  }

  if (eventConversionType === 'MOBILE_APP' && !(appId && snapAppId)) {
    let requiredId = 'App Id';
    if (!snapAppId) {
      requiredId = 'Snap App Id';
    }
    throw new ConfigurationError(`${requiredId} is required for app events`);
  }
};

const getEventTimestamp = (message, requiredDays = 37) => {
  const eventTime = getFieldValueFromMessage(message, 'timestamp');
  if (eventTime) {
    const start = moment.unix(moment(eventTime).format('X'));
    const current = moment.unix(moment().format('X'));
    // calculates past event in days
    const deltaDay = Math.ceil(moment.duration(current.diff(start)).asDays());
    if (deltaDay > requiredDays) {
      throw new InstrumentationError(
        `Events must be sent within ${requiredDays} days of their occurrence`,
      );
    }
    return msUnixTimestamp(eventTime)?.toString()?.slice(0, 10);
  }
  return eventTime;
};

module.exports = {
  msUnixTimestamp,
  getItemIds,
  getPriceSum,
  getDataUseValue,
  getNormalizedPhoneNumber,
  getHashedValue,
  generateBatchedPayloadForArray,
  eventMappingHandler,
  getEventConversionType,
  validateEventConfiguration,
  channelMapping,
  getEventTimestamp,
};
