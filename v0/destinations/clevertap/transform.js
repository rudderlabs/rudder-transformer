const get = require("get-value");
const set = require("set-value");
const { EventType } = require("../../../constants");
const {
  getEndpoint,
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
  // For identify type of events we require a specific trype of payload
  // Source: https://developer.clevertap.com/docs/upload-user-profiles-api
  // ---------------------------------------------------------------------
  if (category.type === "identify") {
    let profile = constructPayload(message, MAPPING_CONFIG[category.name]);
    // Extract other K-V property from traits about user custom properties
    if (!get(profile, "Name")) {
      profile.Name = `${getFieldValueFromMessage(
        message,
        "firstName"
      )} ${getFieldValueFromMessage(message, "lastName")}`;
    }
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
    // For other type of events we need to follow payload for sending events
    // Source: https://developer.clevertap.com/docs/upload-events-api
    // ----------------------------------------------------------------------
    const eventData = constructPayload(message, MAPPING_CONFIG[category.name]);
    // For 'Order Completed' type of events we are mapping it as 'Charged'
    // Special event in Clevertap.
    // Source: https://developer.clevertap.com/docs/concepts-events#recording-customer-purchases
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
    // If the acount belongs to specific regional server,
    // we need to modify the url endpoint based on dest config.
    // Source: https://developer.clevertap.com/docs/idc
    response.endpoint = getEndpoint(destination);
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
// Main Process func for processing events
// Idnetify, Track, Screen, and Page calls are supported
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
