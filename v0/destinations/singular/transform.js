const { EventType } = require("../../../constants");
const {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  BASE_URL,
  sessionEvents
} = require("./config");
const {
  defaultRequestConfig,
  constructPayload,
  CustomError,
  ErrorMessage,
  defaultGetRequestConfig,
  removeUndefinedAndNullAndEmptyValues
} = require("../../util");

const responseBuilderSimple = (message, category, { Config }) => {
  let eventType = message.event;
  eventType = eventType.trim().replace(/\s+/g, " ");
  const response = defaultRequestConfig();
  if (sessionEvents.includes(eventType)) {
    const sessionPayload = constructPayload(
      message,
      MAPPING_CONFIG[category.sessionName]
    );
    if (!sessionPayload) {
      // fail-safety for developer error
      throw new CustomError(ErrorMessage.FailedToConstructPayload, 400);
    }
    response.endpoint = `${BASE_URL}/launch&a=${Config.ApiKey}`;
    response.params = removeUndefinedAndNullAndEmptyValues(sessionPayload);
  } else {
    const eventPayload = constructPayload(
      message,
      MAPPING_CONFIG[category.eventName]
    );
    if (!eventPayload) {
      // fail-safety for developer error
      throw new CustomError(ErrorMessage.FailedToConstructPayload, 400);
    }
    response.endpoint = `${BASE_URL}/evt&a=${Config.ApiKey}`;
    response.params = removeUndefinedAndNullAndEmptyValues(eventPayload);
  }
  response.method = defaultGetRequestConfig.requestMethod();
  return response;
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw Error("Message Type is not present. Aborting message.");
  }
  const messageType = message.type.toLowerCase();

  let category;
  switch (messageType) {
    case EventType.TRACK:
      category = CONFIG_CATEGORIES.TRACK;
      break;
    default:
      throw new Error("Message type not supported");
  }
  return responseBuilderSimple(message, category, destination);
};

const process = event => {
  return processEvent(event.message, event.destination);
};
exports.process = process;
