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
  simpleProcessRouterDest,
  getDestinationExternalID
} = require("../../util");
const {
  ConfigurationError,
  TransformationError,
  InstrumentationError
} = require("../../util/errorTypes");

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
  throw new TransformationError(
    "Payload could not be populated due to wrong input"
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
    throw new ConfigurationError("boardId is a required field");
  }
  const event = get(message, "event");

  if (!event) {
    throw new InstrumentationError(
      "event is not present in the input payloads"
    );
  }

  if (!checkAllowedEventNameFromUI(event, Config)) {
    throw new ConfigurationError(
      "Event Discarded. To allow this event, add this in Allowlist"
    );
  }
  const endpoint = ENDPOINT;

  const processedResponse = await getBoardDetails(endpoint, boardId, apiToken);

  const payload = populatePayload(message, Config, processedResponse);

  return responseBuilder(payload, endpoint, apiToken);
};

const processEvent = async (message, destination) => {
  if (!message.type) {
    throw new InstrumentationError("Event type is required");
  }
  if (!destination.Config.apiToken) {
    throw new ConfigurationError("ApiToken is a required field");
  }
  const messageType = message.type.toLowerCase();
  let response;
  switch (messageType) {
    case EventType.TRACK:
      response = await trackResponseBuilder(message, destination);
      break;
    default:
      throw new InstrumentationError(
        `Event type ${messageType} is not supported`
      );
  }
  return response;
};

const process = async event => {
  return processEvent(event.message, event.destination);
};

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
