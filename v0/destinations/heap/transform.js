const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require("./config");
const { EventType } = require("../../../constants");
const {
  constructPayload,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  defaultRequestConfig,
  flattenJson,
  CustomError,
  simpleProcessRouterDest
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

const process = async event => {
  return processEvent(event.message, event.destination);
};
const processRouterDest = async inputs => {
  const respList = await simpleProcessRouterDest(inputs, "HEAP", process);
  return respList;
};

module.exports = { process, processRouterDest };
