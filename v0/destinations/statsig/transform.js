const { EventType } = require("../../../constants");
const {
  defaultPostRequestConfig,
  defaultRequestConfig,
  CustomError
} = require("../../util");
const { ENDPOINT } = require("./config");

function process(event) {
  const { message, destination } = event;

  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }
  const messageType = message.type.toLowerCase();

  switch (messageType) {
    case EventType.IDENTIFY:
    case EventType.PAGE:
    case EventType.SCREEN:
    case EventType.TRACK:
    case EventType.ALIAS:
    case EventType.GROUP:
      break;
    default:
      throw new CustomError("Message type not supported", 400);
  }

  const response = defaultRequestConfig();
  const { secretKey } = destination.Config;

  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = message;
  response.headers = {
    "content-type": "application/json",
    "STATSIG-API-KEY": secretKey
  };

  response.endpoint = ENDPOINT;

  return response;
}

exports.process = process;
