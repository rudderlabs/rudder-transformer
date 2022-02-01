const { EventType } = require("../../../constants");
const {
  ConfigCategory,
  mappingConfig,
  ENDPOINT,
  API_VERSION
} = require("./config");
const {
  removeUndefinedValues,
  defaultPostRequestConfig,
  defaultRequestConfig,
  constructPayload,
  getSuccessRespEvents,
  getErrorRespEvents,
  CustomError
} = require("../../util");

function preparePayload(message, name, destination) {
  const mappingJson = mappingConfig[name];
  const rawPayload = {
    appId: destination.Config.applicationId,
    clientKey: destination.Config.clientKey,
    apiVersion: API_VERSION,
    ...constructPayload(message, mappingJson)
  };

  if (rawPayload.newUserId === "") {
    delete rawPayload.newUserId;
  }

  if (destination.Config.isDevelop) {
    rawPayload.devMode = true;
  }

  // special case for "created", "time"
  // ideally we should add data type field in the json and handle it
  if (rawPayload.created) {
    const created = Math.round(new Date(rawPayload.created).getTime() / 1000);
    rawPayload.created = created;
  }
  if (rawPayload.time) {
    const time = Math.round(new Date(rawPayload.time).getTime() / 1000);
    rawPayload.time = time;
  }

  return removeUndefinedValues(rawPayload);
}

function responseBuilderSimple(message, category, destination) {
  const response = defaultRequestConfig();
  response.endpoint = ENDPOINT;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    "Content-Type": "application/json"
  };
  response.userId = message.anonymousId;
  response.body.JSON = preparePayload(message, category.name, destination);
  response.params = {
    action: category.action
  };

  return response;
}

function startSession(message, destination) {
  return responseBuilderSimple(message, ConfigCategory.START, destination);
}

function processSingleMessage(message, destination) {
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }
  const messageType = message.type.toLowerCase();
  let category;

  switch (messageType) {
    case EventType.PAGE:
      category = ConfigCategory.PAGE;
      break;
    case EventType.IDENTIFY:
      category = ConfigCategory.IDENTIFY;
      break;
    case EventType.TRACK:
      category = ConfigCategory.TRACK;
      break;
    case EventType.SCREEN:
      category = ConfigCategory.SCREEN;
      break;
    default:
      throw new CustomError("Message type not supported", 400);
  }

  // build the response
  const response = responseBuilderSimple(message, category, destination);

  // all event types except idetify requires startSession
  if (messageType !== EventType.IDENTIFY) {
    return [startSession(message, destination), response];
  }

  return response;
}

function process(event) {
  let response;
  try {
    response = processSingleMessage(event.message, event.destination);
  } catch (error) {
    throw new CustomError(
      error.message || "Unknown error",
      error.status || 400
    );
  }
  return response;
}

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
