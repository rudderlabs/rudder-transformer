const _ = require("lodash");

const { EventType } = require("../../../constants");
const {
  defaultRequestConfig,
  defaultPostRequestConfig
} = require("../../util");

const { endpoint } = require("./config");

function isBlank(value) {
  return _.isEmpty(_.toString(value));
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
  const messageType = message.type.toLowerCase();

  if (isBlank(message.userId)) {
    throw new Error("Missing required user id");
  }

  switch (messageType) {
    case EventType.IDENTIFY:
    case EventType.TRACK:
    case EventType.GROUP:
      return buildResponse(message, destination);
    default:
      throw new Error("Message type not supported");
  }
}

function process(event) {
  return processSingleMessage(event.message, event.destination);
}

exports.process = process;
