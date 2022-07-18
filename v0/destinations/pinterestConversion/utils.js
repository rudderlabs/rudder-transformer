/* eslint-disable no-param-reassign */
const sha256 = require("sha256");
const { EventType } = require("../../../constants");
const {
  CustomError,
  constructPayload,
  isDefinedAndNotNull,
  getHashFromArray
} = require("../../util");
const { COMMON_CONFIGS } = require("./config");

const VALID_ACTION_SOURCES = ["app_android", "app_ios", "web", "offline"];

const ecomEventMaps = [
  {
    src: ["order completed"],
    dest: "Checkout"
  },
  {
    src: ["product added"],
    dest: "AddToCart"
  },
  {
    src: ["products searched", "product list filtered"],
    dest: "Search"
  }
];

/**
 *
 * @param {*} userPayload Payload mapped from user fields
 * @returns
 * Further Processing the user fields following the instructions of Pinterest Conversion API
 * Ref: https://s.pinimg.com/ct/docs/conversions_api/dist/v3.html
 */
const processUserPayload = userPayload => {
  let formatValue = "";
  Object.keys(userPayload).forEach(key => {
    switch (key) {
      case "em":
        formatValue = userPayload[key].toString().toLowerCase();
        userPayload[key] = [sha256(formatValue)];
        break;
      case "ph":
      case "zp":
        // zip fields should only contain digits
        formatValue = userPayload[key].toString().replace(/[^0-9]/g, "");
        if (key === "ph") {
          // phone numbers should not contain leading zeros
          formatValue = formatValue.replace(/^0+/, "");
        }
        userPayload[key] = [sha256(formatValue)];
        break;
      case "ct":
      case "st":
      case "country":
        userPayload[key] = [sha256(formatValue)];
        break;
      case "ge":
      case "db":
      case "ln":
      case "fn":
      case "hashed_maids":
        userPayload[key] = [userPayload[key]];
        break;
      default:
        userPayload[key] = String(userPayload[key]);
    }
  });
  return userPayload;
};

/**
 *
 * @param {*} message
 * @returns
 * Maps the required common parameters accross event types. Checks for the correct
 * action source types and deduces opt_out status
 * Ref: https://s.pinimg.com/ct/docs/conversions_api/dist/v3.html
 */
const processCommonPayload = message => {
  const commonPayload = constructPayload(message, COMMON_CONFIGS);
  const presentActionSource = commonPayload.action_source;
  if (
    presentActionSource &&
    !VALID_ACTION_SOURCES.includes(presentActionSource.toLowerCase())
  ) {
    throw new CustomError(
      "Action source must be one of 'app_android', 'app_ios', 'web', 'offline' ",
      400
    );
  }
   const adTrackingEnabled = message.context?.device?.adTrackingEnabled;

  if(isDefinedAndNotNull(adTrackingEnabled)) {
        if(adTrackingEnabled === true) {
          commonPayload.opt_out = false;
        } else if (adTrackingEnabled === false) {
          commonPayload.opt_out = true;
        }
  }
  return commonPayload;
};

/**
 * 
 * @param {*} message 
 * @param {*} Config 
 * @returns 
 * For the few ecommerce events the mapping is like following:
 * const ecomEventMaps = [
    {
      src: ["order completed"],
      dest: "Checkout",
    },
    {
      src: ["product added"],
      dest: "AddToCart",
    },
    {
      src: ["products searched", "product list filtered"],
      dest: "Search",
    },
  ];
 * For others, it depends on mapping from the UI. If any event, other than mapped events are sent,
 * will be labled as "custom" events.
 */

const deduceTrackEventName = (message, Config) => {
  const { event } = message;
  let eventName = "";
  /*
  Step 1: To find if the particular event is amongst the list of standard 
          Rudderstack ecommerce events, used specifically for Pinterest Conversion API 
          mappings.
  */
  const eventMapInfo = ecomEventMaps.find(eventMap => {
    if (eventMap.src.includes(event.toLowerCase())) {
      return eventMap;
    }
    return false;
  });
  /*
  Step 2: If the event is not amongst the above list of ecommerce events, will look for
          the event mapping in the UI. In case it is similar, will map to that.
   */
  if (!eventMapInfo && Config.eventsMapping.length > 0) {
    const keyMap = getHashFromArray(Config.eventsMapping, "from", "to", false);
    eventName = keyMap[event];
  } else if (isDefinedAndNotNull(eventMapInfo)) {
    eventName = eventMapInfo.dest;
  }
  /*
  Step 3: In case both of the above stated cases fail, will mark the event as "custom"
 */
  if (!isDefinedAndNotNull(eventName)) {
    eventName = "custom";
  }

  return eventName;
};

/**
 *
 * @param {*} message event.message
 * @param {*} Config event.destination.Config
 * @returns
 * Returns the appropriate event name for each event types
 * For identify : "identify".
 * For page : "ViewCategory" in case category is present, "PageVisit" otherwise.
 * For track : Depends on the event name
 */
const deduceEventName = (message, Config) => {
  const { type } = message;
  let eventName = "";
  switch (type) {
    case EventType.IDENTIFY:
      eventName = "identify";
      break;
    case EventType.PAGE:
      eventName = isDefinedAndNotNull(message.category)
        ? "ViewCategory"
        : "PageVisit";
      break;
    case EventType.TRACK:
      eventName = deduceTrackEventName(message, Config);
      break;
    default:
      throw new CustomError(`The event of type ${type} is not supported`, 400);
  }

  return eventName;
};

/**
 *
 * @param {*} rootObject object from where the price, quantity and ids will be fetched
 * @param {*} message event.message
 * @returns
 * Object containing the deduced parameters
 */
const setIdPriceQuantity = (rootObject, message) => {
  const contentObj = {
    // we are yet to check how the destination behaves if one of quantity and item_price is missing
    quantity: parseInt(
      rootObject.quantity || message.properties.quantity || 1,
      10
    ),
    item_price: String(rootObject.price || message.properties.price)
  };
  const prodParameters = {
    contentId: rootObject.product_id || rootObject.sku || rootObject.id,
    content: contentObj
  };
  return prodParameters;
};

/**
 * @param {*} userPayload Payload mapped from user fields
 * @returns returns true if at least one of: em, hashed_maids or combination of client_ip_address and
 * client_user_agent is present. And false otherwise.
 */
const checkUserPayloadValidity = userPayload => {
  const userFields = Object.keys(userPayload);
  if (userFields.includes("em") || userFields.includes("hashed_maids")) {
    return true;
  }
  if (
    userFields.includes("client_ip_address") &&
    userFields.includes("client_user_agent")
  ) {
    return true;
  }
  return false;
};

module.exports = {
  processUserPayload,
  processCommonPayload,
  deduceEventName,
  setIdPriceQuantity,
  checkUserPayloadValidity,
  VALID_ACTION_SOURCES
};
