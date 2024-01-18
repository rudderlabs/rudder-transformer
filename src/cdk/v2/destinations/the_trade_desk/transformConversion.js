const get = require('get-value');
const { InstrumentationError } = require('@rudderstack/integrations-lib');
const {
  constructPayload,
  defaultRequestConfig,
  simpleProcessRouterDest,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  getHashFromArray,
  isDefinedAndNotNull,
  isAppleFamily,
  getIntegrationsObj,
} = require('../../../../v0/util');
const { EventType } = require('../../../../constants');
const { JSON_MIME_TYPE } = require('../../../../v0/util/constant');
const {
  COMMON_CONFIGS,
  ITEM_CONFIGS,
  CONVERSION_SUPPORTED_ID_TYPES,
  ECOMM_EVENT_MAP,
  REAL_TIME_CONVERSION_ENDPOINT,
} = require('./config');

const responseBuilder = (payload) => {
  const response = defaultRequestConfig();
  response.endpoint = REAL_TIME_CONVERSION_ENDPOINT;
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  response.headers = { 'Content-Type': JSON_MIME_TYPE };
  return response;
};

const prepareItemsPayload = (message) => {
  const productPropertiesArray = Array.isArray(message.properties?.products)
    ? message.properties.products
    : [message.properties];
  const items = [];
  productPropertiesArray.forEach((product) => {
    items.push(constructPayload(product, ITEM_CONFIGS));
  });
  return items;
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

const getDeviceAdvertisingId = (message) => {
  const { context } = message;
  const idfa = isAppleFamily(context?.os?.name) ? context?.device?.advertisingId : null;
  const aaid =
    context?.os?.name.toLowerCase() === 'android' ? context?.device?.advertisingId : null;
  const naid =
    context?.os?.name.toLowerCase() === 'windows' ? context?.device?.advertisingId : null;
  const deviceId = idfa || aaid || naid;
  const type = idfa ? 'IDFA' : aaid ? 'AAID' : naid ? 'NAID' : null;
  return { deviceId, type };
};

// TDID, DAID,'IDL','EUID', 'UID2',
const getAdvertisingId = (message) => {
  const { deviceId, type } = getDeviceAdvertisingId(message);
  if (deviceId) {
    return { id: deviceId, type };
  }
  const externalIdObj = getDestinationExternalIDObject(message);
  return { id: externalIdObj?.id, type: externalIdObj?.type };
};

const populateEventName = (message, destination) => {
  let eventName;
  const { event } = message;
  const { eventsMapping } = destination.Config;

  if (eventsMapping.length > 0) {
    const keyMap = getHashFromArray(eventsMapping, 'from', 'to');
    eventName = keyMap[event.toLowerCase()];
  }

  if (!eventName) {
    const eventMapInfo = ECOMM_EVENT_MAP.find((eventMap) => {
      if (eventMap.src.toLowerCase() === event.toLowerCase()) {
        return eventMap;
      }
      return false;
    });

    if (isDefinedAndNotNull(eventMapInfo)) {
      return eventMapInfo.dest;
    }
  }

  return eventName;
};

const getDataProcessingOptions = (message) => {
  const integrationObj = getIntegrationsObj(message, 'THE_TRADE_DESK');
  let { policies, region } = integrationObj;
  if (!policies || (Array.isArray(policies) && policies.length === 0)) {
    policies = ['LDU'];
  }

  if (Array.isArray(policies)) {
    if (policies.length > 1) {
      throw new InstrumentationError('Only one policy is allowed');
    }
    if (policies[0] !== 'LDU') {
      throw new InstrumentationError('Only LDU policy is supported');
    }
  }

  // TODO: add us applicable state check
  return { policies, region };
};

// const getPrivacySetting = (message) => {
//   const integrationObj = getIntegrationsObj(message, 'THE_TRADE_DESK');
// };

const prepareCustomProperties = (message, destination) => {
  const { customProperties } = destination.Config;
  const payload = {};
  customProperties.forEach((customProperty) => {
    const { rudderProperty, tradeDeskProperty } = customProperty;
    const value = get(message, rudderProperty);
    if (value) {
      payload[tradeDeskProperty] = value;
    }
  });
  return payload;
};

const prepareFromConfig = (destination) => {
  const { Config } = destination;
  const { trackerId, advertiserId } = Config;
  return { tracker_id: trackerId, adv: advertiserId };
};

const prepareCommonPayload = (message) => constructPayload(message, COMMON_CONFIGS);

const prepareTrackPayload = (message, destination) => {
  const configPayload = prepareFromConfig(destination);
  const commonPayload = prepareCommonPayload(message);
  const items = prepareItemsPayload(message);
  const { id, type } = getAdvertisingId(message);
  const customProperties = prepareCustomProperties(message, destination);
  const eventName = populateEventName(message, destination);
  const payload = {
    ...configPayload,
    ...commonPayload,
    event_name: eventName,
    items,
    adid: id,
    adid_type: type,
    ...customProperties,
    data_processing_option: getDataProcessingOptions(message),
  };
  return { data: [payload] };
};

const trackResponseBuilder = (message, destination) => {
  const payload = prepareTrackPayload(message, destination);
  return responseBuilder(payload);
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }

  const messageType = message.type.toLowerCase();
  let response;
  switch (messageType) {
    case EventType.TRACK:
      response = trackResponseBuilder(message, destination);
      break;
    default:
      throw new InstrumentationError(`Event type "${messageType}" is not supported`);
  }
  return response;
};

const process = (event) => processEvent(event.message, event.destination);

const processConversionInputs = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { processConversionInputs };
