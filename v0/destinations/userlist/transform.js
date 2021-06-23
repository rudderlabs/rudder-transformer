const { EventType } = require("../../../constants");
const {
  defaultRequestConfig,
  defaultPostRequestConfig,
  getFieldValueFromMessage,
  isBlank,
  getErrorRespEvents,
  getSuccessRespEvents,
  CustomError
} = require("../../util");

const { endpoint } = require("./config");

// ------------------------------------------------
// Userlist built a custom endpoint for Rudderstack that processes the messages according to our spec.
// There’s no real documentation about it.
// Their regular endpoint is documented at
//
// https://userlist.com/docs/getting-started/integration-guide/
// ------------------------------------------------

function normalizeMessage(message) {
  return {
    ...message,
    type: message.type && message.type.toLowerCase(),
    userId: getFieldValueFromMessage(message, "userIdOnly")
  };
}

function buildResponse(message, destination) {
  const response = defaultRequestConfig();
  const { pushKey } = destination.Config;

  response.endpoint = endpoint;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    "Content-Type": "application/json",
    Authorization: `Push ${pushKey}`
  };
  response.body.JSON = message;
  response.statusCode = 200;

  return response;
}

function processSingleMessage(message, destination) {
  if (isBlank(message.userId)) {
    throw new CustomError("Missing required user id", 400);
  }

  switch (message.type) {
    case EventType.IDENTIFY:
    case EventType.TRACK:
    case EventType.GROUP:
      return buildResponse(message, destination);
    default:
      throw new CustomError("Message type not supported", 400);
  }
}

function process(event) {
  return processSingleMessage(
    normalizeMessage(event.message),
    event.destination
  );
}

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
