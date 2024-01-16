const get = require('get-value');
const { TransformationError, InstrumentationError } = require('@rudderstack/integrations-lib');
const {
  isEmptyObject,
  constructPayload,
  defaultRequestConfig,
  simpleProcessRouterDest,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  getHashFromArray,
  isDefinedAndNotNull,
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

// const getPrivacySetting = (message) => {
//   const integrationObj = getIntegrationsObj(message, 'THE_TRADE_DESK');
// };

const getDestinationExternalIDObject = (message) => {
  const { context } = message;
  const externalIdArray = context?.externalId || [];

  let externalIdObj;

  if (Array.isArray(externalIdArray)) {
    externalIdObj = externalIdArray.find((extIdObj) =>
      CONVERSION_SUPPORTED_ID_TYPES.includes(extIdObj?.type?.toUpperCase() && extIdObj?.id),
    );
  }
  return externalIdObj;
};

const prepareIdFromExternalId = (message) => {
  const obj = getDestinationExternalIDObject(message);
  const { type, id } = obj;
  return { type, id };
};

// const populateEventName = (message, destination) => {
//   let eventName;
//   const { event } = message;
//   const { eventsMapping } = destination.Config;

//   if (eventsMapping.length > 0) {
//     const keyMap = getHashFromArray(eventsMapping, 'from', 'to');
//     eventName = keyMap[event.toLowerCase()];
//   }

//   if (!eventName) {
//     const eventMapInfo = ECOMM_EVENT_MAP.find((eventMap) => {
//       if (eventMap.src.toLowerCase() === event.toLowerCase()) {
//         return eventMap;
//       }
//       return false;
//     });

//     if (isDefinedAndNotNull(eventMapInfo)) {
//       return eventMapInfo.dest;
//     }
//   }

//   return eventName;
// };

// "customProperties": [
//     {
//       "rudderProperty": "properties.key1",
//       "tradeDeskProperty": "td1"
//     }
//   ]
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
  return customProperties;
};

const prepareCommonPayload = (message) => constructPayload(message, COMMON_CONFIGS);

const prepareTrackPayload = (message, destination) => {
  const commonPayload = prepareCommonPayload(message);
  const items = prepareItemsPayload(message);
  const { type, id } = prepareIdFromExternalId(message);
  const customProperties = prepareCustomProperties(message, destination);
  const payload = { ...commonPayload, items, adid_type: type, adid: id, ...customProperties };
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

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
