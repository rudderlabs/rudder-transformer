const { httpPOST } = require("../../../adapters/network");
const { EventType } = require("../../../constants");
const {
  CustomError,
  constructPayload,
  ErrorMessage,
  defaultRequestConfig,
  defaultPostRequestConfig,
  getValueFromMessage,
  getFieldValueFromMessage,
  defaultPutRequestConfig,
  isDefinedAndNotNull,
  extractCustomFields
} = require("../../util");

const {
  MAPPING_CONFIG,
  CONFIG_CATEGORIES,
  BASE_URL_EU,
  BASE_URL,
  EVENT_NAME_MAPPING,
  BLUESHIFT_TRACK_EXCLUSION,
  BLUESHIFT_IDENTIFY_EXCLUSION
} = require("./config");

function checkValidEventName(str) {
  if (str.indexOf(".") !== -1 || /[0-9]/.test(str) || str.length > 64)
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

  if (!Config.eventApiKey) {
    throw new CustomError(
      "[BLUESHIFT] event Api Keys required for Authentication.",
      400
    );
  }
  let payload = constructPayload(message, MAPPING_CONFIG[category.name]);

  if (!payload) {
    // fail-safety for developer error
    throw new CustomError(ErrorMessage.FailedToConstructPayload, 400);
  }

  event = event.trim();
  if (isDefinedAndNotNull(EVENT_NAME_MAPPING[event])) {
    payload.event = EVENT_NAME_MAPPING[event];
  }
  payload.event = payload.event.replace(/\s+/g, "_");
  if (checkValidEventName(payload.event)) {
    throw new CustomError(
      "[Blueshift] Event shouldn't contain period(.), numeric value and contains not more than 64 characters",
      400
    );
  }
  payload = extractCustomFields(
    message,
    payload,
    [
      "context",
      "context.traits",
      "context.network",
      "context.address",
      "context.os",
      "context.device",
      "properties"
    ],
    BLUESHIFT_TRACK_EXCLUSION
  );

  const response = defaultRequestConfig();

  const baseURL = Config.datacenterEU ? BASE_URL_EU : BASE_URL;
  response.endpoint = `${baseURL}/api/v1/event`;

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
  let payload = constructPayload(message, MAPPING_CONFIG[category.name]);

  if (!payload) {
    // fail-safety for developer error
    throw new CustomError(ErrorMessage.FailedToConstructPayload, 400);
  }

  payload = extractCustomFields(
    message,
    payload,
    [
      "context",
      "context.traits",
      "context.network",
      "context.address",
      "context.os",
      "context.device"
    ],
    BLUESHIFT_IDENTIFY_EXCLUSION
  );
  const response = defaultRequestConfig();

  const baseURL = Config.datacenterEU ? BASE_URL_EU : BASE_URL;
  response.endpoint = `${baseURL}/api/v1/customers`;

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
  if (!payload.list_id) {
    if (payload.name && payload.description) {
      const baseURL = Config.datacenterEU ? BASE_URL_EU : BASE_URL;
      const endpoint = `${baseURL}/api/v1/custom_user_lists/create`;

      const basicAuth = Buffer.from(Config.usersApiKey).toString("base64");
      const requestOptions = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${basicAuth}`
        }
      };
      const res = await httpPOST(endpoint, payload, requestOptions);
      if (res.success === true) {
        payload.list_id = res.response.data.id;
      }
    } else {
      throw new CustomError(
        "[Blueshift]:: name and description are required to create an empty list.",
        400
      );
    }
  }

  const response = defaultRequestConfig();

  const email = getFieldValueFromMessage(message, "email");
  const id = getFieldValueFromMessage(message, "userIdOnly");
  if (id) {
    payload.identifier_key = "customer_id";
    payload.identifier_value = id;
  } else if (email) {
    payload.identifier_key = "email";
    payload.identifier_value = email;
  } else {
    throw new CustomError(
      "[Blueshift] For group call customer_id or email is required to identify customer.",
      400
    );
  }
  const baseURL = Config.datacenterEU ? BASE_URL_EU : BASE_URL;
  response.endpoint = `${baseURL}/api/v1/custom_user_lists/add_user_to_list/${payload.list_id}`;

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
