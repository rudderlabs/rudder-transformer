const {
  CustomError,
  constructPayload,
  ErrorMessage,
  defaultRequestConfig,
  defaultPostRequestConfig,
  getValueFromMessage
} = require("../../util");

const { MAPPING_CONFIG, CONFIG_CATEGORIES } = require("./config");

function checkValidEventName(str) {
  if (str.indexOf(".") !== -1 && str.indexOf(" ") !== -1 && !/\d/.test(str))
    return true;
  return false;
}

const responseBuilderSimple = (message, category, destination) => {
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);

  if (!payload) {
    // fail-safety for developer error
    throw new CustomError(ErrorMessage.FailedToConstructPayload, 400);
  }

  const response = defaultRequestConfig();
  if (destination.Config.datacenterEU) {
    response.endpoint = "https://api.eu.getblueshift.com/api/v1/event";
  } else {
    response.endpoint = "https://api.getblueshift.com/api/v1/event";
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
    throw new CustomError(ErrorMessage.TypeNotFound, 400);
  }

  const category = CONFIG_CATEGORIES[message.type.toUpperCase()];
  if (!category) {
    throw new CustomError(ErrorMessage.TypeNotSupported, 400);
  }

  let event = getValueFromMessage(message, "event");
  if (!event) {
    throw new CustomError("event is required for track call", 400);
  }
  event = event.trim().toLowerCase();
  if (!checkValidEventName(event)) {
    throw new CustomError(
      "event name doesn't contain period(.), whitespace and numeric value.",
      400
    );
  }

  return responseBuilderSimple(message, category, destination);
};

const process = event => {
  return processEvent(event.message, event.destination);
};

module.exports = { process };
