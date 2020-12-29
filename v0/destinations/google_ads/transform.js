const get = require("get-value");
const { trackConfig, baseEndpoint } = require("./config");
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
 * To set app_event_name
 * The name of any custom app event which is not accepted in the app_event_type field.
 * This field should contain 1 to 64 Unicode characters (using UTF-8 encoding). This field is required if app_event_type is custom.
 * https://developers.google.com/app-conversion-tracking/api/request-response-specs#conversion_tracking_request
 *
 */

function setEventName(message) {
  const reservedEventNames = [
    "first_open",
    "session_start",
    "in_app_purchase",
    "view_item_list",
    "view_item",
    "view_search_results",
    "add_to_cart",
    "ecommerce_purchase",
    "custom"
  ];
  const eventName = get(message, "event");
  /**  check if the event name is one of the default event types.
   * This field must not contain any of the values reserved for app_event_type.
   * If a reserved event name is used, the API will return an APP_EVENT_NAME_RESERVED_VALUE error.
   */

  if (reservedEventNames.indexOf(eventName) >= 0) {
    throw new Error(
      "Event name is a reserved event name in Google Ads. Aborting Message"
    );
  }
  return eventName;
}
/**
 *
 * @param {Rudder Payload} message
 * To set app_event_type
 * The name of the app event that occurred. This field is an enumeration, and will only accept valued predefined by google ads.
 * https://developers.google.com/app-conversion-tracking/api/request-response-specs#conversion_tracking_request
 *
 */
function setEventType(message) {
  const eventName = get(message, "event");
  switch (eventName.toLowerCase()) {
    case "application installed":
      return "first_open";
    case "application opened":
      return "session_start";
    case "order completed":
      // Use in_app_purchase for purchases made through the native app store; use ecommerce_purchase for all other purchases.
      if (
        get(message, "properties.affiliation") === "App Store" ||
        get(message, "properties.affiliation") === "Google Store"
      ) {
        return "in_app_purchase";
      }
      return "ecommerce_purchase";
    case "product list viewed":
      return "view_item_list";
    case "product added":
      return "add_to_cart";
    case "poducts searched":
      return "view_search_results";
    case "product viewed":
      return "view_item";
    default:
      return "custom";
  }
}
function responseBuilderSimple(message, category, destination) {
  const {
    devToken,
    linkId,
    version,
    lat,
    fallbackIDFAZero
  } = destination.Config;
  // if fall back to value is false and rdid is not present the message will not be accepted by google ads so it will be aborted by rudder.
  if (!fallbackIDFAZero && !get(message, "context.device.advertisingId")) {
    throw new Error("No advertisingId set. Aborting message");
  }
  const payload = constructPayload(message, category);
  if (payload) {
    payload.dev_token = devToken;
    payload.link_id = linkId;
    payload.app_event_type = setEventType(message);
    // This field is required if app_event_type is custom.
    if (payload.app_event_type === "custom") {
      payload.app_event_name = setEventName(message);
    }
    /**
     * Limit-ad-tracking status for the device.
     * 0: User has not chosen to limit ad tracking.
     * 1: User has chosen to limit ad tracking.
     */
    payload.lat = lat ? 1 : 0;
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
    const commonHeader = {
      "User-Agent": get(message, "context.userAgent"),
      "X-Forwarded-For":
        get(message, "context.ip") || get(message, "request_ip"),
      "Content-Type": "application/json; charset=utf-8"
    };
    if (
      Object.keys(response.body.JSON).length === 0 &&
      response.body.JSON.constructor === Object
    ) {
      response.headers = {
        ...commonHeader,
        "Content-Length": 0
      };
    } else {
      response.headers = {
        ...commonHeader
      };
    }
    return response;
  }
  // fail-safety for developer error
  throw new Error("Payload could not be constructed");
}

const processEvent = (message, destination) => {
  if (!message.type) {
    throw Error("Message Type is not present. Aborting message.");
  }

  const messageType = message.type.toLowerCase();
  let category;
  switch (messageType) {
    case EventType.TRACK:
      if (!get(message, "event")) {
        throw new Error("Track event without event name. Aborting message.");
      }
      category = trackConfig;
      break;
    default:
      throw new Error("Message type not supported");
  }

  // build the response
  return responseBuilderSimple(message, category, destination);
};

const process = event => {
  return processEvent(event.message, event.destination);
};

exports.process = process;
