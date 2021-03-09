const get = require("get-value");
const set = require("set-value");
const Handlebars = require("handlebars");
const { EventType } = require("../../../constants");
const {
  BASE_ENDPOINT,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  CLEVERTAP_DEFAULT_EXCLUSION
} = require("./config");

const {
  defaultRequestConfig,
  getFieldValueFromMessage,
  extractCustomFields,
  constructPayload,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues
} = require("../../util");

const responseBuilderSimple = (message, category, destination) => {
  let payload;
  if (category.type === "identify") {
    let profile = constructPayload(message, MAPPING_CONFIG[category.name]);
    // Extract other K-V property from traits about user custom properties
    profile = extractCustomFields(
      message,
      profile,
      ["traits", "context.traits"],
      CLEVERTAP_DEFAULT_EXCLUSION
    );
    removeUndefinedAndNullValues(profile);
    payload = {
      d: [
        {
          identity: getFieldValueFromMessage(message, "userId"),
          type: "profile",
          profileData: profile
        }
      ]
    };
  } else {
    const eventData = constructPayload(message, MAPPING_CONFIG[category.name]);
    if (get(eventData.evtName) == "Order Completed") {
      set(eventData, "evtName", "Charged");
    }
    removeUndefinedAndNullValues(eventData);
    eventData.type = "event";
    payload = {
      d: [eventData]
    };
  }

  if (payload) {
    const response = defaultRequestConfig();
    let value = "";
    if (destination.Config.region && destination.Config.region !== "none") {
      value = `${destination.Config.region}.`;
    }
    const bEndpoint = Handlebars.compile(BASE_ENDPOINT.trim());
    const formattedEndpoint = bEndpoint({ value }).trim();
    response.endpoint = formattedEndpoint;
    response.method = defaultPostRequestConfig.requestMethod;
    response.headers = {
      "X-CleverTap-Account-Id": destination.Config.accountId,
      "X-CleverTap-Passcode": destination.Config.passcode,
      "Content-Type": "application/json"
    };
    response.body.JSON = payload;
    return response;
  }
  // fail-safety for developer error
  throw new Error("Payload could not be constructed");
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw Error("Message Type is not present. Aborting message.");
  }
  const messageType = message.type.toLowerCase();

  let category;
  switch (messageType) {
    case EventType.IDENTIFY:
      category = CONFIG_CATEGORIES.IDENTIFY;
      break;
    case EventType.PAGE:
      category = CONFIG_CATEGORIES.PAGE;
      break;
    case EventType.SCREEN:
      category = CONFIG_CATEGORIES.SCREEN;
      break;
    case EventType.TRACK:
      category = CONFIG_CATEGORIES.TRACK;
      break;
    default:
      throw new Error("Message type not supported");
  }
  return responseBuilderSimple(message, category, destination);
};

const process = event => {
  return processEvent(event.message, event.destination);
};

exports.process = process;
