const { EventType } = require("../../../constants");
const {
  defaultRequestConfig,
  simpleProcessRouterDest,
  constructPayload,
  removeUndefinedAndNullValues,
  defaultPostRequestConfig,
  getDestinationExternalID
} = require("../../util");
const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require("./config");
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
      "Content-Type": "application/json",
      Authorization: `Basic ${apiKey}`
    };
    response.method = defaultPostRequestConfig.requestMethod;
    response.body.JSON = removeUndefinedAndNullValues(payload);
    return response;
  }
  // fail-safety for developer error
  throw new TransformationError(
    "Something went wrong while constructing the payload"
  );
};

// ref :- https://www.june.so/docs/api#:~:text=Copy-,Identifying%20users,-You%20can%20use
const identifyResponseBuilder = (message, destination) => {
  const { endpoint } = CONFIG_CATEGORIES.IDENTIFY;
  const payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name]
  );
  return responseBuilder(payload, endpoint, destination);
};

// ref :- https://www.june.so/docs/api#:~:text=Copy-,Send%20track%20events,-In%20order%20to
const trackResponseBuilder = (message, destination) => {
  const { endpoint } = CONFIG_CATEGORIES.TRACK;
  const groupId =
    getDestinationExternalID(message, "juneGroupId") ||
    message.properties?.groupId;
  let payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK.name]
  );

  if (groupId) {
    payload = { ...payload, context: { groupId } };
  }

  return responseBuilder(payload, endpoint, destination);
};

// ref :- https://www.june.so/docs/api#:~:text=Copy-,Identifying%20companies,-(optional)
const groupResponseBuilder = (message, destination) => {
  const { endpoint } = CONFIG_CATEGORIES.GROUP;
  const payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.GROUP.name]
  );
  return responseBuilder(payload, endpoint, destination);
};

const processEvent = (message, destination) => {
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
