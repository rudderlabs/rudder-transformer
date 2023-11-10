/* eslint-disable no-param-reassign */
const sha256 = require('sha256');
const { InstrumentationError, ConfigurationError } = require('@rudderstack/integrations-lib');
const { EventType } = require('../../../constants');
const {
  constructPayload,
  isDefinedAndNotNull,
  isDefined,
  getHashFromArrayWithDuplicate,
  removeUndefinedAndNullValues,
} = require('../../util');
const { COMMON_CONFIGS, CUSTOM_CONFIGS, API_VERSION } = require('./config');

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
        ? value.map((val) => val.toString().toLowerCase())
        : value.toString().toLowerCase();
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
        ? value.map((val) => val.toString().replace(/\D/g, ''))
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
 * @param {*} message
 * @returns opt_out status
 *
 */

const deduceOptOutStatus = (message) => {
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
const processCommonPayload = (message) => {
  const commonPayload = constructPayload(message, COMMON_CONFIGS);
  const presentActionSource = commonPayload.action_source;
  if (presentActionSource && !VALID_ACTION_SOURCES.includes(presentActionSource.toLowerCase())) {
    throw new InstrumentationError(
      `Action source must be one of ${VALID_ACTION_SOURCES.join(', ')}`,
    );
  }

  commonPayload.opt_out = deduceOptOutStatus(message);

  return commonPayload;
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
 * @param {*} message event.message
 * @param {*} Config event.destination.Config
 * @returns
 * Returns the appropriate event name for each event types
 * For identify : "identify".
 * For page : "ViewCategory" in case category is present, "PageVisit" otherwise.
 * For track : Depends on the event name
 */
const deduceEventName = (message, Config) => {
  const { type, category } = message;
  let eventName = [];
  switch (type) {
    case EventType.PAGE:
      eventName = isDefinedAndNotNull(category) ? ['view_category'] : ['page_visit'];
      break;
    case EventType.TRACK:
    case EventType.SCREEN:
      eventName = deduceTrackScreenEventName(message, Config);
      break;
    default:
      throw new InstrumentationError(`The event of type ${type} is not supported`);
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
    quantity: parseInt(rootObject.quantity || message.properties.quantity || 1, 10),
    item_price: String(rootObject.price || message.properties.price),
  };
  return {
    contentId: rootObject.product_id || rootObject.sku || rootObject.id,
    content: contentObj,
  };
};

/**
 * @param {*} userPayload Payload mapped from user fields
 * @returns returns true if at least one of: em, hashed_maids or combination of client_ip_address and
 * client_user_agent is present. And false otherwise.
 */
const checkUserPayloadValidity = (userPayload) => {
  const userFields = Object.keys(userPayload);
  if (userFields.includes('em') || userFields.includes('hashed_maids')) {
    return true;
  }
  return userFields.includes('client_ip_address') && userFields.includes('client_user_agent');
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
  if (properties.products && Array.isArray(properties.products) && properties.products.length > 0) {
    const { products, quantity } = properties;
    products.forEach((product) => {
      const prodParams = setIdPriceQuantity(product, message);
      if (prodParams.contentId) {
        contentIds.push(prodParams.contentId);
      }
      contentArray.push(prodParams.content);
      if (!product.quantity) {
        quantityInconsistent = true;
      }
      totalQuantity = product.quantity ? totalQuantity + product.quantity : totalQuantity;
    });

    if (totalQuantity === 0) {
      /*
      in case any of the products inside product array does not have quantity,
       will map the quantity of root level
      */
      totalQuantity = quantity;
    }
  } else {
    /*
    for the events where product array is not present, root level id, price and
    quantity are taken into consideration
    */
    const prodParams = setIdPriceQuantity(properties, message);
    if (prodParams.contentId) {
      contentIds.push(prodParams.contentId);
    }
    contentArray.push(prodParams.content);
    totalQuantity = properties.quantity ? totalQuantity + properties.quantity : totalQuantity;
  }
  /*
    if properties.numOfItems is not provided by the user, the total quantity of the products
    will be sent as num_items
  */
  if (!isDefinedAndNotNull(customPayload.num_items) && quantityInconsistent === false) {
    customPayload.num_items = parseInt(totalQuantity, 10);
  }
  customPayload = {
    ...customPayload,
    contents: contentArray,
  };

  if (contentIds.length > 0) {
    customPayload.content_ids = contentIds;
  }

  return {
    ...mandatoryPayload,
    custom_data: { ...removeUndefinedAndNullValues(customPayload) },
  };
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
  processCommonPayload,
  deduceEventName,
  setIdPriceQuantity,
  checkUserPayloadValidity,
  processHashedUserPayload,
  VALID_ACTION_SOURCES,
  postProcessEcomFields,
  ecomEventMaps,
  convertToSnakeCase,
  validateInput,
};
