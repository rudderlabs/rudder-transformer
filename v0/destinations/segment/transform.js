const get = require("get-value");
const { destinationConfigKeys, batchEndpoint } = require("./config");
const {
  defaultPostRequestConfig,
  defaultRequestConfig,
  removeUndefinedAndNullValues
} = require("../util");

function responseBuilderSimple(payload, segmentConfig) {
  const basicAuth = Buffer.from(`${segmentConfig.writeKey}:`).toString(
    "base64"
  );

  const response = defaultRequestConfig();
  const header = {
    "Content-Type": "application/json",
    Authorization: `Basic ${basicAuth}`
  };
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = header;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  response.endpoint = batchEndpoint;
  response.userId = segmentConfig.userId;
  response.statusCode = 200;

  return response;
}

function getTransformedJSON(message, segmentConfig) {
  const { type } = message;
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

  return removeUndefinedAndNullValues({
    type,
    userId,
    event,
    traits,
    properties,
    timeStamp
  });
}

function getSegmentConfig(destination, message) {
  const segmentConfig = {};
  const configKeys = Object.keys(destination.Config);
  configKeys.forEach(key => {
    switch (key) {
      case destinationConfigKeys.writeKey:
        segmentConfig.writeKey = `${destination.Config[key]}`;
        break;
      default:
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
  const respObj = {
    batch: []
  };
  respObj.batch.push(properties);
  return responseBuilderSimple(respObj, segmentConfig);
}

function process(event) {
  return processSingleMessage(event.message, event.destination);
}

exports.process = process;
