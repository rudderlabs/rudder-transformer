const set = require("set-value");
const get = require("get-value");
const {
  defaultRequestConfig,
  CustomError,
  constructPayload
} = require("../../util");
const { EventType } = require("../../../constants");
const { CONFIG_CATEGORIES, MAPPING_CONFIG, BASE_URL } = require("./config");

const trackResponseBuilder = async (message, category, destination) => {
  const response = defaultRequestConfig();

  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  const authToken = get(destination, "Config.authToken");
  set(payload, "auth_token", authToken);

  response.endpoint = `${BASE_URL}/events/track`;
  response.body.JSON = payload;

  return response;
};

const identifyResponseBuilder = async (message, category, destination) => {
  const response = defaultRequestConfig();

  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  const authToken = get(destination, "Config.authToken");
  set(payload, "auth_token", authToken);

  response.endpoint = `${BASE_URL}/users/track`;
  response.body.JSON = payload;

  return response;
};

const aliasResponseBuilder = async (message, category, destination) => {
  const response = defaultRequestConfig();

  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  const authToken = get(destination, "Config.authToken");
  set(payload, "auth_token", authToken);

  response.method = "PUT";
  response.endpoint = `${BASE_URL}/users/reidentify`;
  response.body.JSON = payload;

  return response;
};

const process = async event => {
  const { message, destination } = event;
  const authToken = get(destination, "Config.authToken");

  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }
  if (!authToken) {
    throw new CustomError(
      "[VERO] Auth Token required for Authentication.",
      400
    );
  }

  let response;
  const messageType = message.type.toLowerCase();
  const category = CONFIG_CATEGORIES[message.type.toUpperCase()];
  switch (messageType) {
    case EventType.TRACK:
      response = await trackResponseBuilder(message, category, destination);
      break;
    case EventType.IDENTIFY:
      response = await identifyResponseBuilder(message, category, destination);
      break;
    case EventType.ALIAS:
      response = await aliasResponseBuilder(message, category, destination);
      break;
    default:
      throw new CustomError(`Message type ${messageType} not supported`, 400);
  }
  return response;
};

module.exports = { process };
