/* eslint-disable no-underscore-dangle */
const { EventType } = require("../../../constants");

const {
  constructPayload,
  defaultRequestConfig,
  removeUndefinedAndNullValues,
  getSuccessRespEvents,
  getErrorRespEvents,
  CustomError,
  generateUUID
} = require("../../util");

const { ConfigCategory, mappingConfig } = require("./config");

// build final response
function buildResponse(payload, endpoint) {
  const response = defaultRequestConfig();
  response.endpoint = endpoint;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  response.headers = {
    "Content-Type": "application/json"
  };
  return response;
}

// process page call
function processPage(message, shynetServiceUrl) {
  const requestJson = constructPayload(
    message,
    mappingConfig[ConfigCategory.PAGE.name]
  );

  // generating UUID
  requestJson.idempotency = message.messageId || generateUUID();
  return buildResponse(requestJson, shynetServiceUrl);
}

function process(event) {
  const { message, destination } = event;
  const { shynetServiceUrl } = destination.Config;

  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }

  const messageType = message.type.toLowerCase();

  switch (messageType) {
    case EventType.PAGE:
      return processPage(message, shynetServiceUrl);
    default:
      throw new CustomError("Message type is not supported", 400);
  }
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
