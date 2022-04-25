const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require("./config");
const { EventType } = require("../../../constants");
const {
  constructPayload,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  defaultRequestConfig,
  flattenJson,
  getSuccessRespEvents,
  getErrorRespEvents,
  CustomError
} = require("../../util");

function responseBuilderSimple(message, category, destination) {
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  if (payload) {
    if (payload.properties) {
      payload.properties = flattenJson(payload.properties);
      // remove duplicate key as it is being passed at root.
      if (payload.properties.idempotencyKey) {
        delete payload.properties.idempotencyKey;
      }
    }
    const responseBody = {
      ...payload,
      app_id: destination.Config.appId
    };
    const response = defaultRequestConfig();
    response.endpoint = category.endPoint;
    response.method = defaultPostRequestConfig.requestMethod;
    response.headers = {
      "Content-Type": "application/json",
      Accept: "application/json"
    };
    response.userId = message.anonymousId;
    response.body.JSON = removeUndefinedAndNullValues(responseBody);
    return response;
  }
  // fail-safety for developer error
  throw new CustomError("Payload could not be constructed", 400);
}

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new CustomError("invalid message type for heap", 400);
  }

  const messageType = message.type;
  let category;
  switch (messageType.toLowerCase()) {
    case EventType.IDENTIFY:
      category = CONFIG_CATEGORIES.IDENTIFY;
      break;
    case EventType.TRACK:
      category = CONFIG_CATEGORIES.TRACK;
      break;
    default:
      throw new CustomError(
        `message type ${messageType} not supported for heap`,
        400
      );
  }

  // build the response
  return responseBuilderSimple(message, category, destination);
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
