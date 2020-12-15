const get = require("get-value");
const { CONFIG_CATEGORIES, MAPPING_CONFIG, baseEndpoint } = require("./config");
const {
  constructPayload,
  defaultPostRequestConfig,
  defaultRequestConfig
} = require("../../util");
const { EventType } = require("../../../constants");

function setEventName(message) {
  const defaultEventTypes = [
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
  const isDefaultName = defaultEventTypes.indexOf(eventName) >= 0;
  if (isDefaultName) {
    throw new Error(
      "Event name is a reserved event name in Google Ads. Aborting Message"
    );
  }
  return eventName;
}
function setEventType(message) {
  const eventName = get(message, "event");
  switch (eventName.toLowerCase()) {
    case "application installed":
      return "first_open";
    case "order completed":
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
  const { Config } = destination;
  const { devToken, linkId, version, lat, fallbackIDFAZero } = Config;
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  if (payload) {
    payload.dev_token = devToken;
    payload.link_id = linkId;
    payload.app_event_type = setEventType(message);
    if (payload.app_event_type === "custom") {
      payload.app_event_name = setEventName(message);
    }
    payload.lat = lat ? 1 : 0;
    if (get(message, "context.device.type") === "Android") {
      payload.id_type = "advertisingid";
    } else {
      payload.id_type = "idfa";
    }
    if (fallbackIDFAZero && !payload.rdid) {
      payload.rdid = "00000000-0000-0000-0000-000000000000";
    } else if (!fallbackIDFAZero && !payload.rdid) {
      throw new Error("No advertisingId set. Aborting message");
    }
    const response = defaultRequestConfig(message);
    response.endpoint = `${baseEndpoint}/${version}`;
    response.method = defaultPostRequestConfig.requestMethod;
    response.body.JSON = get(message, "properties");
    if (response.body.JSON) {
      response.headers = {
        "User-Agent": get(message, "context.userAgent"),
        "X-Forwarded-For":
          get(message, "reques_ip") || get(message, "context.ip"),
        "Content-Type": "application/json; charset=utf-8"
      };
    } else {
      response.headers = {
        "User-Agent": get(message, "context.userAgent"),
        "X-Forwarded-For":
          get(message, "reques_ip") || get(message, "context.ip"),
        "Content-Type": "application/json; charset=utf-8",
        "Content-Length": 0
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
      category = CONFIG_CATEGORIES.TRACK;
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
