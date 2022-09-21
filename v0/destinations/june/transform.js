const { EventType } = require("../../../constants");
const {
  defaultRequestConfig,
  getErrorRespEvents,
  getSuccessRespEvents,
  constructPayload,
  removeUndefinedAndNullValues,
  defaultPostRequestConfig,
  CustomError
} = require("../../util");
const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require("./config");

const responseBuilder = (payload, endpoint, destination) => {
  if (payload) {
    const response = defaultRequestConfig();
    const { apiKey } = destination.Config;
    response.endpoint = endpoint;
    response.headers = {
      "Content-Type": "application/json",
      Authorization: `Basic ${apiKey}`
    };
    response.method = defaultPostRequestConfig.requestMethod;
    response.body.JSON = removeUndefinedAndNullValues(payload);
    return response;
  }
  // fail-safety for developer error
  throw new CustomError("[ JUNE ]:: Payload could not be constructed", 400);
};

const identifyResponseBuilder = (message, destination) => {
  const { endpoint } = CONFIG_CATEGORIES.IDENTIFY;
  const payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name]
  );
  return responseBuilder(payload, endpoint, destination);
};

const trackResponseBuilder = (message, destination) => {
  const { endpoint } = CONFIG_CATEGORIES.TRACK;
  const { groupId } = message.properties || {};
  let payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK.name]
  );

  if (groupId) {
    payload = { ...payload, context: { groupId } };
  }

  return responseBuilder(payload, endpoint, destination);
};

const groupResponseBuilder = (message, destination) => {
  const { endpoint } = CONFIG_CATEGORIES.GROUP;
  const payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.GROUP.name]
  );
  return responseBuilder(payload, endpoint, destination);
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new CustomError(
      "[ JUNE ]:: Message Type is not present. Aborting message.",
      400
    );
  }

  const messageType = message.type.toLowerCase();
  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = identifyResponseBuilder(message, destination);
      break;
    case EventType.TRACK:
      response = trackResponseBuilder(message, destination);
      break;
    case EventType.GROUP:
      response = groupResponseBuilder(message, destination);
      break;
    default:
      throw new CustomError(
        `[ JUNE ]:: Message type ${messageType} not supported.`,
        400
      );
  }
  return response;
};

const process = event => {
  return processEvent(event.message, event.destination);
};

const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  return Promise.all(
    inputs.map(async input => {
      try {
        if (input.message.statusCode) {
          // already transformed event
          return getSuccessRespEvents(
            input.message,
            [input.metadata],
            input.destination
          );
        }
        // if not transformed
        return getSuccessRespEvents(
          await process(input),
          [input.metadata],
          input.destination
        );
      } catch (error) {
        return getErrorRespEvents(
          [input.metadata],
          error.response ? error.response.status : error.code || 400,
          error.message || "Error occurred while processing payload."
        );
      }
    })
  );
};

module.exports = { process, processRouterDest };
