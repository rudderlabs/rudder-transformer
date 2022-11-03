/* eslint-disable no-param-reassign */
const sha256 = require("sha256");
const { EventType } = require("../../../constants");
const {
  CustomError,
  constructPayload,
  isDefinedAndNotNull,
  isDefined,
  getHashFromArrayWithDuplicate
} = require("../../util");
const { COMMON_CONFIGS, CUSTOM_CONFIGS } = require("./config");

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

const USER_NON_ARRAY_PROPERTIES = ["client_user_agent", "client_ip_address"];

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
      case "ge":
      case "db":
      case "ln":
      case "fn":
      case "hashed_maids":
        userPayload[key] = [sha256(userPayload[key])];
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
 * @returns opt_out status
 *
 */

const deduceOptOutStatus = message => {
  const adTrackingEnabled = message.context?.device?.adTrackingEnabled;
  let optOut;

  // for ios
  if (isDefinedAndNotNull(adTrackingEnabled)) {
    if (adTrackingEnabled === true) {
      optOut = false;
    } else if (adTrackingEnabled === false) {
      optOut = true;
    }
  }

  return optOut;
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
      `Action source must be one of ${VALID_ACTION_SOURCES.join(", ")}`,
      400
    );
  }

  commonPayload.opt_out = deduceOptOutStatus(message);

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
const deduceTrackScreenEventName = (message, Config) => {
  let eventName;
  const { event, name } = message;
  const trackEventOrScreenName = event || name;
  if (!trackEventOrScreenName) {
    throw new CustomError(
      "[Pinterest Conversion]:: event_name could not be mapped. Aborting.",
      400
    );
  }

  /*
  Step 1: If the event is not amongst the above list of ecommerce events, will look for
          the event mapping in the UI. In case it is similar, will map to that.
   */
  if (Config.eventsMapping.length > 0) {
    const keyMap = getHashFromArrayWithDuplicate(
      Config.eventsMapping,
      "from",
      "to",
      false
    );
    eventName = keyMap[trackEventOrScreenName];
  }
  if (isDefined(eventName)) {
    return [...eventName];
  }

  /*
  Step 2: To find if the particular event is amongst the list of standard
          Rudderstack ecommerce events, used specifically for Pinterest Conversion API
          mappings.
  */
  if (!eventName) {
    const eventMapInfo = ecomEventMaps.find(eventMap => {
      if (eventMap.src.includes(trackEventOrScreenName.toLowerCase())) {
        return eventMap;
      }
      return false;
    });

    if (isDefinedAndNotNull(eventMapInfo)) {
      return [eventMapInfo.dest];
    }
  }

  /*
  Step 3: In case both of the above stated cases fail, will send the event name as it is.
          This is going to be reflected as "unknown" event in conversion API dashboard.
 */
  return ["custom"];
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
  let eventName = [];
  switch (type) {
    case EventType.PAGE:
      eventName = isDefinedAndNotNull(message.category)
        ? ["ViewCategory"]
        : ["PageVisit"];
      break;
    case EventType.TRACK:
    case EventType.SCREEN:
      eventName = deduceTrackScreenEventName(message, Config);
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
  return {
    contentId: rootObject.product_id || rootObject.sku || rootObject.id,
    content: contentObj
  };
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
  return (
    userFields.includes("client_ip_address") &&
    userFields.includes("client_user_agent")
  );
};

/**
 *
 * @param {*} userPayload
 * @param {*} message
 * @returns converts every single hashed user data property to array, except for
 * "client_user_agent", "client_ip_address"
 *
 */
const processHashedUserPayload = (userPayload, message) => {
  const processedHashedUserPayload = {};
  for (const key of Object.keys(userPayload)) {
    if (!USER_NON_ARRAY_PROPERTIES.includes(key)) {
      processedHashedUserPayload[key] = [userPayload[key]];
    } else {
      processedHashedUserPayload[key] = userPayload[key];
    }
  }
  // multiKeyMap will works on only specific values like m, male, MALE, f, F, Female
  // if hashed data is sent from the user, it is directly set over here
  processedHashedUserPayload.ge = [
    message.traits?.gender || message.context?.traits?.gender
  ];
  return processedHashedUserPayload;
};

/**
 * This function will process the ecommerce fields and return the final payload
 * @param {*} message
 * @param {*} mandatoryPayload
 * @returns
 */
const postProcessEcomFields = (message, mandatoryPayload) => {
  let totalQuantity = 0;
  let quantityInconsistent = false;
  const contentArray = [];
  const contentIds = [];
  const { properties } = message;
  // ref: https://s.pinimg.com/ct/docs/conversions_api/dist/v3.html
  let customPayload = constructPayload(message, CUSTOM_CONFIGS);

  // if product array is present will look for the product level information
  if (
    properties.products &&
    Array.isArray(properties.products) &&
    properties.products.length > 0
  ) {
    const { products } = properties;
    products.forEach(product => {
      const prodParams = setIdPriceQuantity(product, message);
      contentIds.push(prodParams.contentId);
      contentArray.push(prodParams.content);
      if (!product.quantity) {
        quantityInconsistent = true;
      }
      totalQuantity = product.quantity
        ? totalQuantity + product.quantity
        : totalQuantity;
    });

    if (totalQuantity === 0) {
      /*
      in case any of the products inside product array does not have quantity,
       will map the quantity of root level
      */
      totalQuantity = properties.quantity;
    }
  } else {
    /*
    for the events where product array is not present, root level id, price and
    quantity are taken into consideration
    */
    const prodParams = setIdPriceQuantity(message.properties, message);
    contentIds.push(prodParams.contentId);
    contentArray.push(prodParams.content);
    totalQuantity = properties.quantity
      ? totalQuantity + properties.quantity
      : totalQuantity;
  }
  /*
    if properties.numOfItems is not provided by the user, the total quantity of the products
    will be sent as num_items
  */
  if (
    !isDefinedAndNotNull(customPayload.num_items) &&
    quantityInconsistent === false
  ) {
    customPayload.num_items = parseInt(totalQuantity, 10);
  }
  customPayload = {
    ...customPayload,
    content_ids: contentIds,
    contents: contentArray
  };

  return {
    ...mandatoryPayload,
    custom_data: { ...customPayload }
  };
};

module.exports = {
  processUserPayload,
  processCommonPayload,
  deduceEventName,
  setIdPriceQuantity,
  checkUserPayloadValidity,
  processHashedUserPayload,
  VALID_ACTION_SOURCES,
  postProcessEcomFields,
  ecomEventMaps
};
