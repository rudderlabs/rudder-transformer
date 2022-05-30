const get = require("get-value");
const { batchEndpoint } = require("./config");
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
  response.statusCode = 200;

  return response;
}

function getTransformedJSON(message) {
  const { type, anonymousId, userId } = message;
  if (!type) {
    throw new Error("Event type is required");
  }

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

function getAttributionConfig(destination) {
  const { writeKey } = destination.Config;
  if (!writeKey) {
    throw new Error("No writeKey in config");
  }

  return { writeKey };
}

function processSingleMessage(message, destination) {
  const attributionConfig = getAttributionConfig(destination);
  const properties = getTransformedJSON(message);
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
