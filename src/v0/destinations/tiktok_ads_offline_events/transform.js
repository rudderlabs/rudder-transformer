const { SHA256 } = require("crypto-js");
const set = require("set-value");
const { EventType } = require("../../../constants");
const {
  constructPayload,
  defaultRequestConfig,
  removeUndefinedAndNullValues,
  isDefinedAndNotNullAndNotEmpty,
  getHashFromArrayWithDuplicate,
  simpleProcessRouterDest
} = require("../../util");
const {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  EVENT_NAME_MAPPING,
  PARTNER_NAME
} = require("./config");
const {
  ConfigurationError,
  InstrumentationError
} = require("../../util/errorTypes");

const getContents = message => {
  const contents = [];
  const { properties } = message;
  const { products } = properties;
  const mappingJson =
    MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK_PROPERTIES_CONTENTS.name];

  const updateContentsArray = productProps => {
    const contentObject = constructPayload(productProps, mappingJson);
    contents.push(removeUndefinedAndNullValues(contentObject));
  };

  if (products && Array.isArray(products) && products.length > 0) {
    products.forEach(product => updateContentsArray(product));
  } else {
    updateContentsArray(properties);
  }
  return contents;
};

const getTrackResponse = (message, category, Config, event) => {
  const { hashUserProperties, accessToken } = Config;
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  payload.event = event;
  payload.partner_name = PARTNER_NAME;

  // Settings Contents object
  set(payload, "properties.contents", getContents(message));

  const email = message?.traits?.email || message?.context?.traits.email;
  if (isDefinedAndNotNullAndNotEmpty(email)) {
    const emails = hashUserProperties
      ? [SHA256(email.trim()).toString()]
      : [email.trim()];
    set(payload, "context.user.emails", emails);
  }

  const phoneNumber = message?.traits?.phone || message?.context?.traits.phone;
  if (isDefinedAndNotNullAndNotEmpty(phoneNumber)) {
    const phoneNumbers = hashUserProperties
      ? [SHA256(phoneNumber.trim()).toString()]
      : [phoneNumber.trim()];
    set(payload, "context.user.phone_numbers", phoneNumbers);
  }

  const response = defaultRequestConfig();
  response.headers = {
    "Access-Token": accessToken,
    "Content-Type": "application/json"
  };

  response.method = category.method;
  response.endpoint = category.endpoint;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  return response;
};

const trackResponseBuilder = (message, category, { Config }) => {
  const { eventsToStandard } = Config;

  const event = message.event?.toLowerCase().trim();
  if (!event) {
    throw new InstrumentationError("Event name is required");
  }

  const standardEventsMap = getHashFromArrayWithDuplicate(eventsToStandard);

  if (EVENT_NAME_MAPPING[event] === undefined && !standardEventsMap[event]) {
    throw new InstrumentationError(
      `Event name (${event}) is not valid, must be mapped to one of standard events`
    );
  }

  const responseList = [];
  if (standardEventsMap[event]) {
    standardEventsMap[event].forEach(eventName => {
      responseList.push(getTrackResponse(message, category, Config, eventName));
    });
  } else {
    const eventName = EVENT_NAME_MAPPING[event];
    responseList.push(getTrackResponse(message, category, Config, eventName));
  }

  return responseList;
};

const process = event => {
  const { message, destination } = event;

  if (!destination.Config.accessToken) {
    throw new ConfigurationError("Access Token not found");
  }
  if (!message.type) {
    throw new InstrumentationError("Event type is required");
  }

  const messageType = message.type.toLowerCase();

  let response;
  switch (messageType) {
    case EventType.TRACK:
      response = trackResponseBuilder(
        message,
        CONFIG_CATEGORIES.TRACK,
        destination
      );
      break;
    default:
      throw new InstrumentationError(
        `Event type ${messageType} is not supported`
      );
  }
  return response;
};

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
