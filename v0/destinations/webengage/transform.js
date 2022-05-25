const { EventType } = require("../../../constants");
const {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  WEBENGAGE_IDENTIFY_EXCLUSION,
  BASE_URL,
  BASE_URL_IND
} = require("./config");

const {
  defaultRequestConfig,
  constructPayload,
  defaultPostRequestConfig,
  CustomError,
  ErrorMessage,
  extractCustomFields
} = require("../../util");
const set = require("set-value");
const moment = require("moment");

const ISO_8601 = /^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?$/i;

const responseBuilder = (message, category, { Config }) => {
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
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
  let baseUrl, endpoint;
  if (Config.dataCenter === "ind") {
    baseUrl = BASE_URL_IND;
  } else {
    baseUrl = BASE_URL;
  }

  if (category.name === "identify") {
    const customAttributes = {};
    extractCustomFields(
      message,
      customAttributes,
      ["context.traits", "traits"],
      WEBENGAGE_IDENTIFY_EXCLUSION
    );

    payload = { ...payload, attributes: customAttributes };
    endpoint = `${baseUrl}/${Config.licenseCode}/users`;
  } else {
    let eventTimeStamp = message?.properties?.eventTimestamp;
    if (moment(eventTimeStamp).isValid()) {
      eventTimeStamp = moment(eventTimeStamp).format("YYYY-MM-DDThh:mm:sZZ");
    } else {
      eventTimeStamp = message.timestamp || message.originalTimestamp;
      eventTimeStamp = moment(eventTimeStamp).format("YYYY-MM-DDThh:mm:sZZ");
    }
    set(payload, "eventTime", eventTimeStamp);
    endpoint = `${baseUrl}/${Config.licenseCode}/events`;
  }
  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    "Content-Type": "application/json",
    "Api-Token": Config.apiKey
  };
  response.endPoint = endpoint;
  response.body.JSON = payload;
  return response;
};

const processEvent = async (message, destination) => {
  if (!message.type) {
    throw Error("Message Type is not present. Aborting message.");
  }
  const messageType = message.type.toLowerCase();
  const category = CONFIG_CATEGORIES[message.type.toUpperCase()];
  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = responseBuilder(message, category, destination);
      break;
    case EventType.TRACK:
      response = responseBuilder(message, category, destination);
      break;
    case EventType.PAGE:
    case EventType.SCREEN:
      const name = message.name
        ? message.name
        : message.properties?.name
        ? message.properties.name
        : "";
      const categoryName = message.properties.category
        ? message.properties.category
        : "";
      message.event = `Viewed ${name} ${categoryName} ${messageType}`;
      response = responseBuilder(message, category, destination);
      break;
    default:
      throw new Error("Message type not supported");
  }
  return response;
};

const process = event => {
  return processEvent(event.message, event.destination);
};
module.exports = { process };
