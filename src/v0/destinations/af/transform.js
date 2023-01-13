const get = require("get-value");
const set = require("set-value");

const { EventType } = require("../../../constants");
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
  simpleProcessRouterDest
} = require("../../util");
const {
  InstrumentationError,
  ConfigurationError
} = require("../../util/errorTypes");

const {
  Event,
  ENDPOINT,
  ConfigCategory,
  mappingConfig,
  nameToEventMap
} = require("./config");

function responseBuilderSimple(payload, message, destination) {
  const { androidAppId, appleAppId } = destination.Config;
  let endpoint;
  const os = get(message, "context.os.name");
  // if ((os && os.toLowerCase() === "android") || (os && isAppleFamily(os))){
  //   if()
  // }
  if (os && os.toLowerCase() === "android" && androidAppId) {
    endpoint = `${ENDPOINT}${androidAppId}`;
  } else if (os && isAppleFamily(os) && appleAppId) {
    endpoint = `${ENDPOINT}id${appleAppId}`;
  } else {
    throw new ConfigurationError("Invalid app endpoint");
  }
  // if (androidAppId) {
  //   endpoint = `${ENDPOINT}${androidAppId}`;
  // } else if (appleAppId) {
  //   endpoint = `${ENDPOINT}id${appleAppId}`;
  // }
  // else if (message.context.app.namespace) {
  //   endpoint = `${ENDPOINT}${message.context.app.namespace}`;
  // } else {
  //   throw new InstrumentationError("Invalid app endpoint");
  // }
  // const afId = message.integrations
  //   ? message.integrations.AF
  //     ? message.integrations.AF.af_uid
  //     : undefined
  //   : undefined;
  const appsflyerId = getDestinationExternalID(message, "appsflyerExternalId");
  if (!appsflyerId) {
    throw new InstrumentationError(
      "Appsflyer id is not set. Rejecting the event"
    );
  }

  const updatedPayload = {
    ...payload,
    eventTime: message.timestamp,
    customer_user_id: getFieldValueFromMessage(message, "userIdOnly"),
    ip: get(message, "context.ip") || message.request_ip,
    os: get(message, "context.os.version"),
    appsflyer_id: appsflyerId
  };

  if (isAppleFamily(os)) {
    updatedPayload.idfa = get(message, "context.device.advertisingId");
    updatedPayload.idfv = get(message, "context.device.id");
  } else if (os.toLowerCase() === "android") {
    updatedPayload.advertising_id = get(
      message,
      "context.device.advertisingId"
    );
  }

  const att = get(message, "context.device.attTrackingStatus");
  if (isDefinedAndNotNull(att)) {
    updatedPayload.att = att;
  }

  const appVersion = get(message, "context.app.version");
  if (isDefinedAndNotNull(appVersion)) {
    updatedPayload.app_version_name = appVersion;
  }

  const bundleIdentifier = get(message, "context.app.namespace");
  if (isDefinedAndNotNull(bundleIdentifier)) {
    updatedPayload.bundleIdentifier = bundleIdentifier;
  }

  const { sharingFilter } = destination.Config;
  if (isDefinedAndNotNullAndNotEmpty(sharingFilter)) {
    updatedPayload.sharing_filter = sharingFilter;
  }

  const response = defaultRequestConfig();
  response.endpoint = endpoint;
  response.headers = {
    "Content-Type": "application/json",
    authentication: destination.Config.devKey
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
    eventValue = "";
  }
  return { eventValue };
}

function getEventValueMapFromMappingJson(message, mappingJson, isMultiSupport) {
  let eventValue = {};
  set(eventValue, "properties", message.properties);
  const sourceKeys = Object.keys(mappingJson);
  sourceKeys.forEach(sourceKey => {
    set(eventValue, mappingJson[sourceKey], get(message, sourceKey));
  });
  if (
    isMultiSupport &&
    message.properties &&
    message.properties.products &&
    message.properties.products.length > 0
  ) {
    const contentIds = [];
    const quantities = [];
    const prices = [];
    message.properties.products.forEach(product => {
      contentIds.push(product.product_id);
      quantities.push(product.quantity);
      prices.push(product.price);
    });
    eventValue = {
      ...eventValue,
      af_content_id: contentIds,
      af_quantity: quantities,
      af_price: prices
    };
  }
  eventValue = removeUndefinedValues(eventValue);
  if (Object.keys(eventValue).length > 0) {
    eventValue = JSON.stringify(eventValue);
  } else {
    eventValue = "";
  }
  return { eventValue };
}

function processNonTrackEvents(message, eventName) {
  if (!isDefinedAndNotNull(message.event)) {
    message.event =
      message.name || (message.properties && message.properties.name);
  }
  const payload = getEventValueForUnIdentifiedTrackEvent(message);
  payload.eventName = eventName;
  return payload;
}

function processEventTypeTrack(message) {
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
    isMultiSupport
  );
  payload.eventName = message.event;
  payload.eventCurrency = message?.properties?.currency;

  return payload;
}

function processSingleMessage(message, destination) {
  const messageType = message.type.toLowerCase();
  let payload;
  switch (messageType) {
    case EventType.TRACK: {
      payload = processEventTypeTrack(message, destination);
      break;
    }
    case EventType.SCREEN: {
      let eventName;
      if (destination.Config.useRichEventName === true) {
        eventName = `Viewed ${message.name ||
          message.event ||
          get(message, "properties.name") ||
          ""} Screen`;
      } else {
        eventName = EventType.SCREEN;
      }
      payload = processNonTrackEvents(message, eventName);
      break;
    }
    case EventType.PAGE: {
      let eventName;
      if (destination.Config.useRichEventName === true) {
        eventName = `Viewed ${message.name ||
          get(message, "properties.name") ||
          ""} Page`;
      } else {
        eventName = EventType.PAGE;
      }
      payload = processNonTrackEvents(message, eventName);
      break;
    }
    default:
      throw new InstrumentationError("message type not supported");
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
