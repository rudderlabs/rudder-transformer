const get = require("get-value");
const { EventType } = require("../../../constants");
const { destinationConfigKeys, endpoints } = require("./config");
const {
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  defaultRequestConfig
} = require("../../util");

function responseBuilder(payload, message, heapConfig) {
  const response = defaultRequestConfig();

  switch (message.type) {
    case EventType.IDENTIFY:
      response.method = defaultPostRequestConfig.requestMethod;
      response.endpoint = endpoints.identifyUrl;
      break;
    case EventType.TRACK:
      response.method = defaultPostRequestConfig.requestMethod;
      response.endpoint = `${endpoints.trackUrl}`;
      break;
    default:
      break;
  }

  response.body.JSON = removeUndefinedAndNullValues(payload);

  return {
    ...response,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    userId: message.userId ? message.userId : message.anonymousId
  };
}

function commonPayload(message, rawPayload, type) {
  const propertiesObj = {};
  let propsArray;
  let rudderPropertiesObj;
  switch (type) {
    case EventType.TRACK:
      propsArray = get(message, "properties")
        ? Object.keys(message.properties)
        : null;
      rudderPropertiesObj = message.properties;
      rawPayload.identity = message.context.traits.email;
      break;
    case EventType.IDENTIFY:
      propsArray = get(message.context, "traits")
        ? Object.keys(message.context.traits)
        : null;
      rudderPropertiesObj = message.context.traits;
      rawPayload.identity = message.context.traits.email;
      break;
  }

  propsArray.forEach(property => {
    if (property != "email") {
      propertiesObj[property] = rudderPropertiesObj[property];
    }
  });

  rawPayload.properties = propertiesObj;
  return rawPayload;
}

function getIdentifyPayload(message, heapConfig) {
  const rawPayload = {
    app_id: heapConfig.app_id
  };
  return commonPayload(message, rawPayload, message.type);
}

function getTrackPayload(message, heapConfig) {
  const rawPayload = {
    app_id: heapConfig.app_id,
    event: get(message.event) ? message.event : message.userId
  };
  return commonPayload(message, rawPayload, message.type);
}

function getTransformedJSON(message, heapConfig) {
  let rawPayload;
  switch (message.type) {
    case EventType.TRACK:
      rawPayload = getTrackPayload(message, heapConfig);
      break;
    case EventType.IDENTIFY:
      rawPayload = getIdentifyPayload(message, heapConfig);
      break;
    default:
      break;
  }
  return { ...rawPayload };
}

function getDestinationKeys(destination) {
  const heapConfig = {};
  const configKeys = Object.keys(destination.Config);
  configKeys.forEach(key => {
    switch (key) {
      case destinationConfigKeys.appId:
        heapConfig.app_id = `${destination.Config[key]}`;
        break;
      default:
        break;
    }
  });
  return heapConfig;
}

function process(event) {
  const heapConfig = getDestinationKeys(event.destination);
  const properties = getTransformedJSON(event.message, heapConfig);
  return responseBuilder(properties, event.message, heapConfig);
}

exports.process = process;
