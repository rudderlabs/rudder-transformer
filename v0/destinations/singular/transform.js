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

const responseBuilderSimple = (message, { Config }) => {
  let eventType = message.event;
  eventType = eventType.trim().replace(/\s+/g, " ");
  const response = defaultRequestConfig();
  if (sessionEvents.includes(eventType)) {
    const sessionPayload = constructPayload(
      message,
      MAPPING_CONFIG[CONFIG_CATEGORIES.SESSION.name]
    );
    if (!sessionPayload) {
      // fail-safety for developer error
      throw new CustomError(ErrorMessage.FailedToConstructPayload, 400);
    }
    /*
        if att_authorization_status is true then dnt will be false,
        else by default dnt value is true
    */
    sessionPayload.dnt = !sessionPayload.att_authorization_status;
    response.endpoint = `${BASE_URL}/launch&a=${Config.apiKey}`;
    response.params = removeUndefinedAndNullAndEmptyValues(sessionPayload);
  } else {
    const eventPayload = constructPayload(
      message,
      MAPPING_CONFIG[CONFIG_CATEGORIES.EVENT.name]
    );
    if (!eventPayload) {
      // fail-safety for developer error
      throw new CustomError(ErrorMessage.FailedToConstructPayload, 400);
    }
    response.endpoint = `${BASE_URL}/evt&a=${Config.apiKey}`;
    response.params = removeUndefinedAndNullAndEmptyValues(eventPayload);
  }
  response.method = defaultGetRequestConfig.requestMethod;
  return response;
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw Error("Message Type is not present. Aborting message.");
  }
  const messageType = message.type.toLowerCase();

  if (messageType === "track")
    return responseBuilderSimple(message, destination);

  throw new Error("[Singular]: Message type not supported");
};

const process = event => {
  return processEvent(event.message, event.destination);
};
exports.process = process;
