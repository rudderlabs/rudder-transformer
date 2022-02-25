const set = require("set-value");
const { EventType } = require("../../../constants");
const {
  CustomError,
  constructPayload,
  defaultRequestConfig,
  removeUndefinedAndNullValues,
  returnArrayOfSubarrays,
  getErrorRespEvents,
  getSuccessRespEvents
} = require("../../util/index");
const { trackMapping, identifyMapping, ENDPOINT } = require("./config");

const trackResponseBuilder = (message, destination) => {
  let payload = constructPayload(message, trackMapping);
  payload.host = destination.Config.host;
  payload.event = message.event;
  payload = removeUndefinedAndNullValues(payload);
  const response = defaultRequestConfig();
  response.endpoint = `${ENDPOINT}/ce`;
  response.params = payload;
  return response;
};

const identifyResponseBuilder = (message, destination) => {
  let payload = constructPayload(message, identifyMapping);
  payload.host = destination.Config.host;
  payload.event = message.event;
  payload = removeUndefinedAndNullValues(payload);
  const response = defaultRequestConfig();
  response.endpoint = `${ENDPOINT}/identify`;
  response.params = payload;
  return response;
};

const process = event => {
  const { message, destination } = event;
  if (!message.type) {
    throw new CustomError(
      "message Type is not present. Aborting message.",
      400
    );
  }

  if (!destination.Config.host && destination.Config.host.length > 0) {
    throw new CustomError("host is not present. Aborting message.", 400);
  }

  const messageType = message.type.toLowerCase();

  let response;
  switch (messageType) {
    case EventType.TRACK:
      response = trackResponseBuilder(message, destination);
      break;
    case EventType.IDENTIFY:
      response = identifyResponseBuilder(message, destination);
      break;
    default:
      throw new CustomError(`message type ${messageType} not supported`, 400);
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
