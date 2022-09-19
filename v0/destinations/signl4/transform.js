const { EventType } = require("../../../constants");
const { BASE_URL } = require("./config");
const { populatePayload } = require("./utils");
const {
  defaultRequestConfig,
  defaultPostRequestConfig,
  CustomError,
  getErrorRespEvents,
  getSuccessRespEvents,
  removeUndefinedAndNullAndEmptyValues
} = require("../../util");

const responseBuilder = (payload, endpoint) => {
  if (payload) {
    const response = defaultRequestConfig();
    response.endpoint = endpoint;
    response.headers = {
      "Content-Type": "application/json"
    };
    response.method = defaultPostRequestConfig.requestMethod;
    response.body.JSON = removeUndefinedAndNullAndEmptyValues(payload);
    return response;
  }
  throw new CustomError(
    "Payload could not be populated due to wrong input",
    400
  );
};

/**
 * This function is used to build the response for track call.
 * @param {*} message
 * @param {*} param1
 * @returns
 */
const trackResponseBuilder = (message, { Config }) => {
  const { apiKey } = Config;
  const { event } = message;

  if (!event) {
    throw new CustomError(
      "[SIGNL4]: event is not present in the input payload",
      400
    );
  }

  const endpoint = `${BASE_URL}/${apiKey}`;

  const payload = populatePayload(message, Config);

  return responseBuilder(payload, endpoint);
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }
  if (!destination.Config.apiKey) {
    throw new CustomError("apiKey is a required field", 400);
  }
  const messageType = message.type.toLowerCase();
  let response;
  switch (messageType) {
    case EventType.TRACK:
      response = trackResponseBuilder(message, destination);
      break;
    default:
      throw new CustomError(`Message type ${messageType} not supported`, 400);
  }
  return response;
};

const process = async event => {
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
