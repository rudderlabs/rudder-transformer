const lodash = require('lodash');
const get = require('get-value');
const CryptoJS = require('crypto-js');
const { InstrumentationError, AbortedError } = require('@rudderstack/integrations-lib');
const {
  constructPayload,
  getHashFromArray,
  isDefinedAndNotNull,
  isAppleFamily,
  getIntegrationsObj,
  extractCustomFields,
  generateExclusionList,
} = require('../../../../v0/util');
const {
  DATA_SERVERS_BASE_ENDPOINTS_MAP,
  CONVERSION_SUPPORTED_ID_TYPES,
  COMMON_CONFIGS,
  ITEM_CONFIGS,
  ECOMM_EVENT_MAP,
} = require('./config');

const getTTLInMin = (ttl) => parseInt(ttl, 10) * 1440;
const getBaseEndpoint = (dataServer) => DATA_SERVERS_BASE_ENDPOINTS_MAP[dataServer];
const getFirstPartyEndpoint = (dataServer) => `${getBaseEndpoint(dataServer)}/data/advertiser`;
const prepareCommonPayload = (message) => constructPayload(message, COMMON_CONFIGS);

/**
 * Generates a signature header for a given request using a secret key.
 *
 * @param {Object} request - The request object to generate the signature for.
 * @param {string} secretKey - The secret key used to generate the signature.
 * @returns {string} - The generated signature header.
 * @throws {AbortedError} - If the secret key is missing.
 */
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

/**
 * Calculates the revenue based on the given message.
 *
 * @param {Object} message - The message object containing the event and properties.
 * @returns {number} - The calculated revenue.
 * @throws {InstrumentationError} - If the event is 'Order Completed' and revenue is not provided.
 */
const getRevenue = (message) => {
  const { event, properties } = message;
  let revenue = properties?.value;
  const eventsMapInfo = ECOMM_EVENT_MAP[event.toLowerCase()];
  if (eventsMapInfo?.rootLevelPriceSupported) {
    const { price, quantity = 1 } = properties;
    if (price && !Number.isNaN(parseFloat(price)) && !Number.isNaN(parseInt(quantity, 10))) {
      revenue = parseFloat(price) * parseInt(quantity, 10);
    }
  } else if (eventsMapInfo?.revenueFieldSupported) {
    revenue = properties?.revenue || revenue;
    if (event.toLowerCase() === 'order completed' && !revenue) {
      throw new InstrumentationError('value is required for `Order Completed` event');
    }
  }

  return revenue;
};

/**
 * Generates items from properties of a given message.
 *
 * @param {Object} message - The message object containing properties.
 * @returns {Array} - An array of items generated from the properties.
 */
const prepareItemsFromProperties = (message) => {
  const { properties } = message;
  const items = [];
  const item = constructPayload(properties, ITEM_CONFIGS);
  items.push(item);
  return items;
};

/**
 * Generates items payload from products.
 *
 * @param {Object} message - The message object.
 * @returns {Array} - The items payload.
 */
const prepareItemsFromProducts = (message) => {
  const products = get(message, 'properties.products');
  const items = [];
  products.forEach((product) => {
    const item = constructPayload(product, ITEM_CONFIGS);
    const itemExclusionList = generateExclusionList(ITEM_CONFIGS);
    extractCustomFields(product, item, 'root', itemExclusionList);
    items.push(item);
  });
  return items;
};

/**
 * Generates items payload from root properties or products.
 *
 * @param {Object} message - The message object containing event and properties.
 * @returns {Array} - The array of items payload.
 */
const prepareItemsPayload = (message) => {
  const { event } = message;
  let items;
  const eventMapInfo = ECOMM_EVENT_MAP[event.toLowerCase()];
  if (eventMapInfo?.itemsArray) {
    items = prepareItemsFromProducts(message);
  } else if (eventMapInfo) {
    items = prepareItemsFromProperties(message);
  }
  return items;
};

/**
 * Retrieves the device advertising ID and type based on the provided message.
 *
 * @param {Object} message - The message object containing the context.
 * @returns {Object} - An object containing the device advertising ID and type.
 */
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

