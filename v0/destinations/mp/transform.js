const get = require("get-value");
const set = require("set-value");
const { EventType } = require("../../../constants");
const {
  removeUndefinedValues,
  defaultRequestConfig,
  defaultPostRequestConfig
} = require("../util");
const { ConfigCategory, mappingConfig } = require("./config");

const mPIdentifyConfigJson = mappingConfig[ConfigCategory.IDENTIFY.name];

function getEventTime(message) {
  return new Date(message.originalTimestamp).toISOString();
}

function responseBuilderSimple(parameters, message, eventType) {
  let endpoint = "http://api.mixpanel.com/engage/";
  if (eventType !== EventType.IDENTIFY && eventType !== "revenue") {
    endpoint = "http://api.mixpanel.com/track/";
  }

  const encodedData = Buffer.from(
    JSON.stringify(removeUndefinedValues(parameters))
  ).toString("base64");

  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = endpoint;
  response.userId = message.userId || message.anonymousId;
  response.params = { data: encodedData };
  response.statusCode = 200;

  return response;
}

function processRevenueEvents(message, destination) {
  const revenueValue = message.properties.revenue;
  const transactions = {
    $time: getEventTime(message),
    $amount: revenueValue
  };
  const parameters = {
    $append: { $transactions: transactions },
    $token: destination.Config.token,
    $distinct_id: message.userId || message.anonymousId
  };

  return responseBuilderSimple(parameters, message, "revenue");
}

function getEventValueForTrackEvent(message, destination) {
  const properties = {
    ...message.properties,
    token: destination.Config.token,
    distinct_id: message.userId || message.anonymousId,
    time: message.timestamp
  };

  const parameters = {
    event: message.event,
    properties
  };

  return responseBuilderSimple(parameters, message, EventType.TRACK);
}

function processTrack(message, destination) {
  const returnValue = [];
  if (message.properties && message.properties.revenue) {
    returnValue.push(processRevenueEvents(message, destination));
  }
  returnValue.push(getEventValueForTrackEvent(message, destination));
  return returnValue;
}

function getTransformedJSON(message, mappingJson) {
  const rawPayload = {};

  const sourceKeys = Object.keys(mappingJson);
  if (message.context.traits) {
    const traits = { ...message.context.traits };
    const keys = Object.keys(traits);
    keys.forEach(key => {
      const traitsKey = `context.traits.${key}`;
      if (sourceKeys.includes(traitsKey)) {
        set(rawPayload, mappingJson[traitsKey], get(message, traitsKey));
      } else {
        set(rawPayload, key, get(message, traitsKey));
      }
    });
  }
  return rawPayload;
}

function processIdentifyEvents(message, type, destination) {
  const properties = getTransformedJSON(message, mPIdentifyConfigJson);
  const parameters = {
    $set: properties,
    $token: destination.Config.token,
    $distinct_id: message.userId || message.anonymousId
  };
  return responseBuilderSimple(parameters, message, type);
}

function processPageOrScreenEvents(message, type, destination) {
  const properties = {
    ...message.properties,
    token: destination.Config.token,
    distinct_id: message.userId || message.anonymousId,
    time: message.timestamp
  };

  const parameters = {
    event: type,
    properties
  };
  return responseBuilderSimple(parameters, message, type);
}

function processSingleMessage(message, destination) {
  switch (message.type) {
    case EventType.TRACK:
      return processTrack(message, destination);
    case EventType.SCREEN:
    case EventType.PAGE: {
      return processPageOrScreenEvents(message, message.type, destination);
    }
    case EventType.IDENTIFY:
      return processIdentifyEvents(message, message.type, destination);
    default:
      throw new Error(
        "message type " + message.type + " is not supported for MP"
      );
  }
}

function process(event) {
  const resp = processSingleMessage(event.message, event.destination);
  return resp;
}
exports.process = process;
