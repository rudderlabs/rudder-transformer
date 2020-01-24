const get = require("get-value");
const { EventType } = require("../../constants");
const { destinationConfigKeys, endpoints } = require("./config");
const { mapPayload } = require("./data/eventMapping");
const {
  defaultPostRequestConfig,
  updatePayload,
  removeUndefinedAndNullValues
} = require("../util");

function responseBuilder(payload, message, heapConfig) {
  let endpoint;
  let requestConfig;

  switch (message.type) {
    case EventType.IDENTIFY:
      requestConfig = defaultPostRequestConfig;
      endpoint = endpoints.identifyUrl;
      break;
    case EventType.TRACK:
      requestConfig = defaultPostRequestConfig;
      endpoint = `${endpoints.trackUrl}`;
      break;
    default:
      break;
  }

  const response = {
    endpoint,
    header: {
      autopilotapikey: `${heapConfig.apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    requestConfig,
    userId: message.userId ? message.userId : message.anonymousId,
    payload: removeUndefinedAndNullValues(payload)
  };
  return response;
}

function commonPayload(message, rawPayload, type) {
  let propertiesObj = {};
  let propsArray;
  let rudderPropertiesObj;
  switch (type) {
    case EventType.TRACK:
      propsArray = get(message, "properties")
        ? Object.keys(message.properties)
        : null;
      rudderPropertiesObj = message.properties;
      break;
    case EventType.IDENTIFY:
      propsArray = get(message.context, "traits")
        ? Object.keys(message.context.traits)
        : null;
      rudderPropertiesObj = message.context.traits;

      break;
  }

  if (propsArray.includes("email")) {
    propsArray.forEach(property => {
      if (property != "email") {
        propertiesObj[property] = rudderPropertiesObj[property];
      } else {
        const value = rudderPropertiesObj[property];
        const replaceKeys = mapPayload.common.emailMapping;
        updatePayload(property, replaceKeys, value, rawPayload);
      }
    });
  }

  rawPayload.properties = propertiesObj;
  return rawPayload;
}

function getIdentifyPayload(message, heapConfig) {
  let rawPayload = {
    app_id: heapConfig.app_id
  };
  return commonPayload(message, rawPayload, message.type);
}

function getTrackPayload(message, heapConfig) {
  let rawPayload = {
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
