/* eslint-disable no-param-reassign */
const { EventType } = require("../../../constants");
const {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  WEBENGAGE_IDENTIFY_EXCLUSION,
  ENDPOINT
} = require("./config");

const {
  defaultRequestConfig,
  constructPayload,
  defaultPostRequestConfig,
  CustomError,
  ErrorMessage,
  getErrorRespEvents,
  getSuccessRespEvents,
  extractCustomFields
} = require("../../util");

const responseBuilder = (message, category, { Config }) => {
  let payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  let endPoint;
  const { dataCenter, licenseCode, apiKey } = Config;
  if (!payload) {
    // fail-safety for developer error
    throw new CustomError(ErrorMessage.FailedToConstructPayload, 400);
  }
  if (!payload.userId && !payload.anonymousId) {
    throw new CustomError(
      "[WEBENGAGE]: Either one of userId or anonymousId is mandatory.",
      400
    );
  }

  if (category.type === "identify") {
    const eventTimeStamp = payload.birthDate;
    if (eventTimeStamp === "Invalid date") {
      throw new CustomError(
        "[WEBENGAGE]: birthday must be in this (YYYY-MM-DD) format.",
        400
      );
    }
    const customAttributes = {};
    payload = {
      ...payload,
      attributes: extractCustomFields(
        message,
        customAttributes,
        ["context.traits", "traits"],
        WEBENGAGE_IDENTIFY_EXCLUSION
      )
    };
    endPoint = `${ENDPOINT(dataCenter)}/${licenseCode}/users`;
  } else {
    const eventTimeStamp = payload.eventTime;
    if (eventTimeStamp === "Invalid date") {
      throw new CustomError(
        "[WEBENGAGE]: timestamp must be ISO format (YYYY-MM-DD).",
        400
      );
    }
    endPoint = `${ENDPOINT(dataCenter)}/${licenseCode}/events`;
  }
  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`
  };
  response.endpoint = endPoint;
  response.body.JSON = payload;
  return response;
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw Error("[WEBENGAGE]: Message Type is not present. Aborting message.");
  }
  let eventName;
  let category;
  let name;
  const messageType = message.type.toLowerCase();
  switch (messageType) {
    case EventType.IDENTIFY:
      return responseBuilder(message, CONFIG_CATEGORIES.IDENTIFY, destination);
    case EventType.TRACK:
      return responseBuilder(message, CONFIG_CATEGORIES.EVENT, destination);
    case EventType.PAGE:
    case EventType.SCREEN:
      name = message.name || message.properties.name;
      category = message.properties.category;
      if (name && category) {
        eventName = `Viewed ${category} ${name} ${messageType}`;
      } else if (name) {
        eventName = `Viewed ${name}`;
      } else if (category) {
        eventName = `Viewed ${category} ${messageType}`;
      } else {
        eventName = `Viewed a ${messageType}`;
      }
      message.event = eventName;
      return responseBuilder(message, CONFIG_CATEGORIES.EVENT, destination);
    default:
      throw new Error("[WEBENGAGE]: Message type not supported");
  }
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
