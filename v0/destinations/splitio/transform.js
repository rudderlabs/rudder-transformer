const {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  KEY_CHECK_LIST,
  EVENT_TYPE_ID_REGEX
} = require("./config");
const { EventType } = require("../../../constants");
const {
  removeUndefinedAndNullValues,
  defaultPostRequestConfig,
  defaultRequestConfig,
  constructPayload,
  flattenJson,
  isDefinedAndNotNullAndNotEmpty,
  getFieldValueFromMessage,
  isDefinedAndNotNull,
  getSuccessRespEvents,
  getErrorRespEvents,
  CustomError
} = require("../../util");

function responseBuilderSimple(payload, category, destination) {
  if (payload) {
    const responseBody = payload;
    const response = defaultRequestConfig();
    response.endpoint = category.endPoint;
    response.method = defaultPostRequestConfig.requestMethod;
    response.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${destination.Config.apiKey}`
    };
    response.body.JSON = removeUndefinedAndNullValues(responseBody);
    return response;
  }
  // fail-safety for developer error
  throw new CustomError("Payload could not be constructed", 400);
}

function populateOutputProperty(inputObject) {
  const outputProperty = {};
  Object.keys(inputObject).forEach(key => {
    if (!KEY_CHECK_LIST.includes(key) && !Array.isArray(inputObject[key])) {
      outputProperty[key] = inputObject[key];
    }
  });
  return outputProperty;
}

function prepareResponse(message, destination, category) {
  let bufferProperty = {};
  const { environment, trafficType } = destination.Config;
  const { type } = message;
  let traits;

  let outputPayload = {};

  outputPayload = constructPayload(message, MAPPING_CONFIG[category.name]);
  outputPayload.eventTypeId = outputPayload.eventTypeId.replace(/ /g, "_");
  if (EVENT_TYPE_ID_REGEX.test(outputPayload.eventTypeId)) {
    switch (type) {
      case EventType.IDENTIFY:
        traits = getFieldValueFromMessage(message, "traits");
        if (isDefinedAndNotNull(traits))
          bufferProperty = populateOutputProperty(traits);
        break;
      case EventType.GROUP:
        if (message.traits) {
          bufferProperty = populateOutputProperty(message.traits);
        }
        break;
      case EventType.TRACK:
      case EventType.PAGE:
      case EventType.SCREEN:
        if (message.properties) {
          bufferProperty = populateOutputProperty(message.properties);
        }
        if (message.category) {
          bufferProperty.category = message.category;
        }
        if (type !== "track") {
          outputPayload.eventTypeId = `Viewed_${outputPayload.eventTypeId}_${type}`;
        }
        break;
      default:
        throw new CustomError("Message type not supported", 400);
    }
  } else {
    throw new CustomError("eventTypeId does not match with ideal format", 400);
  }
  if (isDefinedAndNotNullAndNotEmpty(environment)) {
    outputPayload.environmentName = environment;
  }
  outputPayload.trafficTypeName = trafficType;
  outputPayload.properties = flattenJson(bufferProperty);

  return outputPayload;
}

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }
  const category = CONFIG_CATEGORIES.EVENT;
  const response = prepareResponse(message, destination, category);
  // build the response
  return responseBuilderSimple(response, category, destination);
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