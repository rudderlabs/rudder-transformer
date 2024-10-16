/* eslint-disable no-param-reassign */
const sha256 = require('sha256');
const { InstrumentationError, ConfigurationError } = require('@rudderstack/integrations-lib');

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
