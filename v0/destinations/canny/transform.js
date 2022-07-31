const { EventType } = require("../../../constants");
const { ConfigCategory, mappingConfig, BASE_URL } = require("./config");
const {
  defaultRequestConfig,
  constructPayload,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  CustomError
} = require("../../util");

const responseBuilder = (payload, apiKey, endpoint) => {
  if (payload) {
    const response = defaultRequestConfig();
    response.endpoint = `${BASE_URL}${endpoint}`;
    response.headers = {
      Authorization: `Basic ${apiKey}`,
      "Content-Type": "application/json"
    };
    response.method = defaultPostRequestConfig.requestMethod;
    response.body.JSON = removeUndefinedAndNullValues(payload);
    return response;
  }
};

const identifyResponseBuilder = (message, { Config }) => {
  const { apiKey } = Config;

  if (!apiKey) {
    throw new CustomError("API Key is not present. Aborting message.", 400);
  }

  const payload = constructPayload(
    message,
    mappingConfig[ConfigCategory.IDENTIFY.name]
  );

  if (!payload.userId) {
    throw new CustomError("UserId is not present. Aborting message.", 400);
  }
  if (!payload.name) {
    throw new CustomError("Name is not present. Aborting message.", 400);
  }

  const { endpoint } = ConfigCategory.IDENTIFY;

  return responseBuilder(payload, apiKey, endpoint);
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }
  const messageType = message.type.toLowerCase();

  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = identifyResponseBuilder(message, destination);
      break;
    // case EventType.TRACK:
    //   response = trackResponseBuilder(message, destination);
    //   break;
    default:
      throw new CustomError("Message type not supported", 400);
  }
  return response;
};

const process = event => {
  return processEvent(event.message, event.destination);
};

module.exports = { process };
