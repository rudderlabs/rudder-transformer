const { EventType } = require("../../../constants");
const {
  defaultRequestConfig,
  constructPayload,
  removeUndefinedAndNullValues,
  simpleProcessRouterDest
} = require("../../util");
const {
  InstrumentationError,
  ConfigurationError
} = require("../../util/errorTypes");
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
  if (!destination.Config.apiKey.trim()) {
    throw new ConfigurationError(`[CANDU]:: apiKey cannot be empty.`);
  }
  if (!message.type) {
    throw new InstrumentationError(
      "[CANDU]:: Message Type is not present. Aborting message."
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
      throw new InstrumentationError(
        `[CANDU]:: Message type ${messageType} not supported.`
      );
  }
  return responseBuilder(payload, destination);
};

const process = event => {
  return processEvent(event.message, event.destination);
};
const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
