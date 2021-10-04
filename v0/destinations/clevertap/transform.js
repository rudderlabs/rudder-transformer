/* eslint-disable no-param-reassign */
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
  CustomError,
  toUnixTimestamp
} = require("../../util");

/*
Following behaviour is expected when "enableObjectIdMapping" is enabled

For Identify Events
---------------RudderStack-----------------             ------------Clevertap-------------
anonymousId(present?)				userId(present?)	 					objectId(value)			        identity(value)
true						            true						            anonymousId			              userId
true						            false					              anonymousId			              -
false					              true						            (clevertap_generated_uuid)		userId

For tracking events
---------------RudderStack-----------------           ----------Clevertap---------
anonymousId(present?)				userId(present?)					tracking with
true						            true						          objectId (value = anonymousId)
true						            false					            objectId (value = anonymousId)
false					              true						          identity (value = userId)
*/

// wraps to default request config
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

// generates clevertap identify payload with both objectId and identity
const mapIdentifyPayloadWithObjectId = (message, profile) => {
  const userId = getFieldValueFromMessage(message, "userIdOnly");
  const anonymousId = get(message, "anonymousId");
  const payload = {
    type: "profile",
    profileData: profile,
    ts: get(message, "traits.ts") || get(message, "context.traits.ts")
  };

  // If timestamp is not in unix format
  if (payload.ts && !Number(payload.ts)) {
    payload.ts = toUnixTimestamp(payload.ts);
  }

  // If anonymousId is present prioritising to set it as objectId
  if (anonymousId) {
    payload.objectId = anonymousId;
    // If userId is present we set it as identity inside profiledData
    if (userId) {
      payload.profileData.identity = userId;
    }
  } else if (userId) {
    // If only userId present set it as identity in root of payload
    payload.identity = userId;
  }
  return {
    d: [payload]
  };
};

// generates clevertap identify payload with only identity
const mapIdentifyPayload = (message, profile) => {
  const payload = {
    d: [
      {
        type: "profile",
        profileData: profile,
        ts: get(message, "traits.ts") || get(message, "context.traits.ts"),
        identity: getFieldValueFromMessage(message, "userId")
      }
    ]
  };

  // If timestamp is not in unix format
  if (payload.d[0].ts && !Number(payload.d[0].ts)) {
    payload.d[0].ts = toUnixTimestamp(payload.d[0].ts);
  }
  return payload;
};

// generates clevertap tracking payload with objectId or identity
const mapTrackPayloadWithObjectId = (message, eventPayload) => {
  const userId = getFieldValueFromMessage(message, "userIdOnly");
  const anonymousId = get(message, "anonymousId");
  if (anonymousId) {
    // If anonymousId is present set it as objectId in root
    eventPayload.objectId = anonymousId;
  } else if (userId) {
    // If userId is present set it as identity in root
    eventPayload.identity = userId;
  } else {
    // Flow should not reach here fail safety
    throw CustomError("Unable to process without anonymousId or userId", 400);
  }
  return eventPayload;
};

// generates clevertap tracking payload with only identity
const mapTrackPayload = (message, eventPayload) => {
  eventPayload.identity = getFieldValueFromMessage(message, "userId");
  return eventPayload;
};

// Here we are creating the profileData info for identify calls
// ---------------------------------------------------------------------
const getClevertapProfile = (message, category) => {
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

  return removeUndefinedAndNullValues(profile);
};

const responseBuilderSimple = (message, category, destination) => {
  let payload;
  // For identify type of events we require a specific type of payload
  // Source: https://developer.clevertap.com/docs/upload-user-profiles-api
  // ---------------------------------------------------------------------
  if (category.type === "identify") {
    const profile = getClevertapProfile(message, category);
    if (destination.Config.enableObjectIdMapping) {
      payload = mapIdentifyPayloadWithObjectId(message, profile);
      // In case we have device token present we return an array
      // of response the first object is identify payload and second
      // object is the upload device token payload
      // TO use uploadDeviceToken api "enableObjectIdMapping" should be enabled
      // also anoymousId should be present to map it with objectId
      const deviceToken = get(message, "context.device.token");
      const deviceOS = get(message, "context.os.name").toLowerCase();
      if (
        get(message, "anonymousId") &&
        deviceToken &&
        ["ios", "android"].includes(deviceOS)
      ) {
        const tokenType = deviceOS === "android" ? "fcm" : "apns";
        const payloadForDeviceToken = {
          d: [
            {
              type: "token",
              tokenData: {
                id: deviceToken,
                type: tokenType
              },
              objectId: get(message, "anonymousId")
            }
          ]
        };
        const respArr = [];
        respArr.push(responseWrapper(payload, destination)); // identify
        respArr.push(responseWrapper(payloadForDeviceToken, destination)); // device token
        return respArr;
      }
    } else {
      payload = mapIdentifyPayload(message, profile);
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
        ts: get(message, "properties.ts")
      };

      eventPayload.evtData = extractCustomFields(
        message,
        eventPayload.evtData,
        ["properties"],
        ["checkout_id", "revenue", "products", "ts"]
      );
    }
    // For other type of events we need to follow payload for sending events
    // Source: https://developer.clevertap.com/docs/upload-events-api
    // ----------------------------------------------------------------------
    else {
      eventPayload = constructPayload(message, MAPPING_CONFIG[category.name]);
    }
    eventPayload.type = "event";

    // setting identification for tracking payload here based on destination config
    if (destination.Config.enableObjectIdMapping) {
      eventPayload = mapTrackPayloadWithObjectId(message, eventPayload);
    } else {
      eventPayload = mapTrackPayload(message, eventPayload);
    }

    // If timestamp is not in unix format
    if (eventPayload.ts && !Number(eventPayload.ts)) {
      eventPayload.ts = toUnixTimestamp(eventPayload.ts);
    }

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
