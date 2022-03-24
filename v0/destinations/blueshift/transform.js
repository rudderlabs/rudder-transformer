const { EventType } = require("../../../constants");
const {
  CustomError,
  constructPayload,
  ErrorMessage,
  defaultRequestConfig,
  defaultPostRequestConfig,
  getValueFromMessage,
  getFieldValueFromMessage,
  removeUndefinedAndNullValues
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

const responseBuilderSimple = (message, category, destination) => {
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);

  if (!payload) {
    // fail-safety for developer error
    throw new CustomError(ErrorMessage.FailedToConstructPayload, 400);
  }

  if (EventType.GROUP === message.type.toLowerCase()) {
    const customer = removeUndefinedAndNullValues({
      id: getFieldValueFromMessage(message, "userId"),
      email: getFieldValueFromMessage(message, "email")
    });
    if (!customer.id && !customer.email) {
      throw new CustomError(
        "customer_id or email is required to identify customer.",
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
  }

  const response = defaultRequestConfig();
  let endpoint;
  if (destination.Config.datacenterEU) {
    endpoint = `${BASE_URL}${category.endpoint}`;
  } else {
    endpoint = `${BASE_URL_EU}${category.endpoint}`;
  }

  if (EventType.GROUP === message.type.toLowerCase()) {
    response.endpoint = endpoint.replace(":list_id", payload.list_id);
  } else {
    response.endpoint = endpoint;
  }

  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    "Content-Type": "application/json"
  };
  response.body.JSON = payload;
  return response;
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new CustomError(ErrorMessage.TypeNotSupported, 400);
  }

  const category = CONFIG_CATEGORIES[message.type.toUpperCase()];
  if (!category) {
    throw new CustomError(ErrorMessage.TypeNotSupported, 400);
  }
  if (EventType.TRACK === message.type.toLowerCase()) {
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
        "[Blueshift] Event name doesn't contain period(.), whitespace and numeric value.",
        400
      );
    }
  }

  return responseBuilderSimple(message, category, destination);
};

const process = event => {
  return processEvent(event.message, event.destination);
};

module.exports = { process };