/**
 * Retrieves the external ID object from the given message context.
 *
 * @param {Object} message - The message object containing the context.
 * @returns {Object|undefined} - The external ID object, or undefined if not found.
 */
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

/**
 * Retrieves the advertising ID and type from the given message.
 *
 * @param {Object} message - The message object containing the context.
 * @returns {Object} - An object containing the advertising ID and type.
 *                    If the advertising ID and type are found in the device context, they are returned.
 *                    If not, the external ID object is checked and if found, its ID and type are returned.
 *                    If neither the device context nor the external ID object contain the required information,
 *                    an object with null values for ID and type is returned.
 */
const getAdvertisingId = (message) => {
  const { deviceId, type } = getDeviceAdvertisingId(message);
  if (deviceId && type) {
    return { id: deviceId, type };
  }
  const externalIdObj = getDestinationExternalIDObject(message);
  if (externalIdObj?.id && externalIdObj?.type) {
    return { id: externalIdObj.id, type: externalIdObj.type.toUpperCase() };
  }

  return { id: null, type: null };
};

/**
 * Prepares custom properties (td1-td10) for a given message and destination.
 *
 * @param {object} message - The message object.
 * @param {object} destination - The destination object.
 * @returns {object} - The prepared payload object.
 */
const prepareCustomProperties = (message, destination) => {
  const { customProperties } = destination.Config;
  const payload = {};
  if (customProperties) {
    customProperties.forEach((customProperty) => {
      const { rudderProperty, tradeDeskProperty } = customProperty;
      const value = get(message, rudderProperty);
      if (value) {
        payload[tradeDeskProperty] = value;
        // unset the rudder property from the message, since it is already mapped to a trade desk property
        lodash.unset(message, rudderProperty);
      }
    });
  }
  return payload;
};

/**
 * Retrieves the event name based on the provided message and destination.
 *
 * @param {object} message - The message object containing the event.
 * @param {object} destination - The destination object containing the events mapping configuration.
 * @returns {string} - The event name.
 */
const populateEventName = (message, destination) => {
  let eventName;
  const { event } = message;
  const { eventsMapping } = destination.Config;

  // if event is mapped on dashboard, use the mapped event name
  if (Array.isArray(eventsMapping) && eventsMapping.length > 0) {
    const keyMap = getHashFromArray(eventsMapping, 'from', 'to');
    eventName = keyMap[event.toLowerCase()];
  }

  if (eventName) {
    return eventName;
  }

  // if event is one of the supported ecommerce events, use the mapped trade desk event name
  const eventMapInfo = ECOMM_EVENT_MAP[event.toLowerCase()];
  if (isDefinedAndNotNull(eventMapInfo)) {
    return eventMapInfo.event;
  }

  // else return the event name as it is
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
  let dataProcessingOptions;

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

  if (policies && region) {
    dataProcessingOptions = { policies, region };
  }

  return dataProcessingOptions;
};

const getPrivacySetting = (message) => {
  const integrationObj = getIntegrationsObj(message, 'THE_TRADE_DESK');
  return integrationObj?.privacy_settings;
};

/**
 * Enriches the track payload with extra properties present in 'properties' other than the ones defined in TTDCommonConfig.json and TTDItemConfig.json
 *
 * @param {Object} message - The message object containing the event information.
 * @param {Object} payload - The payload object to be enriched.
 * @returns {Object} - The enriched payload object.
 */
const enrichTrackPayload = (message, payload) => {
  let rawPayload = { ...payload };
  const eventsMapInfo = ECOMM_EVENT_MAP[message.event.toLowerCase()];
  // checking if event is an ecomm one and itemsArray/products support is not present. e.g Product Added event
  if (eventsMapInfo && !eventsMapInfo.itemsArray) {
    const itemExclusionList = generateExclusionList(ITEM_CONFIGS);
    rawPayload = extractCustomFields(message, rawPayload, ['properties'], itemExclusionList);
  } else {
    // for custom events
    rawPayload = extractCustomFields(
      message,
      rawPayload,
      ['properties'],
      ['products', 'revenue', 'value'],
    );
  }
  return rawPayload;
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
  enrichTrackPayload,
};
