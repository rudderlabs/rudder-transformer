const { EventType } = require("../../../constants");
const {
  defaultRequestConfig,
  defaultPostRequestConfig,
  getFieldValueFromMessage,
  isBlank
} = require("../../util");

const { endpoint } = require("./config");

function normalizeMessage(message) {
  return {
    ...message,
    type: message.type && message.type.toLowerCase(),
    userId: getFieldValueFromMessage(message, "userIdOnly")
  };
}

function buildResponse(message, destination) {
  const response = defaultRequestConfig();
  const { pushKey } = destination.Config;

  response.endpoint = endpoint;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    "Content-Type": "application/json",
    Authorization: `Push ${pushKey}`
  };
  response.body.JSON = message;
  response.statusCode = 200;

  return response;
}

function processSingleMessage(message, destination) {
  if (isBlank(message.userId)) {
    throw new Error("Missing required user id");
  }

  switch (message.type) {
    case EventType.IDENTIFY:
    case EventType.TRACK:
    case EventType.GROUP:
      return buildResponse(message, destination);
    default:
      throw new Error("Message type not supported");
  }
}

function process(event) {
  return processSingleMessage(
    normalizeMessage(event.message),
    event.destination
  );
}

exports.process = process;
