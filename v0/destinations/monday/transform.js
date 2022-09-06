const get = require("get-value");
const { EventType } = require("../../../constants");
const { ENDPOINT } = require("./config");
const {
  populatePayload,
  getBoardDetails,
  checkAllowedEventNameFromUI
} = require("./util");
const {
  defaultRequestConfig,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  CustomError,
  getErrorRespEvents,
  getSuccessRespEvents,
  getDestinationExternalID
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
    "Monday]: Payload could not be populated due to wrong input",
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
  const { apiToken } = Config;
  let boardId = getDestinationExternalID(message, "boardId");
  if (!boardId) {
    boardId = Config.boardId;
  }
  if (!boardId) {
    throw new CustomError("Monday]: boardId is a required field", 400);
  }
  const event = get(message, "event");

  if (!event) {
    throw new CustomError(
      "[Monday]: event is not present in the input payloads",
      400
    );
  }

  if (!checkAllowedEventNameFromUI(event, Config)) {
    throw new CustomError(
      "[Monday]:: Event Discarded. To allow this event, add this in Allowlist",
      400
    );
  }
  const endpoint = ENDPOINT;

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
