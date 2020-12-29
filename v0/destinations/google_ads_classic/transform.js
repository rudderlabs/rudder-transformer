const get = require("get-value");
const {
  trackConfig,
  baseEndpoint,
  reservedEventNames,
  mappedEventTypes
} = require("./config");
const {
  constructPayload,
  defaultPostRequestConfig,
  defaultRequestConfig,
  removeUndefinedValues
} = require("../../util");
const { EventType } = require("../../../constants");

/**
 *
 * @param {Rudder Payload} message
 * To set app_event_type
 * The name of the app event that occurred. This field is an enumeration, and will only accept valued predefined by google ads.
 * https://developers.google.com/app-conversion-tracking/api/request-response-specs#conversion_tracking_request
 *
 */
const setEventType = message => {
  const eventName = get(message, "event");
  let eventType;
  let eventValue;
  Object.keys(mappedEventTypes).forEach(mappedEventType => {
    if (mappedEventType === eventName) {
      eventType = mappedEventType;
      eventValue = mappedEventTypes[mappedEventType];
    }
  });
  switch (eventName.toLowerCase()) {
    case "order completed":
      // Use in_app_purchase for purchases made through the native app store; use ecommerce_purchase for all other purchases.
      if (
        get(message, "properties.affiliation") === "App Store" ||
        get(message, "properties.affiliation") === "Google Store"
      ) {
        return "in_app_purchase";
      }
      return "ecommerce_purchase";
    case eventType:
      return eventValue;
    default:
      return "custom";
  }
};

const responseBuilderSimple = (message, destination) => {
  const {
    devToken,
    linkId,
    version,
    limitAdTracking,
    fallbackIDFAZero
  } = destination.Config;
  // if fall back to value is false and rdid is not present the message will not be accepted by google ads so it will be aborted by rudder.
  if (!fallbackIDFAZero && !get(message, "context.device.advertisingId")) {
    throw new Error("No advertisingId set. Aborting message");
  }
  const payload = constructPayload(message, trackConfig);
  if (payload) {
    payload.dev_token = devToken;
    payload.link_id = linkId;
    payload.app_event_type = setEventType(message);

    /**
     * Limit-ad-tracking status for the device.
     * 0: User has not chosen to limit ad tracking.
     * 1: User has chosen to limit ad tracking.
     */
    payload.lat = limitAdTracking ? 1 : 0;

    /**
     * The type of identifier stored in the rdid field
     * For Android: advertisingid
     * For iOS: idfa
     */

    if (get(message, "context.device.type").toLowerCase() === "android") {
      payload.id_type = "advertisingid";
    } else {
      payload.id_type = "idfa";
    }
    // if fall back to Idfa zero setting is true and no rdid is not present it will be set to default value
    if (fallbackIDFAZero && !payload.rdid) {
      payload.rdid = "00000000-0000-0000-0000-000000000000";
    }

    const response = defaultRequestConfig(message);
    response.endpoint = `${baseEndpoint}${version}`;
    response.method = defaultPostRequestConfig.requestMethod;
    response.body.JSON = removeUndefinedValues({
      app_event_data: get(message, "properties")
    });
    response.params = payload;
    /**
     * if the request body is empty (in cases where no rich event data is passed in the app_event_data payload),
     * Google ads server requires that we explicitly set the Content-Length: 0 header on your request.
     */
    response.headers = {
      "User-Agent": get(message, "context.userAgent"),
      "X-Forwarded-For":
        get(message, "context.ip") || get(message, "request_ip"),
      "Content-Type": "application/json; charset=utf-8"
    };
    if (
      Object.keys(response.body.JSON).length === 0 &&
      response.body.JSON.constructor === Object
    ) {
      response.headers["Content-Length"] = 0;
    }
    return response;
  }
  // fail-safety for developer error
  throw new Error("Payload could not be constructed");
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw Error("Message Type is not present. Aborting message.");
  }
  let eventName;
  const messageType = message.type.toLowerCase();
  switch (messageType) {
    case EventType.TRACK:
      eventName = get(message, "event");
      if (!eventName) {
        throw new Error("Track event without event name. Aborting message.");
      }

      /**  check if the event name is one of the default event types.
       * This field must not contain any of the values reserved for app_event_type.
       * If a reserved event name is used, the API will return an APP_EVENT_NAME_RESERVED_VALUE error.
       */
      if (reservedEventNames.indexOf(eventName) >= 0) {
        throw new Error(
          "Event name is a reserved event name in Google Ads. Aborting Message"
        );
      }
      break;
    default:
      throw new Error("Message type not supported");
  }

  // build the response
  return responseBuilderSimple(message, destination);
};

const process = event => {
  return processEvent(event.message, event.destination);
};

exports.process = process;
