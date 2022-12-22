const {
  ErrorMessage,
  defaultRequestConfig,
  simpleProcessRouterDest,
  removeUndefinedAndNullValues,
  defaultPostRequestConfig
} = require("../../util");
const {
  validatePayload,
  pageEventPayloadBuilder,
  groupUsersPayloadBuilder,
  trackEventPayloadBuilder,
  identifyUserPayloadBuilder
} = require("./utils");
const { EventType } = require("../../../constants");
const {
  TransformationError,
  InstrumentationError
} = require("../../util/errorTypes");

const responseBuilder = (payload, endpoint, destination) => {
  if (payload) {
    const response = defaultRequestConfig();
    const { apiKey } = destination.Config;
    response.endpoint = endpoint;
    response.headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${apiKey}`
    };
    response.method = defaultPostRequestConfig.requestMethod;
    response.body.FORM = removeUndefinedAndNullValues(payload);
    return response;
  }
  // fail-safety for developer error
  throw new TransformationError(ErrorMessage.FailedToConstructPayload);
};

const identifyResponseBuilder = (message, destination) => {
  validatePayload(message);
  const builder = identifyUserPayloadBuilder(message, destination);
  const { payload, endpoint } = builder;
  return responseBuilder(payload, endpoint, destination);
};

const trackResponseBuilder = (message, destination) => {
  validatePayload(message);
  if (!message.event) {
    throw new InstrumentationError("Event name is required");
  }
  const builder = trackEventPayloadBuilder(message);
  const { payload, endpoint } = builder;
  return responseBuilder(payload, endpoint, destination);
};

const pageResponseBuilder = (message, destination) => {
  validatePayload(message);
  const builder = pageEventPayloadBuilder(message);
  const { payload, endpoint } = builder;
  return responseBuilder(payload, endpoint, destination);
};

const groupResponseBuilder = (message, destination) => {
  validatePayload(message);
  const builder = groupUsersPayloadBuilder(message, destination);
  const { payload, endpoint } = builder;
  return responseBuilder(payload, endpoint, destination);
};

const processEvent = (message, destination) => {
  // Validating if message type is even given or not
  if (!message.type) {
    throw new InstrumentationError("Event type is required");
  }
  const messageType = message.type.toLowerCase();
  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = identifyResponseBuilder(message, destination);
      break;
    case EventType.TRACK:
      response = trackResponseBuilder(message, destination);
      break;
    case EventType.PAGE:
      response = pageResponseBuilder(message, destination);
      break;
    case EventType.GROUP:
      response = groupResponseBuilder(message, destination);
      break;
    default:
      throw new InstrumentationError(
        `Event type "${messageType}" is not supported`
      );
  }
  return response;
};

const process = event => {
  return processEvent(event.message, event.destination);
};

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
