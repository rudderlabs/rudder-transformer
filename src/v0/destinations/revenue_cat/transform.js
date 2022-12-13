const set = require("set-value");
const { defaultRequestConfig } = require("rudder-transformer-cdk/build/utils");
const { EventType } = require("../../../constants");
const {
  constructPayload,
  ErrorMessage,
  defaultPostRequestConfig,
  extractCustomFields,
  defaultGetRequestConfig,
  getFieldValueFromMessage
} = require("../../util");
const {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  REVENUE_CAT_IDENTIFY_EXCLUSION,
  BASE_URL
} = require("./config");
const {
  ConfigurationError,
  TransformationError,
  InstrumentationError
} = require("../../util/errorTypes");

const trackResponseBuilder = async (message, category, { Config }) => {
  if (!Config.xPlatform) {
    throw new ConfigurationError("X-Platform is required field");
  }
  let payload = constructPayload(message, MAPPING_CONFIG[category.name]);

  // if multiple products were there, then we sent response for each product.
  const productList = message.properties?.products;
  if (productList && Array.isArray(productList)) {
    const responseArray = [];
    const finalPayload = payload;
    for (const product of productList) {
      const productDetails = constructPayload(
        product,
        MAPPING_CONFIG[CONFIG_CATEGORIES.PROPERTY.name]
      );
      payload = { ...payload, ...productDetails };
      const response = defaultRequestConfig();
      response.endpoint = `${BASE_URL}/receipts`;

      response.method = defaultPostRequestConfig.requestMethod;
      const basicAuth = Buffer.from(Config.apiKey);
      response.headers = {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/json",
        "X-Platform": `${Config.xPlatform}`
      };
      response.body.JSON = payload;
      responseArray.push(response);
      payload = finalPayload;
    }
    return responseArray;
  }

  const response = defaultRequestConfig();
  response.endpoint = `${BASE_URL}/receipts`;

  response.method = defaultPostRequestConfig.requestMethod;
  const basicAuth = Buffer.from(Config.apiKey);
  response.headers = {
    Authorization: `Basic ${basicAuth}`,
    "Content-Type": "application/json",
    "X-Platform": `${Config.xPlatform}`
  };
  response.body.JSON = payload;
  return response;
};

const identifyResponseBuilder = async (message, category, { Config }) => {
  const returnValue = [];

  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);

  // In case there is firstName and lastName we generate name by ${firstName} ${lastName}
  const contactName = getFieldValueFromMessage(message, "name");
  if (!contactName) {
    const fName = getFieldValueFromMessage(message, "firstName");
    const lName = getFieldValueFromMessage(message, "lastName");
    const name = `${fName ? fName.trim() : ""} ${
      lName ? lName.trim() : ""
    }`.trim();
    if (name) {
      set(payload, "$displayName.value", name);
    }
  }

  if (!payload) {
    // fail-safety for developer error
    throw new TransformationError(ErrorMessage.FailedToConstructPayload, 400);
  }
  let customPayload = {};
  customPayload = extractCustomFields(
    message,
    customPayload,
    ["context.traits", "traits"],
    REVENUE_CAT_IDENTIFY_EXCLUSION
  );

  Object.entries(customPayload).forEach(([key, value]) => {
    set(payload, `${key}.value`, value.toString());
  });

  const responseGet = defaultRequestConfig();
  responseGet.endpoint = `${BASE_URL}/subscribers/${payload.app_user_id.value}`;
  responseGet.method = defaultGetRequestConfig.requestMethod;
  const basicAuth = Buffer.from(Config.apiKey);
  responseGet.headers = {
    Authorization: `Basic ${basicAuth}`,
    "Content-Type": "application/json"
  };
  returnValue.push(responseGet);

  const response = defaultRequestConfig();
  response.endpoint = `${BASE_URL}/subscribers/${payload.app_user_id.value}/attributes`;

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
    throw new InstrumentationError("Event type is required");
  }
  if (!destination.Config.apiKey) {
    throw new ConfigurationError("Public API Key required for Authentication");
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
      throw new InstrumentationError(
        `Message type ${messageType} is not supported`
      );
  }
  return response;
};

module.exports = { process };
