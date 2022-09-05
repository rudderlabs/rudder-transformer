const get = require("get-value");
const { EventType } = require("../../../constants");
const { ENDPOINT } = require("./config");
const { populatePayload, getBoardDetails } = require("./util");
const {
  defaultRequestConfig,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  CustomError,
  getErrorRespEvents,
  getSuccessRespEvents
} = require("../../util");

const responseBuilder = (payload, endpoint, apiToken) => {
  if (payload) {
    const response = defaultRequestConfig();
    response.endpoint = endpoint;
    response.headers = {
      "Content-Type": "application/json",
      Authorization: `${apiToken}`
    };
    response.method = defaultPostRequestConfig.requestMethod;
    response.body.JSON = removeUndefinedAndNullValues(payload);
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
const trackResponseBuilder = async (message, { Config }) => {
  const { apiToken, boardId } = Config;
  const event = get(message, "event");
  const endpoint = ENDPOINT;
  if (!event) {
    throw new CustomError(
      "[Monday]: event is not present in the input payloads",
      400
    );
  }

  const processedResponse = await getBoardDetails(endpoint, boardId, apiToken);

  const payload = populatePayload(message, Config, processedResponse);

  return responseBuilder(payload, endpoint, apiToken);
};

const processEvent = async (message, destination) => {
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }
  if (!destination.Config.apiToken) {
    throw new CustomError("[Monday]: apiToken is a required field", 400);
  }
  if (!destination.Config.boardId) {
    throw new CustomError("[Monday]: boardId is a required field", 400);
  }
  const messageType = message.type.toLowerCase();
  let response;
  switch (messageType) {
    case EventType.TRACK:
      response = await trackResponseBuilder(message, destination);
      break;
    default:
      throw new CustomError(`Message type ${messageType} not supported`, 400);
  }
  return response;
};

const process = event => {
  return processEvent(event.message, event.destination);
};

const processRouterDest = inputs => {
  if (!Array.isArray(inputs) || inputs.length === 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const respList = Promise.all(
    inputs.map(async input => {
      try {
        const message = input.message.statusCode
          ? input.message
          : process(input);
        return getSuccessRespEvents(
          message,
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
