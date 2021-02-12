const get = require("get-value");
const { EventType } = require("../../../constants");
const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require("./config");

const {
  defaultRequestConfig,
  getFieldValueFromMessage,
  extractCustomFields,
  constructPayload,
  defaultPostRequestConfig,
  removeUndefinedValues
} = require("../../util");

const responseBuilderSimple = (message, category, destination) => {
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  if (payload) {
    const responseBody = { ...payload, apiKey: destination.Config.apiKey };
    const response = defaultRequestConfig();
    response.endpoint = category.endPoint;
    response.method = defaultPostRequestConfig.requestMethod;
    response.headers = {
      "Content-Type": "application/json",
      "Api-Token": destination.Config.apiKey
    };
    response.userId = getFieldValueFromMessage(message, "userId");
    response.body.JSON = responseBody;
    return response;
  }
  // fail-safety for developer error
  throw new Error("Payload could not be constructed");
};

const identifyEventHandler = (message, category) => {
  let profile = constructPayload(message, MAPPING_CONFIG[category.name]);

  // Extract other K-V property from traits about user custom properties
  profile = extractCustomFields(
    message,
    profile,
    ["traits", "context.traits"],
    [
      "email",
      "name",
      "phone",
      "employed",
      "gender",
      "education",
      "graduate",
      "married",
      "msg_sms",
      "customer_type",
      "anonymousId",
      "userId",
      "properties"
    ]
  );

  let data = {
    objectId: get(message.traits, "objectId")
      ? get(message.traits, "objectId")
      : get(message.context.traits, "objectId"),
    FBID: get(message.traits, "fbId")
      ? get(message.traits, "fbId")
      : get(message.context.traits, "fbId"),
    identity: get(message.traits, "identity")
      ? get(message.traits, "identity")
      : get(message.context.traits, "identity"),
    GPID: get(message.traits, "gpId")
      ? get(message.traits, "gpId")
      : get(message.context.traits, "gpId"),
    type: "profile",
    profileData: profile
  };

  data = removeUndefinedValues(data);

  const response = {
    d: [data]
  };
  return response;
};

const trackEventHandler = (message, category) => {
  let evData = {};
  evData = extractCustomFields(
    message,
    evData,
    ["traits", "context.traits", "properties"],
    [
      "identity",
      "fbId",
      "gpId",
      "objectId",
      "anonymousId",
      "userId",
      "properties"
    ]
  );
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  payload.evtData = evData;
  const response = {
    d: [removeUndefinedValues(payload)]
  };
  return response;
};
const processEvent = (message, destination) => {
  if (!message.type) {
    throw Error("Message Type is not present. Aborting message.");
  }
  const messageType = message.type.toLowerCase();

  let category;
  let payload;
  switch (messageType) {
    case EventType.IDENTIFY:
      payload = identifyEventHandler(message, CONFIG_CATEGORIES.IDENTIFY);
      break;
    case EventType.PAGE:
    case EventType.SCREEN:
      payload = trackEventHandler(message, CONFIG_CATEGORIES.PAGESCREEN);
      break;
    case EventType.TRACK:
      payload = trackEventHandler(message, CONFIG_CATEGORIES.TRACK);
      break;
    default:
      throw new Error("Message type not supported");
  }
  return responseBuilderSimple(payload, category, destination);
};

const process = event => {
  return processEvent(event.message, event.destination);
};

exports.process = process;
