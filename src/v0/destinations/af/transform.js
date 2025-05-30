const get = require('get-value');
const set = require('set-value');
const lodash = require('lodash');
const { InstrumentationError, ConfigurationError } = require('@rudderstack/integrations-lib');
const { EventType } = require('../../../constants');
const {
  removeUndefinedValues,
  defaultPostRequestConfig,
  defaultRequestConfig,
  getDestinationExternalID,

  removeUndefinedAndNullValues,
  isDefinedAndNotNull,
  getFieldValueFromMessage,
  isAppleFamily,
  isDefinedAndNotNullAndNotEmpty,
  simpleProcessRouterDest,
} = require('../../util');

const {
  Event,
  ENDPOINT,
  ENDPOINT_V2,
  ConfigCategory,
  mappingConfig,
  nameToEventMap,
} = require('./config');
const { JSON_MIME_TYPE } = require('../../util/constant');

function determineEndpoint(os, finalEndPoint, androidAppId, appleAppId) {
  if (os && os.toLowerCase() === 'android' && androidAppId) {
    return `${finalEndPoint}${androidAppId}`;
  }
  if (os && isAppleFamily(os) && appleAppId) {
    return `${finalEndPoint}id${appleAppId}`;
  }
  throw new ConfigurationError(
    'os name is required along with the respective appId eg. (os->android & Android App Id is required) or (os->ios & Apple App Id is required)',
  );
}

function responseBuilderSimple(payload, message, destination) {
  const { androidAppId, appleAppId, sharingFilter, devKey, s2sKey, authVersion } =
    destination.Config;
  const os = get(message, 'context.os.name');

  const finalEndPoint =
    isDefinedAndNotNull(authVersion) && authVersion === 'v2' ? ENDPOINT_V2 : ENDPOINT;

  // Extract endpoint determination to reduce complexity
  const endpoint = determineEndpoint(os, finalEndPoint, androidAppId, appleAppId);

  const appsflyerId = getDestinationExternalID(message, 'appsflyerExternalId');
  if (!appsflyerId) {
    throw new InstrumentationError('Appsflyer id is not set. Rejecting the event');
  }

  const updatedPayload = {
    ...payload,
    eventTime: message.timestamp,
    customer_user_id: getFieldValueFromMessage(message, 'userIdOnly'),
    ip: get(message, 'context.ip') || message.request_ip,
    os: get(message, 'context.os.version'),
    appsflyer_id: appsflyerId,
  };

  if (isAppleFamily(os)) {
    updatedPayload.idfa = get(message, 'context.device.advertisingId');
    updatedPayload.idfv = get(message, 'context.device.id');
  } else if (os.toLowerCase() === 'android') {
    updatedPayload.advertising_id = get(message, 'context.device.advertisingId');
  }

  const att = get(message, 'context.device.attTrackingStatus');
  if (isDefinedAndNotNull(att)) {
    updatedPayload.att = att;
  }

  const appVersion = get(message, 'context.app.version');
  if (isDefinedAndNotNull(appVersion)) {
    updatedPayload.app_version_name = appVersion;
  }

  const bundleIdentifier = get(message, 'context.app.namespace');
  if (isDefinedAndNotNull(bundleIdentifier)) {
    updatedPayload.bundleIdentifier = bundleIdentifier;
  }

  if (isDefinedAndNotNullAndNotEmpty(sharingFilter)) {
    updatedPayload.sharing_filter = sharingFilter;
  }

  const finalAuthentication =
    isDefinedAndNotNull(authVersion) && authVersion === 'v2' ? s2sKey : devKey;

  const response = defaultRequestConfig();
  response.endpoint = endpoint;
  response.headers = {
    'Content-Type': JSON_MIME_TYPE,
    authentication: finalAuthentication,
  };
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = removeUndefinedAndNullValues(updatedPayload);
  return response;
}

function getEventValueForUnIdentifiedTrackEvent(message) {
  let eventValue;
  if (message.properties) {
    eventValue = JSON.stringify(message.properties);
  } else {
    eventValue = '';
  }
  return { eventValue };
}

