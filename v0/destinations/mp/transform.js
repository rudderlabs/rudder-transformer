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
  let endpoint = "https://api.mixpanel.com/engage/";
  if (
    eventType !== EventType.IDENTIFY &&
    eventType !== EventType.GROUP &&
    eventType !== "revenue"
  ) {
    endpoint = "https://api.mixpanel.com/track/";
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
    ...message.context.traits,
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
  const returnValue = [];

  const properties = getTransformedJSON(message, mPIdentifyConfigJson);
  const { device } = message.context;
  if (device && device.token) {
    if (device.type === "ios") {
      properties.$ios_devices = [device.token];
    } else if (device.type === "android") {
      properties.$android_devices = [device.token];
    }
  }

  const parameters = {
    $set: properties,
    $token: destination.Config.token,
    $distinct_id: message.userId || message.anonymousId
  };
  returnValue.push(responseBuilderSimple(parameters, message, type));

  if (message.userId) {
    const trackParameters = {
      event: "$create_alias",
      properties: {
        distinct_id: message.anonymousId,
        alias: message.userId,
        token: destination.Config.token
      }
    };
    const identifyTrackResponse = responseBuilderSimple(
      trackParameters,
      message,
      type
    );
    identifyTrackResponse.endpoint = "https://api.mixpanel.com/track/";
    returnValue.push(identifyTrackResponse);
  }

  return returnValue;
}

function processPageOrScreenEvents(message, type, destination) {
  const properties = {
    ...message.properties,
    ...message.context.traits,
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

function processAliasEvents(message, type, destination) {
  const parameters = {
    event: "$create_alias",
    properties: {
      distinct_id: message.previousId || message.anonymousId,
      alias: message.userId,
      token: destination.Config.token
    }
  };
  return responseBuilderSimple(parameters, message, type);
}

function processGroupEvents(message, type, destination) {
  const parameters = {
    $token: destination.Config.token,
    $distinct_id: message.userId || message.anonymousId,
    $set: {
      $group_id: message.groupId
    }
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
    case EventType.ALIAS:
      return processAliasEvents(message, message.type, destination);
    case EventType.GROUP:
      return processGroupEvents(message, message.type, destination);

    default:
      throw new Error("message type not supported");
  }
}

function process(event) {
  const resp = processSingleMessage(event.message, event.destination);
  return resp;
}
exports.process = process;
