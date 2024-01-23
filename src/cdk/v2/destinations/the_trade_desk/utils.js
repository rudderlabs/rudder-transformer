const get = require('get-value');
const CryptoJS = require('crypto-js');
const { InstrumentationError, AbortedError } = require('@rudderstack/integrations-lib');
const {
  constructPayload,
  getHashFromArray,
  isDefinedAndNotNull,
  isAppleFamily,
  getIntegrationsObj,
} = require('../../../../v0/util');
const {
  DATA_SERVERS_BASE_ENDPOINTS_MAP,
  CONVERSION_SUPPORTED_ID_TYPES,
  COMMON_CONFIGS,
  ITEM_CONFIGS,
  ECOMM_EVENT_MAP,
  REVENUE_SUPPORTED_ECOMM_EVENTS,
  PRICE_SUPPORTED_ECOMM_EVENTS,
} = require('./config');

const getTTLInMin = (ttl) => parseInt(ttl, 10) * 1440;
const getBaseEndpoint = (dataServer) => DATA_SERVERS_BASE_ENDPOINTS_MAP[dataServer];
const getFirstPartyEndpoint = (dataServer) => `${getBaseEndpoint(dataServer)}/data/advertiser`;
const prepareCommonPayload = (message) => constructPayload(message, COMMON_CONFIGS);

const getSignatureHeader = (request, secretKey) => {
  if (!secretKey) {
    throw new AbortedError('Secret key is missing. Aborting');
  }
  const sha1 = CryptoJS.HmacSHA1(JSON.stringify(request), secretKey);
  const base = CryptoJS.enc.Base64.stringify(sha1);
  return base;
};

const prepareFromConfig = (destination) => ({
  tracker_id: destination.Config?.trackerId,
  adv: destination.Config?.advertiserId,
});

const getRevenue = (message) => {
  const { event, properties } = message;
  let revenue = properties?.value;
  if (PRICE_SUPPORTED_ECOMM_EVENTS.includes(event)) {
    const { price, quantity = 1 } = properties;
    if (price && !Number.isNaN(parseFloat(price)) && !Number.isNaN(parseInt(quantity, 10))) {
      revenue = parseFloat(price) * parseInt(quantity, 10);
    }
  } else if (REVENUE_SUPPORTED_ECOMM_EVENTS.includes(event)) {
    revenue = properties?.revenue || revenue;
    if (event === 'Order Completed' && !revenue) {
      throw new InstrumentationError('value is required for `Order Completed` event');
    }
  }

  return revenue;
};

const prepareItemsPayload = (message) => {
  const productPropertiesArray = Array.isArray(message.properties?.products)
    ? message.properties.products
    : [message.properties];
  return productPropertiesArray.map((product) => constructPayload(product, ITEM_CONFIGS));
};

const getDeviceAdvertisingId = (message) => {
  const { context } = message;
  const deviceId = context?.device?.advertisingId;
  const osName = context?.os?.name?.toLowerCase();

  let type;
  switch (osName) {
    case 'android':
      type = 'AAID';
      break;
    case 'windows':
      type = 'NAID';
      break;
    default:
      type = isAppleFamily(osName) ? 'IDFA' : undefined;
      break;
  }

  return { deviceId, type };
};

const getDestinationExternalIDObject = (message) => {
  const { context } = message;
  const externalIdArray = context?.externalId || [];

  let externalIdObj;

  if (Array.isArray(externalIdArray)) {
    externalIdObj = externalIdArray.find(
      (extIdObj) =>
        CONVERSION_SUPPORTED_ID_TYPES.includes(extIdObj?.type?.toUpperCase()) && extIdObj?.id,
    );
  }
  return externalIdObj;
};

const getAdvertisingId = (message) => {
  const { deviceId, type } = getDeviceAdvertisingId(message);
  if (deviceId && type) {
    return { id: deviceId, type };
  }
  const externalIdObj = getDestinationExternalIDObject(message);
  return { id: externalIdObj?.id, type: externalIdObj?.type };
};

const prepareCustomProperties = (message, destination) => {
  const { customProperties } = destination.Config;
  const payload = {};
  if (customProperties) {
    customProperties.forEach((customProperty) => {
      const { rudderProperty, tradeDeskProperty } = customProperty;
      const value = get(message, rudderProperty);
      if (value) {
        payload[tradeDeskProperty] = value;
      }
    });
  }
  return payload;
};

const populateEventName = (message, destination) => {
  let eventName;
  const { event } = message;
  const { eventsMapping } = destination.Config;

  if (eventsMapping.length > 0) {
    const keyMap = getHashFromArray(eventsMapping, 'from', 'to');
    eventName = keyMap[event.toLowerCase()];
  }

  if (eventName) {
    return eventName;
  }

  const eventMapInfo = ECOMM_EVENT_MAP.find((eventMap) => {
    if (eventMap.src.toLowerCase() === event.toLowerCase()) {
      return eventMap;
    }
    return false;
  });

  if (isDefinedAndNotNull(eventMapInfo)) {
    return eventMapInfo.dest;
  }

  return event;
};

/**
 * Retrieves the data processing options based on the provided message.
 *
 * @param {string} message - The message to process.
 * @throws {InstrumentationError} - Throws an error if the region is not supported, if no policies are provided, if multiple policies are provided, or if the policy is not supported.
 * @returns {Object} - The data processing options, including the policies and region.
 */
const getDataProcessingOptions = (message) => {
  const integrationObj = getIntegrationsObj(message, 'THE_TRADE_DESK') || {};
  let { policies } = integrationObj;
  const { region } = integrationObj;

  if (region && !region.toLowerCase().startsWith('us')) {
    throw new InstrumentationError('Only US states are supported');
  }

  if (!policies || (Array.isArray(policies) && policies.length === 0)) {
    policies = ['LDU'];
  }

  if (policies.length > 1) {
    throw new InstrumentationError('Only one policy is allowed');
  }

  if (policies[0] !== 'LDU') {
    throw new InstrumentationError('Only LDU policy is supported');
  }

  return { policies, region };
};

const getPrivacySetting = (message) => {
  const integrationObj = getIntegrationsObj(message, 'THE_TRADE_DESK');
  return integrationObj?.privacy_settings;
};

module.exports = {
  getTTLInMin,
  getFirstPartyEndpoint,
  getSignatureHeader,
  prepareFromConfig,
  getRevenue,
  prepareCommonPayload,
  prepareItemsPayload,
  getDeviceAdvertisingId,
  getDestinationExternalIDObject,
  getAdvertisingId,
  prepareCustomProperties,
  populateEventName,
  getDataProcessingOptions,
  getPrivacySetting,
};
