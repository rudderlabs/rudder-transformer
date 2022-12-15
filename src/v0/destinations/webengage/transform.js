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
  ErrorMessage,
  simpleProcessRouterDest,
  extractCustomFields
} = require("../../util");
const {
  InstrumentationError,
  TransformationError
} = require("../../util/errorTypes");

const responseBuilder = (message, category, { Config }) => {
  let payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  let endPoint;
  const { dataCenter, licenseCode, apiKey } = Config;
  if (!payload) {
    // fail-safety for developer error
    throw new TransformationError(ErrorMessage.FailedToConstructPayload);
  }
  if (!payload.userId && !payload.anonymousId) {
    throw new InstrumentationError(
      "Either one of userId or anonymousId is mandatory"
    );
  }

  if (category.type === "identify") {
    const eventTimeStamp = payload.birthDate;
    if (eventTimeStamp === "Invalid date") {
      throw new InstrumentationError(
        "birthday must be in this (YYYY-MM-DD) format"
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
      throw new InstrumentationError(
        "Timestamp must be ISO format (YYYY-MM-DD)"
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
    throw new InstrumentationError("Event type is required");
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
      throw new InstrumentationError(
        `Event type ${messageType} is not supported`
      );
  }
};

const process = event => {
  return processEvent(event.message, event.destination);
};

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
