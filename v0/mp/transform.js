const get = require("get-value");
const set = require("set-value");
const { EventType } = require("../../constants");
const { removeUndefinedValues } = require("../util");
const { ConfigCategory, mappingConfig } = require("./config");

const mPIdentifyConfigJson = mappingConfig[ConfigCategory.IDENTIFY.name];

function getEventTime(message) {
  return new Date(message.timestamp).toISOString();
}

function processTrack(message, destination) {
  if (message.properties.revenue) {
    return processRevenueEvents(message, destination);
  }
  return getEventValueForTrackEvent(message, destination);
}

function getEventValueForTrackEvent(message, destination) {
  const properties = {
    ...message.properties,
    token: destination.Config.apiKey,
    distinct_id: message.anonymous_id,
    time: message.timestamp
  };

  const parameters = {
    event: message.event,
    properties
  };

  return responseBuilderSimple(parameters, message, "track");
}

function processRevenueEvents(message, destination) {
  const revenueValue = message.properties.revenue;
  const transactions = {
    $time: getEventTime(message),
    $amount: revenueValue
  };
  const parameters = {
    $append: { $transactions: transactions },
    $token: destination.Config.apiKey,
    $distinct_id: message.anonymous_id
  };

  return responseBuilderSimple(parameters, message, "revenue");
}

function responseBuilderSimple(parameters, message, eventType) {
  let endpoint = "http://api.mixpanel.com/engage/";
  if (eventType === EventType.TRACK) {
    endpoint = "http://api.mixpanel.com/track/";
  }

  const encodedData = Buffer.from(
    JSON.stringify(removeUndefinedValues(parameters))
  ).toString("base64");

  return {
    endpoint,
    userId: message.anonymous_id,
    requestConfig: {
      requestFormat: "PARAMS",
      requestMethod: "POST"
    },
    header: {},
    payload: {
      data: encodedData
    }
  };
}

function getTransformedJSON(message, mappingJson) {
  const rawPayload = {};

  const sourceKeys = Object.keys(mappingJson);
  sourceKeys.forEach(sourceKey => {
    set(rawPayload, mappingJson[sourceKey], get(message, sourceKey));
  });
  return rawPayload;
}

function processIdentifyEvents(message, eventName, destination) {
  const properties = getTransformedJSON(message, mPIdentifyConfigJson);
  const parameters = {
    $set: properties,
    token: destination.Config.apiKey,
    distinct_id: message.anonymous_id
  };
  return responseBuilderSimple(parameters, message, eventName);
}

function processPageOrScreenEvents(message, eventName, destination) {
  const properties = {
    ...message.properties,
    token: destination.Config.apiKey,
    distinct_id: message.anonymous_id,
    time: message.timestamp
  };

  const parameters = {
    event: eventName,
    properties
  };
  return responseBuilderSimple(parameters, message, eventName);
}

function processSingleMessage(message, destination) {
  const eventName = message.event;
  var response = [];
  switch (message.type) {
    case EventType.TRACK:
      return processTrack(message, destination);
    case EventType.SCREEN:
    case EventType.PAGE:
      eventName = message.type;
      return processPageOrScreenEvents(message, eventName, destination);
    case EventType.IDENTIFY:
      return processIdentifyEvents(message, message.type, destination);
  }
  return response;
}

function process(events) {
  return events.map(event => {
    return processSingleMessage(event.message, event.destination);
  });
}
exports.process = process;
