const get = require("get-value");
const { destinationConfigKeys, batchEndpoint } = require("./config");
const {
  defaultPostRequestConfig,
  removeUndefinedAndNullValues
} = require("../util");

function responseBuilderSimple(payload, segmentConfig) {
  const basicAuth = new Buffer(`${segmentConfig.writeKey}:`).toString("base64");

  const response = {
    endpoint: batchEndpoint,
    header: {
      "Content-Type": "application/json",
      Authorization: `Basic ${basicAuth}`
    },
    requestConfig: defaultPostRequestConfig,
    userId: segmentConfig.userId,
    payload
  };
  return response;
}

function makePayload(
  type,
  userId,
  event,
  traits,
  properties,
  timeStamp,
  segmentConfig
) {
  const eventPayload = {
    type,
    userId,
    event,
    traits,
    properties,
    timeStamp
  };
  return removeUndefinedAndNullValues(eventPayload);
}

function getTransformedJSON(message, segmentConfig) {
  const type = message.type;
  const userId = get(message, "userId") ? message.userId : message.anonymousId;
  const traits = get(message, "context.traits")
    ? message.context.traits
    : undefined;
  delete traits.anonymousId;
  const properties = get(message, "context.properties")
    ? message.context.properties
    : undefined;
  const event = get(message, "event") ? message.event : undefined;
  const timeStamp = message.originalTimestamp;

  return makePayload(
    type,
    userId,
    event,
    traits,
    properties,
    timeStamp,
    segmentConfig
  );
}

function getSegmentConfig(destination, message) {
  let segmentConfig = {};
  const configKeys = Object.keys(destination.Config);
  configKeys.forEach(key => {
    switch (key) {
      case destinationConfigKeys.writeKey:
        segmentConfig.writeKey = `${destination.Config[key]}`;
        break;
    }
  });

  segmentConfig.userId = get(message, "userId")
    ? message.userId
    : message.anonymousId;
  return segmentConfig;
}

function processSingleMessage(message, destination) {
  const segmentConfig = getSegmentConfig(destination, message);
  const properties = getTransformedJSON(message, segmentConfig);
  let respObj = {
    batch: []
  };
  respObj.batch.push(properties);
  return responseBuilderSimple(respObj, segmentConfig);
}

function process(events) {
  let respList = [];
  events.forEach(event => {
    try {
      response = processSingleMessage(event.message, event.destination);
      respList.push(response);
    } catch (error) {
      respList.push({ statusCode: 400, error: error });
    }
  });
  return respList;
}

exports.process = process;
