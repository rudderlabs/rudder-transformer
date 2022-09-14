const get = require("get-value");
const { EventType, MappedToDestinationKey } = require("../../../constants");
const { ConfigCategory } = require("./config");
const {
  defaultRequestConfig,
  defaultPostRequestConfig,
  getFieldValueFromMessage,
  getSuccessRespEvents,
  getErrorRespEvents,
  CustomError,
  addExternalIdToTraits
} = require("../../util");
const { processIdentify, processTrack, processGroup } = require("./util");

/**
 * This function validates the message and builds the response
 * it handles for all the supported events for custify
 * @param {*} message
 * @param {*} destination
 * @returns
 */
const validateAndBuildResponse = async (message, destination) => {
  const messageType = message.type.toLowerCase();
  const response = defaultRequestConfig();
  let responseBody;
  let category;
  switch (messageType) {
    case EventType.IDENTIFY:
      responseBody = processIdentify(message, destination);
      category = ConfigCategory.IDENTIFY;
      break;
    case EventType.TRACK:
      responseBody = processTrack(message, destination);
      category = ConfigCategory.TRACK;
      break;
    case EventType.GROUP:
      responseBody = await processGroup(message, destination);
      category = ConfigCategory.GROUP_USER;
      break;
    default:
      throw new CustomError("Message type not supported", 400);
  }

  if (get(message, MappedToDestinationKey)) {
    addExternalIdToTraits(message);
    responseBody = getFieldValueFromMessage(message, "traits");
  }
  response.body.JSON = responseBody;
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = category.endpoint;
  response.headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${destination.Config.apiKey}`,
    Accept: "application/json"
  };
  response.userId = responseBody.user_id;
  return response;
};

const processSingleMessage = async (message, destination) => {
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Ignoring message.",
      400
    );
  }
  return validateAndBuildResponse(message, destination);
};

const process = event => {
  let response;
  try {
    response = processSingleMessage(event.message, event.destination);
  } catch (error) {
    throw new CustomError(
      error.message || "Unknown error",
      error.status || 400
    );
  }
  return response;
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
