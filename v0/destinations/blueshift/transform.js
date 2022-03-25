const { EventType } = require("../../../constants");
const {
  CustomError,
  constructPayload,
  ErrorMessage,
  defaultRequestConfig,
  defaultPostRequestConfig,
  getValueFromMessage,
  getFieldValueFromMessage,
  removeUndefinedAndNullValues,
  defaultPutRequestConfig
} = require("../../util");

const {
  MAPPING_CONFIG,
  CONFIG_CATEGORIES,
  BASE_URL_EU,
  BASE_URL
} = require("./config");

function checkValidEventName(str) {
  if (
    str.indexOf(".") !== -1 ||
    str.indexOf(" ") !== -1 ||
    /[0-9]/.test(str) ||
    str.length > 64
  )
    return true;
  return false;
}

const trackResponseBuilder = async (message, category, { Config }) => {
  let event = getValueFromMessage(message, "event");
  if (!event) {
    throw new CustomError(
      "[Blueshift] property:: event is required for track call",
      400
    );
  }
  event = event.trim().toLowerCase();
  if (checkValidEventName(event)) {
    throw new CustomError(
      "[Blueshift] Event name doesn't contain period(.), whitespace, numeric value and contains not more than 64 characters",
      400
    );
  }
  if (!Config.eventApiKey) {
    throw new CustomError(
      "[BLUESHIFT] event Api Keys required for Authentication.",
      400
    );
  }
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);

  if (!payload) {
    // fail-safety for developer error
    throw new CustomError(ErrorMessage.FailedToConstructPayload, 400);
  }
  const response = defaultRequestConfig();

  if (Config.datacenterEU) {
    response.endpoint = `${BASE_URL_EU}/api/v1/event`;
  } else {
    response.endpoint = `${BASE_URL}/api/v1/event`;
  }
  response.method = defaultPostRequestConfig.requestMethod;
  const basicAuth = Buffer.from(Config.eventApiKey).toString("base64");
  response.headers = {
    Authorization: `Basic ${basicAuth}`,
    "Content-Type": "application/json"
  };
  response.body.JSON = payload;
  return response;
};

const identifyResponseBuilder = async (message, category, { Config }) => {
  if (!Config.usersApiKey) {
    throw new CustomError(
      "[BLUESHIFT] User API Key required for Authentication.",
      400
    );
  }
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);

  if (!payload) {
    // fail-safety for developer error
    throw new CustomError(ErrorMessage.FailedToConstructPayload, 400);
  }
  const response = defaultRequestConfig();

  if (Config.datacenterEU) {
    response.endpoint = `${BASE_URL_EU}/api/v1/customers`;
  } else {
    response.endpoint = `${BASE_URL}/api/v1/customers`;
  }
  response.method = defaultPostRequestConfig.requestMethod;
  const basicAuth = Buffer.from(Config.usersApiKey).toString("base64");
  response.headers = {
    Authorization: `Basic ${basicAuth}`,
    "Content-Type": "application/json"
  };
  response.body.JSON = payload;
  return response;
};

const groupResponseBuilder = async (message, category, { Config }) => {
  if (!Config.usersApiKey) {
    throw new CustomError(
      "[BLUESHIFT] User API Key required for Authentication.",
      400
    );
  }
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);

  if (!payload) {
    // fail-safety for developer error
    throw new CustomError(ErrorMessage.FailedToConstructPayload, 400);
  }
  const response = defaultRequestConfig();

  const customer = removeUndefinedAndNullValues({
    id: getFieldValueFromMessage(message, "userId"),
    email: getFieldValueFromMessage(message, "email")
  });
  if (!customer.id && !customer.email) {
    throw new CustomError(
      "[Blueshift] customer_id or email is required to identify customer.",
      400
    );
  }
  if (customer.id) {
    payload.identifier_key = "customer_id";
    payload.identifier_value = customer.id;
  } else {
    payload.identifier_key = "email";
    payload.identifier_value = customer.email;
  }

  if (Config.datacenterEU) {
    response.endpoint = `${BASE_URL_EU}/api/v1/custom_user_lists/add_user_to_list/${payload.list_id}`;
  } else {
    response.endpoint = `${BASE_URL}/api/v1/custom_user_lists/add_user_to_list/${payload.list_id}`;
  }

  response.method = defaultPutRequestConfig.requestMethod;
  const basicAuth = Buffer.from(Config.usersApiKey).toString("base64");
  response.headers = {
    Authorization: `Basic ${basicAuth}`,
    "Content-Type": "application/json"
  };
  response.body.JSON = payload;
  return response;
};

const process = async event => {
  const { message, destination } = event;
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
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
    case EventType.GROUP:
      response = await groupResponseBuilder(message, category, destination);
      break;
    default:
      throw new CustomError(`Message type ${messageType} not supported`, 400);
  }
  return response;
};

module.exports = { process };
