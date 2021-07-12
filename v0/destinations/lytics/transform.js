const { EventType } = require("../../../constants");
const {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  ENDPOINT,
  forFirstName,
  forLastName
} = require("./config");
const {
  constructPayload,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  defaultRequestConfig,
  flattenJson,
  getSuccessRespEvents,
  getErrorRespEvents,
  CustomError
} = require("../../util");

const responseBuilderSimple = (message, category, destination) => {
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  const response = defaultRequestConfig();
  const { stream, apiKey } = destination.Config;
  response.endpoint = `${ENDPOINT}/${stream}?access_token=${apiKey}`;
  response.method = defaultPostRequestConfig.requestMethod;
  const flattenedPayload = removeUndefinedAndNullValues(flattenJson(payload));
  forFirstName.forEach(key => {
    if (flattenedPayload[key]) {
      flattenedPayload.first_name = flattenedPayload[key];
      delete flattenedPayload[key];
    }
  });
  forLastName.forEach(key => {
    if (flattenedPayload[key]) {
      flattenedPayload.last_name = flattenedPayload[key];
      delete flattenedPayload[key];
    }
  });
  response.body.JSON = flattenedPayload;
  response.headers = {
    "Content-Type": "application/json"
  };
  return response;
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }
  const messageType = message.type.toLowerCase();
  let category;
  switch (messageType) {
    case EventType.IDENTIFY:
      category = CONFIG_CATEGORIES.IDENTIFY;
      break;
    case EventType.PAGE:
    case EventType.SCREEN:
      category = CONFIG_CATEGORIES.PAGESCREEN;
      break;
    case EventType.TRACK:
      category = CONFIG_CATEGORIES.TRACK;
      break;
    default:
      throw new CustomError("Message type not supported", 400);
  }
  // build the response
  return responseBuilderSimple(message, category, destination);
};

const process = event => {
  return processEvent(event.message, event.destination);
};

const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const respList = await Promise.all(
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
          error.response
            ? error.response.status
            : error.code
            ? error.code
            : 400,
          error.message || "Error occurred while processing payload."
        );
      }
    })
  );
  return respList;
};

module.exports = { process, processRouterDest };
