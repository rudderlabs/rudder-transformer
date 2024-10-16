/* eslint-disable no-param-reassign */
const sha256 = require('sha256');
const { InstrumentationError, ConfigurationError } = require('@rudderstack/integrations-lib');
const {
  isDefinedAndNotNull,
  isDefined,
  getHashFromArrayWithDuplicate,
  validateEventName,
} = require('../../../../v0/util');
const { API_VERSION } = require('./config');

const VALID_ACTION_SOURCES = ['app_android', 'app_ios', 'web', 'offline'];

const ecomEventMaps = [
  {
    src: ['order completed'],
    dest: 'checkout',
  },
  {
    src: ['product added'],
    dest: 'add_to_cart',
  },
  {
    src: ['products searched', 'product list filtered'],
    dest: 'search',
  },
];

const USER_NON_ARRAY_PROPERTIES = ['client_user_agent', 'client_ip_address'];

const getHashedValue = (key, value) => {
  switch (key) {
    case 'em':
    case 'ct':
    case 'st':
    case 'country':
    case 'ln':
    case 'fn':
    case 'ge':
      value = Array.isArray(value)
        ? value.map((val) => val.toString().trim().toLowerCase())
        : value.toString().trim().toLowerCase();
      break;
    case 'ph':
      // phone numbers should only contain digits & should not contain leading zeros
      value = Array.isArray(value)
        ? value.map((val) => val.toString().replace(/\D/g, '').replace(/^0+/, ''))
        : value.toString().replace(/\D/g, '').replace(/^0+/, '');
      break;
    case 'zp':
      // zip fields should only contain digits
      value = Array.isArray(value)
        ? value.map((val) => val.toString().trim().replace(/\D/g, ''))
        : value.toString().replace(/\D/g, '');
      break;
    case 'hashed_maids':
    case 'external_id':
    case 'db':
      // no action needed on value
      break;
    default:
      return String(value);
  }
  return Array.isArray(value) ? value.map((val) => sha256(val)) : [sha256(value)];
};

/**
 *
 * @param {*} userPayload Payload mapped from user fields
 * @returns
 * Further Processing the user fields following the instructions of Pinterest Conversion API
 * Ref: https://s.pinimg.com/ct/docs/conversions_api/dist/v3.html
 */
const processUserPayload = (userPayload) => {
  Object.keys(userPayload).forEach((key) => {
    userPayload[key] = getHashedValue(key, userPayload[key]);
  });
  return userPayload;
};

/**
 *
 * @param {*} eventName // ["WatchVideo", "ViewCategory", "Custom"]
 * @returns // ["watch_video", "view_category", "custom""]
 * This function will return the snake case name of the destination config mapped event
 */
const convertToSnakeCase = (eventName) =>
  eventName.map((str) =>
    str
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/\s+/g, '_')
      .toLowerCase(),
  );

/**
 *
 * @param {*} message
 * @param {*} Config
 * @returns
 * For the few ecommerce events the mapping is like following:
 * const ecomEventMaps = [
    {
      src: ["order completed"],
      dest: "checkout",
    },
    {
      src: ["product added"],
      dest: "add_to_cart",
    },
    {
      src: ["products searched", "product list filtered"],
      dest: "search",
    },
  ];
 * For others, it depends on mapping from the UI. If any event, other than mapped events are sent,
 * will be labled as "custom" events.
 */
const deduceTrackScreenEventName = (message, Config) => {
  let eventName;
  const { event, name } = message;
  const { eventsMapping, sendAsCustomEvent } = Config;
  const trackEventOrScreenName = event || name;
  if (!trackEventOrScreenName) {
    throw new InstrumentationError('event_name could not be mapped. Aborting');
  }
  validateEventName(trackEventOrScreenName);

  /*
  Step 1: If the event is not amongst the above list of ecommerce events, will look for
          the event mapping in the UI. In case it is similar, will map to that.
   */
  if (eventsMapping.length > 0) {
    const keyMap = getHashFromArrayWithDuplicate(eventsMapping, 'from', 'to', false);
    eventName = keyMap[trackEventOrScreenName];
  }
  if (isDefined(eventName)) {
    return convertToSnakeCase([...eventName]);
  }

  /*
  Step 2: To find if the particular event is amongst the list of standard
          Rudderstack ecommerce events, used specifically for Pinterest Conversion API
          mappings.
  */
  if (!eventName) {
    const eventMapInfo = ecomEventMaps.find((eventMap) => {
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
  Step 3: In case both of the above stated cases fail, will check if sendAsCustomEvent toggle is enabled in UI. 
          If yes, then we will send it as custom event
    */
  if (sendAsCustomEvent) {
    return ['custom'];
  }

  /* 
  Step 4: In case all of the above stated cases failed, will send the event name as it is.
          This is going to be reflected as "unknown" event in conversion API dashboard.
  */
  return [trackEventOrScreenName];
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
    quantity: parseInt(rootObject.quantity || message.properties.quantity || 1, 10),
    item_price: String(rootObject.price || message.properties.price),
  };
  return {
    contentId: rootObject.product_id || rootObject.sku || rootObject.id,
    content: contentObj,
  };
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
  Object.keys(userPayload).forEach((key) => {
    if (!USER_NON_ARRAY_PROPERTIES.includes(key)) {
      if (Array.isArray(userPayload[key])) {
        processedHashedUserPayload[key] = [...userPayload[key]];
      } else {
        processedHashedUserPayload[key] = [userPayload[key]];
      }
    } else {
      processedHashedUserPayload[key] = userPayload[key];
    }
  });
  // multiKeyMap will works on only specific values like m, male, MALE, f, F, Female
  // if hashed data is sent from the user, it is directly set over here
  const gender = message.traits?.gender || message.context?.traits?.gender;
  if (gender && Array.isArray(gender)) {
    processedHashedUserPayload.ge = [...gender];
  } else if (gender) {
    processedHashedUserPayload.ge = [gender];
  }
  return processedHashedUserPayload;
};

const validateInput = (message, { Config }) => {
  const { apiVersion = API_VERSION.v3, advertiserId, adAccountId, conversionToken } = Config;
  if (apiVersion === API_VERSION.v3 && !advertiserId) {
    throw new ConfigurationError('Advertiser Id not found. Aborting');
  }

  if (apiVersion === API_VERSION.v5) {
    if (!adAccountId) {
      throw new ConfigurationError('Ad Account ID not found. Aborting');
    }

    if (!conversionToken) {
      throw new ConfigurationError('Conversion Token not found. Aborting');
    }
  }

  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }
};

module.exports = {
  processUserPayload,
  processHashedUserPayload,
  VALID_ACTION_SOURCES,
  ecomEventMaps,
  convertToSnakeCase,
  validateInput,
};
