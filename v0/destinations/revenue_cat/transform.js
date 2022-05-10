const set = require("set-value");
const { defaultRequestConfig } = require("rudder-transformer-cdk/build/utils");
const { EventType } = require("../../../constants");
const {
  CustomError,
  constructPayload,
  ErrorMessage,
  defaultPostRequestConfig,
  extractCustomFields,
  defaultGetRequestConfig
} = require("../../util");
const {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  REVENUE_CAT_IDENTIFY_EXCLUSION
} = require("./config");

const trackResponseBuilder = async (message, category, { Config }) => {
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);

  if (!payload) {
    // fail-safety for developer error
    throw new CustomError(ErrorMessage.FailedToConstructPayload, 400);
  }
  const response = defaultRequestConfig();
  response.endpoint = "https://api.revenuecat.com/v1/receipts";

  response.method = defaultPostRequestConfig.requestMethod;
  const basicAuth = Buffer.from(Config.apiKey);
  response.headers = {
    Authorization: `Basic ${basicAuth}`,
    "Content-Type": "application/json"
  };
  response.body.JSON = payload;
  return response;
};

const identifyResponseBuilder = async (message, category, { Config }) => {
  const returnValue = [];

  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);

  if (!payload) {
    // fail-safety for developer error
    throw new CustomError(ErrorMessage.FailedToConstructPayload, 400);
  }
  let customPayload = {};
  customPayload = extractCustomFields(
    message,
    customPayload,
    ["traits", "context.traits"],
    REVENUE_CAT_IDENTIFY_EXCLUSION
  );

  for (const [key, value] of Object.entries(customPayload)) {
    set(payload, `${key}.value`, value.toString());
  }

  const responseGet = defaultRequestConfig();
  responseGet.endpoint = `https://api.revenuecat.com/v1/subscribers/${payload.app_user_id.value}`;
  responseGet.method = defaultGetRequestConfig.requestMethod;
  const basicAuth = Buffer.from(Config.apiKey);
  responseGet.headers = {
    Authorization: `Basic ${basicAuth}`,
    "Content-Type": "application/json"
  };
  returnValue.push(responseGet);

  const response = defaultRequestConfig();
  response.endpoint = `https://api.revenuecat.com/v1/subscribers/${payload.app_user_id.value}/attributes`;

  response.method = defaultPostRequestConfig.requestMethod;

  response.headers = {
    Authorization: `Basic ${basicAuth}`,
    "Content-Type": "application/json"
  };
  response.body.JSON.attributes = payload;
  returnValue.push(response);
  return returnValue;
};

const process = async event => {
  const { message, destination } = event;
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }
  if (!destination.Config.apiKey) {
    throw new CustomError(
      "[REVENUE CAT] Public API Key required for Authentication.",
      400
    );
  }
  const messageType = message.type.toLowerCase();
  const category = CONFIG_CATEGORIES[message.type.toUpperCase()];
  let response;
  switch (messageType) {
    case EventType.TRACK:
      response = await trackResponseBuilder(message, category, destination);
      break;
    case EventType.IDENTIFY:
      response = await identifyResponseBuilder(message, category, destination);
      break;
    default:
      throw new CustomError(`Message type ${messageType} not supported`, 400);
  }
  return response;
};

module.exports = { process };
