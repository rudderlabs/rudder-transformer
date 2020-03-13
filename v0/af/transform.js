const get = require("get-value");
const set = require("set-value");

const { EventType } = require("../../constants");
const {
  removeUndefinedValues,
  defaultPostRequestConfig,
  defaultRequestConfig
} = require("../util");

const {
  Event,
  ENDPOINT,
  ConfigCategory,
  mappingConfig,
  nameToEventMap
} = require("./config");

function getAppId(message, destination) {
  let appId;
  let osName = message.context.os.name.toLowerCase();

  switch (osName) {
    case "android":
      appId = destination.Config.androidAppId;
      break;
    case "ios":
      appId = "id" + destination.Config.appleAppId;
      break;
  }

  if (!appId) {
    // fetching default value if appId is undefined
    if (message.context.app && message.context.app.namespace) {
      appId = message.context.app.namespace;
    } else {
      throw new Error(
        "App ID must be present in either destination.Config or message.context.app.namespace"
      );
    }
  }
  return appId;
}

function getAppsflyerId(message, destination) {
  let appsflyer_id = message.destination_props
    ? message.destination_props.AF
      ? message.destination_props.AF.af_uid
      : undefined
    : undefined;

  if (!appsflyer_id) {
    // fetching appsflyer id from destination config if it is undefined
    if (destination.Config && destination.Config.appsFlyerId) {
      appsflyer_id = destination.Config.appsFlyerId;
    } else {
      throw new Error(
        "Appsflyer ID must be present in either message.destination_props or destination.Config"
      );
    }
  }
  return appsflyer_id;
}

function responseBuilderSimple(payload, message, destination) {
  let appId = getAppId(message, destination);
  const endpoint = ENDPOINT + appId;
  let appsflyer_id = getAppsflyerId(message, destination);

  const updatedPayload = {
    ...payload,
    af_events_api: "true",
    eventTime: message.timestamp,
    customer_user_id: message.user_id,
    appsflyer_id: appsflyer_id
  };

  const response = defaultRequestConfig();
  response.endpoint = endpoint;
  response.headers = {
    "Content-Type": "application/json",
    authentication: destination.Config.devKey
  };
  response.method = defaultPostRequestConfig.requestMethod;
  response.userId = message.anonymousId;
  response.body.JSON = removeUndefinedValues(updatedPayload);
  return response;
}

function getEventValueForUnIdentifiedTrackEvent(message) {
  return {
    eventValue: message.properties
  };
}

function getEventValueMapFromMappingJson(message, mappingJson, isMultiSupport) {
  const rawPayload = {};
  set(rawPayload, "properties", message.properties);

  const sourceKeys = Object.keys(mappingJson);
  sourceKeys.forEach(sourceKey => {
    set(rawPayload, mappingJson[sourceKey], get(message, sourceKey));
  });

  if (isMultiSupport && message.products && message.products.length > 0) {
    const contentIds = [];
    const quantities = [];
    const prices = [];
    message.products.forEach(product => {
      contentIds.push(product.product_id);
      quantities.push(product.quantity);
      prices.push(product.price);
    });
    rawPayload.eventValue = {
      af_content_id: contentIds,
      af_quantity: quantities,
      af_price: prices
    };
  }
  return rawPayload;
}

function processNonTrackEvents(message, destination, eventName) {
  const payload = getEventValueForUnIdentifiedTrackEvent(message);
  payload.eventName = eventName;
  return payload;
}

function processEventTypeTrack(message, destination) {
  let isMultiSupport = true;
  let isUnIdentifiedEvent = false;
  let category = ConfigCategory.DEFAULT;

  if (!message.event) {
    throw new Error("message.event is a required field");
  }

  const evType = message.event.toLowerCase();
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
      // eventName = evType.toLowerCase();
      isMultiSupport = false;
      isUnIdentifiedEvent = true;
      break;
    }
  }

  let payload;
  if (isUnIdentifiedEvent) {
    payload = getEventValueForUnIdentifiedTrackEvent(message);
  } else {
    payload = getEventValueMapFromMappingJson(
      message,
      mappingConfig[category.name],
      isMultiSupport
    );
  }
  payload.eventName = evType;

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
      const eventName = EventType.SCREEN;
      payload = processNonTrackEvents(message, destination, eventName);
      break;
    }
    case EventType.PAGE: {
      const eventName = EventType.PAGE;
      payload = processNonTrackEvents(message, destination, eventName);
      break;
    }
    default:
      // throw new Error("message type not supported");
      return { statusCode: 400, error: "message type not supported" };
  }
  return responseBuilderSimple(payload, message, destination);
}

function process(event) {
  const resp = processSingleMessage(event.message, event.destination);
  if (!resp.statusCode) {
    resp.statusCode = 200;
  }
  return resp;
}

exports.process = process;
