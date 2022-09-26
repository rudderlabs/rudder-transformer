const { EventType } = require("../../../constants");
const {
  CustomError,
  defaultRequestConfig,
  constructPayload,
  removeUndefinedAndNullValues,
  simpleProcessRouterDest
} = require("../../util");
const { endpoint, identifyDataMapping, trackDataMapping } = require("./config");

const responseBuilder = (body, { Config }) => {
  const payload = body;
  payload.context = {
    source: "RudderStack"
  };
  if (payload.userId) {
    payload.userId = `${payload.userId}`;
  }
  const response = defaultRequestConfig();
  response.endpoint = endpoint;
  response.body.JSON = removeUndefinedAndNullValues(payload);
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
  const respList = await simpleProcessRouterDest(inputs, "CANDU", process);
  return respList;
};

module.exports = { process, processRouterDest };
