/* eslint-disable no-nested-ternary */
const get = require("get-value");
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
  removeUndefinedAndNullValues,
  getSuccessRespEvents,
  getErrorRespEvents,
  CustomError
} = require("../../util");

const responseWrapper = (payload, destination) => {
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
};

const responseBuilderSimple = (message, category, destination) => {
  let payload;
  // For identify type of events we require a specific trype of payload
  // Source: https://developer.clevertap.com/docs/upload-user-profiles-api
  // ---------------------------------------------------------------------
  if (category.type === "identify") {
    let profile = constructPayload(message, MAPPING_CONFIG[category.name]);
    // Extract other K-V property from traits about user custom properties
    if (
      !get(profile, "Name") &&
      getFieldValueFromMessage(message, "firstName") &&
      getFieldValueFromMessage(message, "lastName")
    ) {
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
    payload = {
      d: [
        {
          identity: getFieldValueFromMessage(message, "userId"),
          type: "profile",
          profileData: removeUndefinedAndNullValues(profile)
        }
      ]
    };
    // In casse we have device token present we return an array of response the first object is identify payload and second
    // object is the upload device token payload
    const deviceToken = get(message, "context.device.token");
    const deviceOS = get(message, "context.os.name").toLowerCase();
    if (deviceToken && ["ios", "android"].includes(deviceOS)) {
      const tokenType = deviceOS === "android" ? "fcm" : "apns";
      const payloadForDeviceToken = {
        d: [
          {
            type: "token",
            tokenData: {
              id: deviceToken,
              type: tokenType
            },
            objectId: getFieldValueFromMessage(message, "userId")
          }
        ]
      };
      const respArr = [];
      respArr.push(responseWrapper(payload, destination)); // identify
      respArr.push(responseWrapper(payloadForDeviceToken, destination)); // device token
      return respArr;
    }
  } else {
    // If trackAnonymous option is disabled from dashboard then we will check for presence of userId only
    // if userId is not present we will throw error. If it is enabled we will process the event with anonId.
    if (
      !destination.Config.trackAnonymous &&
      !getFieldValueFromMessage(message, "userIdOnly")
    ) {
      throw new CustomError(
        "userId, not present cannot track anonymous user",
        400
      );
    }
    let eventPayload;
    // For 'Order Completed' type of events we are mapping it as 'Charged'
    // Special event in Clevertap.
    // Source: https://developer.clevertap.com/docs/concepts-events#recording-customer-purchases
    if (
      get(message.event) &&
      get(message.event).toLowerCase() === "order completed"
    ) {
      eventPayload = {
        evtName: "Charged",
        evtData: constructPayload(
          message,
          MAPPING_CONFIG[CONFIG_CATEGORIES.ECOM.name]
        ),
        identity: getFieldValueFromMessage(message, "userId")
      };
      eventPayload.evtData = extractCustomFields(
        message,
        eventPayload.evtData,
        ["properties"],
        ["checkout_id", "revenue", "products"]
      );
    }
    // For other type of events we need to follow payload for sending events
    // Source: https://developer.clevertap.com/docs/upload-events-api
    // ----------------------------------------------------------------------
    else {
      eventPayload = constructPayload(message, MAPPING_CONFIG[category.name]);
    }

    eventPayload.type = "event";
    payload = {
      d: [removeUndefinedAndNullValues(eventPayload)]
    };
  }

  if (payload) {
    return responseWrapper(payload, destination);
  }
  // fail-safety for developer error
  throw new CustomError("Payload could not be constructed", 400);
};
// Main Process func for processing events
// Idnetify, Track, Screen, and Page calls are supported
const processEvent = (message, destination) => {
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
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
      throw new CustomError("Message type not supported", 400);
  }
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
