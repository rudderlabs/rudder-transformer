const get = require("get-value");
const { destinationConfigKeys, batchEndpoint } = require("./config");
const {
  defaultPostRequestConfig,
  defaultRequestConfig,
  removeUndefinedAndNullValues,
  getFieldValueFromMessage
} = require("../../util");

function responseBuilderSimple(payload, attributionConfig) {
  const basicAuth = Buffer.from(`${attributionConfig.writeKey}:`).toString(
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
  response.userId = attributionConfig.userId;
  response.statusCode = 200;

  return response;
}

function getTransformedJSON(message, attributionConfig) {
  const { type, anonymousId } = message;
  const { userId } = attributionConfig;
  const traits = getFieldValueFromMessage(message, "traits");
  if (traits && traits.anonymousId) {
    delete traits.anonymousId;
  }
  const properties = get(message, "properties")
    ? message.properties
    : undefined;
  const event = get(message, "event") ? message.event : undefined;
  const timeStamp = getFieldValueFromMessage(message, "timestamp");

  return removeUndefinedAndNullValues({
    anonymousId,
    type,
    userId,
    event,
    traits,
    properties,
    timeStamp
  });
}

function getAttributionConfig(destination, message) {
  const attributionConfig = {};
  const configKeys = Object.keys(destination.Config);
  configKeys.forEach(key => {
    switch (key) {
      case destinationConfigKeys.writeKey:
        attributionConfig.writeKey = `${destination.Config[key]}`;
        break;
      default:
        break;
    }
  });

  attributionConfig.userId = getFieldValueFromMessage(message, "userId");
  return attributionConfig;
}

function processSingleMessage(message, destination) {
  const attributionConfig = getAttributionConfig(destination, message);
  const properties = getTransformedJSON(message, attributionConfig);
  const respObj = {
    batch: []
  };
  respObj.batch.push(properties);
  return responseBuilderSimple(respObj, attributionConfig);
}

function process(event) {
  return processSingleMessage(event.message, event.destination);
}

exports.process = process;
