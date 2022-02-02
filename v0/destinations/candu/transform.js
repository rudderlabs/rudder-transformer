const { EventType } = require("../../../constants");
const {
  CustomError,
  defaultRequestConfig,
  constructPayload,
  getSuccessRespEvents,
  getErrorRespEvents,
  removeUndefinedAndNullAndEmptyValues
} = require("../../util");
const { endpoint, identifyDataMapping, trackDataMapping } = require("./config");

const responseBuilder = (body, { Config }) => {
  const payload = body;
  payload.context = {
    source: "RudderStack"
  };
  const response = defaultRequestConfig();
  response.endpoint = endpoint;
  response.body.JSON = removeUndefinedAndNullAndEmptyValues(payload);
  const basicAuth = Buffer.from(Config.apiKey).toString("base64");
  response.headers = {
    Authorization: `Basic ${basicAuth}`,
    "Content-Type": "application/json"
  };
  return response;
};

const processEvent = (message, destination) => {
  if (!destination.Config.apiKey.trim())
    throw new CustomError(`[CANDU]:: apiKey cannot be empty.`, 400);
  if (!message.type) {
    throw new CustomError(
      "[CANDU]:: Message Type is not present. Aborting message.",
      400
    );
  }
  const messageType = message.type.toLowerCase();
  let payload = {};
  switch (messageType) {
    case EventType.IDENTIFY:
      payload = constructPayload(message, identifyDataMapping);
      payload.type = "identify";
      break;
    case EventType.TRACK:
      payload = constructPayload(message, trackDataMapping);
      payload.type = "track";
      break;
    default:
      throw new CustomError(
        `[CANDU]:: Message type ${messageType} not supported.`,
        400
      );
  }
  return responseBuilder(payload, destination);
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
