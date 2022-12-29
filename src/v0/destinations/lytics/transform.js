const { EventType } = require("../../../constants");
const {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  ENDPOINT,
  forFirstName,
  forLastName
} = require("./config");
const {
  constructPayload,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  defaultRequestConfig,
  flattenJson,
  simpleProcessRouterDest
} = require("../../util");
const { InstrumentationError } = require("../../util/errorTypes");

const responseBuilderSimple = (message, category, destination) => {
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  const response = defaultRequestConfig();
  const { stream, apiKey } = destination.Config;
  response.endpoint = `${ENDPOINT}/${stream}?access_token=${apiKey}`;
  response.method = defaultPostRequestConfig.requestMethod;
  const flattenedPayload = removeUndefinedAndNullValues(flattenJson(payload));
  forFirstName.forEach(key => {
    if (flattenedPayload[key]) {
      flattenedPayload.first_name = flattenedPayload[key];
      delete flattenedPayload[key];
    }
  });
  forLastName.forEach(key => {
    if (flattenedPayload[key]) {
      flattenedPayload.last_name = flattenedPayload[key];
      delete flattenedPayload[key];
    }
  });
  response.body.JSON = flattenedPayload;
  response.headers = {
    "Content-Type": "application/json"
  };
  return response;
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new InstrumentationError("Event type is required");
  }
  const messageType = message.type;
  let category;
  switch (messageType.toLowerCase()) {
    case EventType.IDENTIFY:
      category = CONFIG_CATEGORIES.IDENTIFY;
      break;
    case EventType.PAGE:
    case EventType.SCREEN:
      category = CONFIG_CATEGORIES.PAGESCREEN;
      break;
    case EventType.TRACK:
      category = CONFIG_CATEGORIES.TRACK;
      break;
    default:
      throw new InstrumentationError(
        `Event type ${messageType} is not supported`
      );
  }
  // build the response
  return responseBuilderSimple(message, category, destination);
};

const process = event => {
  return processEvent(event.message, event.destination);
};

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
