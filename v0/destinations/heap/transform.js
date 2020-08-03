const get = require("get-value");
const { EventType } = require("../../../constants");
const { destinationConfigKeys, endpoints } = require("./config");
const {
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  defaultRequestConfig
} = require("../util");

function flatten(target, opts) {
  opts = opts || {};

  const delimiter = opts.delimiter || ".";
  let { maxDepth } = opts;
  let currentDepth = 1;
  const output = {};

  function step(object, prev) {
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        const value = object[key];
        const isarray = opts.safe && is.array(value);
        const type = Object.prototype.toString.call(value);
        const isobject =
          type === "[object Object]" || type === "[object Array]";
        const arr = [];

        const newKey = prev ? prev + delimiter + key : key;

        if (!opts.maxDepth) {
          maxDepth = currentDepth + 1;
        }

        for (const keys in value) {
          if (value.hasOwnProperty(keys)) {
            arr.push(keys);
          }
        }

        if (!isarray && isobject && arr.length && currentDepth < maxDepth) {
          ++currentDepth;
          return step(value, newKey);
        }

        output[newKey] = value;
      }
    }
  }

  step(target);

  return output;
}
function responseBuilder(payload, message) {
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
  let email;
  switch (type) {
    case EventType.TRACK:
      propsArray = get(message, "properties")
        ? Object.keys(message.properties)
        : null;
      rudderPropertiesObj = message.properties;
      email =
        (message.context.traits ? email : null) || message.properties.email;
      if (email) rawPayload.identity = email;
      else
        throw Error("Email for identity is required for sending track calls.");
      break;
    case EventType.IDENTIFY:
      propsArray = get(message.context, "traits")
        ? Object.keys(message.context.traits)
        : null;
      email =
        message.context.traits.email ||
        (message.properties ? message.properties.email : null);
      if (email) rawPayload.identity = email;
      else
        throw Error("Email for identity is required for sending track calls.");
      rudderPropertiesObj = message.context.traits;
      break;
    default:
      break;
  }

  propsArray.forEach(property => {
    if (property != "email") {
      propertiesObj[property] = rudderPropertiesObj[property];
    }
  });

  rawPayload.properties = flatten(propertiesObj);
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
    case EventType.PAGE:
      throw Error("Page calls are not supported for Heap.");
    default:
      throw Error("Type of message is not correct");
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
  return responseBuilder(properties, event.message);
}

exports.process = process;