function getEventValueMapFromMappingJson(message, mappingJson, isMultiSupport, config) {
  let eventValue = {};
  const { addPropertiesAtRoot, afCurrencyAtRoot, listOfProps } = config;
  const clonedProp = message.properties && lodash.cloneDeep(message.properties);
  if (addPropertiesAtRoot) {
    eventValue = clonedProp;
  } else {
    if (Array.isArray(listOfProps) && listOfProps.length > 0) {
      listOfProps.forEach((prop) => {
        eventValue[prop.property] = clonedProp[prop.property];
        delete clonedProp[prop.property];
      });
    }
    eventValue.properties = clonedProp;
  }

  const sourceKeys = Object.keys(mappingJson);
  sourceKeys.forEach((sourceKey) => {
    set(eventValue, mappingJson[sourceKey], get(message, sourceKey));
  });
  if (isMultiSupport && clonedProp?.products?.length > 0) {
    const contentIds = [];
    const quantities = [];
    const prices = [];
    clonedProp.products.forEach((product) => {
      contentIds.push(product.product_id);
      quantities.push(product.quantity);
      prices.push(product.price);
    });
    eventValue = {
      ...eventValue,
      af_content_id: contentIds,
      af_quantity: quantities,
      af_price: prices,
    };
  }
  if (afCurrencyAtRoot) {
    eventValue.af_currency = clonedProp.currency;
  }
  eventValue = removeUndefinedValues(eventValue);
  if (Object.keys(eventValue).length > 0) {
    eventValue = JSON.stringify(eventValue);
  } else {
    eventValue = '';
  }
  return { eventValue };
}

function processNonTrackEvents(message, eventName) {
  const clonedMessage = { ...message };
  if (!isDefinedAndNotNull(clonedMessage.event)) {
    clonedMessage.event = message.name || message.properties?.name;
  }
  const payload = getEventValueForUnIdentifiedTrackEvent(clonedMessage);
  payload.eventName = eventName;
  return payload;
}

function processEventTypeTrack(message, config) {
  let isMultiSupport = true;
  const evType = message.event && message.event.toLowerCase();
  let category = ConfigCategory.DEFAULT;

  switch (evType) {
    case Event.WISHLIST_PRODUCT_ADDED_TO_CART.name:
    case Event.PRODUCT_ADDED_TO_WISHLIST.name:
    case Event.CHECKOUT_STARTED.name:
    case Event.ORDER_COMPLETED.name:
    case Event.PRODUCT_REMOVED.name:
    case Event.PRODUCT_SEARCHED.name:
    case Event.PRODUCT_VIEWED.name:
      category = nameToEventMap[evType].category;
      break;
    default: {
      isMultiSupport = false;
      break;
    }
  }
  const payload = getEventValueMapFromMappingJson(
    message,
    mappingConfig[category.name],
    isMultiSupport,
    config,
  );
  payload.eventName = message.event;
  payload.eventCurrency = message?.properties?.currency;

  return payload;
}

function processSingleMessage(message, destination) {
  const { devKey, s2sKey, authVersion, useRichEventName } = destination.Config;

  if (!isDefinedAndNotNull(authVersion) && !isDefinedAndNotNull(devKey)) {
    throw new ConfigurationError('No authentication key is present. Aborting.');
  }

  if (isDefinedAndNotNull(authVersion) && authVersion === 'v2' && !isDefinedAndNotNull(s2sKey)) {
    throw new ConfigurationError('s2s key is mandatory for v2 authorization. Aborting.');
  }

  if (isDefinedAndNotNull(authVersion) && authVersion === 'v1' && !isDefinedAndNotNull(devKey)) {
    throw new ConfigurationError('dev key is mandatory for v1 authorization. Aborting.');
  }
  const messageType = message.type.toLowerCase();
  let payload;
  switch (messageType) {
    case EventType.TRACK: {
      payload = processEventTypeTrack(message, destination.Config);
      break;
    }
    case EventType.SCREEN: {
      let eventName;
      if (useRichEventName === true) {
        eventName = `Viewed ${
          message.name || message.event || get(message, 'properties.name') || ''
        } Screen`;
      } else {
        eventName = EventType.SCREEN;
      }
      payload = processNonTrackEvents(message, eventName);
      break;
    }
    case EventType.PAGE: {
      let eventName;
      if (useRichEventName === true) {
        eventName = `Viewed ${message.name || get(message, 'properties.name') || ''} Page`;
      } else {
        eventName = EventType.PAGE;
      }
      payload = processNonTrackEvents(message, eventName);
      break;
    }
    default:
      throw new InstrumentationError('message type not supported');
  }
  return responseBuilderSimple(payload, message, destination);
}

function process(event) {
  const response = processSingleMessage(event.message, event.destination);
  return response;
}

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
