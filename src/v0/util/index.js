// ========================================================================
// Make sure you are putting any new method in relevant section
// INLINERS ==> Inline methods
// REQUEST FORMATS ==> Various request formats to format the final response
// TRANSFORMER UTILITIES ==> Utility methods having dependency on event/message
// GENERIC ==> Other methods which doesn't fit in other categories
// ========================================================================
const Handlebars = require('handlebars');

const fs = require('fs');
const path = require('path');
const lodash = require('lodash');
const { setValue: set } = require('@rudderstack/integrations-lib');
const get = require('get-value');
const uaParser = require('ua-parser-js');
const moment = require('moment-timezone');
const sha256 = require('sha256');
const crypto = require('crypto');
const { v5 } = require('uuid');
const {
  InstrumentationError,
  BaseError,
  PlatformError,
  TransformationError,
  OAuthSecretError,
  getErrorRespEvents,
} = require('@rudderstack/integrations-lib');

const { JsonTemplateEngine, PathType } = require('@rudderstack/json-template-engine');
const isString = require('lodash/isString');
const logger = require('../../logger');
const stats = require('../../util/stats');
const { DestCanonicalNames, DestHandlerMap } = require('../../constants/destinationCanonicalNames');
const { client: errNotificationClient } = require('../../util/errorNotifier');
const { HTTP_STATUS_CODES, VDM_V2_SCHEMA_VERSION } = require('./constant');
const {
  REFRESH_TOKEN,
  AUTH_STATUS_INACTIVE,
} = require('../../adapters/networkhandler/authConstants');
const { FEATURE_FILTER_CODE, FEATURE_GZIP_SUPPORT } = require('./constant');
const { CommonUtils } = require('../../util/common');

// ========================================================================
// INLINERS
// ========================================================================

const isDefined = (x) => !lodash.isUndefined(x);
const isNotEmpty = (x) => !lodash.isEmpty(x);
const isNotNull = (x) => x != null;
const isDefinedAndNotNull = (x) => isDefined(x) && isNotNull(x);
const isDefinedAndNotNullAndNotEmpty = (x) => isDefined(x) && isNotNull(x) && isNotEmpty(x);
const removeUndefinedValues = (obj) => lodash.pickBy(obj, isDefined);
const removeNullValues = (obj) => lodash.pickBy(obj, isNotNull);
const removeUndefinedAndNullValues = (obj) => lodash.pickBy(obj, isDefinedAndNotNull);
const removeUndefinedAndNullAndEmptyValues = (obj) =>
  lodash.pickBy(obj, isDefinedAndNotNullAndNotEmpty);
const isBlank = (value) => lodash.isEmpty(lodash.toString(value));
const flattenMap = (collection) => lodash.flatMap(collection, (x) => x);
const isNull = (x) => lodash.isNull(x);
// ========================================================================
// GENERIC UTLITY
// ========================================================================

const removeUndefinedAndNullRecurse = (obj) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const key in obj) {
    if (obj[key] === null || obj[key] === undefined) {
      // eslint-disable-next-line no-param-reassign
      delete obj[key];
    } else if (typeof obj[key] === 'object') {
      removeUndefinedAndNullRecurse(obj[key]);
    }
  }
};

const getEventTime = (message) => {
  try {
    return new Date(message.timestamp).toISOString();
  } catch (err) {
    return new Date(message.originalTimestamp).toISOString();
  }
};

const base64Convertor = (string) => Buffer.from(string).toString('base64');

// return a valid URL object if correct else null
const isValidUrl = (url) => {
  try {
    return new URL(url);
  } catch (err) {
    return null;
  }
};

const stripTrailingSlash = (str) => (str && str.endsWith('/') ? str.slice(0, -1) : str);

const isPrimitive = (arg) => {
  const type = typeof arg;
  return arg == null || (type !== 'object' && type !== 'function');
};

const isNewStatusCodesAccepted = (reqMetadata = {}) => {
  if (reqMetadata && typeof reqMetadata === 'object' && !Array.isArray(reqMetadata)) {
    const { features } = reqMetadata;
    return !!features?.[FEATURE_FILTER_CODE];
  }
  return false;
};

/**
 *
 * @param {*} arg
 * @returns {type}
 *
 * Returns type of passed arg
 * for null argss returns "NULL" insted of "object"
 *
 */
const getType = (arg) => {
  const type = typeof arg;
  if (arg == null) {
    return 'NULL';
  }
  if (Array.isArray(arg)) {
    return 'array';
  }
  return type;
};

const formatValue = (value) => {
  if (!value || value < 0) return null;
  return Math.round(value);
};

const isObject = (value) => {
  const type = typeof value;
  return value != null && (type === 'object' || type === 'function') && !Array.isArray(value);
};

function isEmpty(input) {
  return lodash.isEmpty(lodash.toString(input).trim());
}

/**
 * Returns true for empty object {}
 * @param {*} obj
 * @returns
 */
function isEmptyObject(obj) {
  if (!obj) {
    logger.warn('input is undefined or null');
    return true;
  }
  return Object.keys(obj).length === 0;
}

/**
 * Function to check if value is Defined, Not null and Not Empty.
 * Create this function, Because existing isDefinedAndNotNullAndNotEmpty(123) is returning false due to lodash lodash.isEmpty function.
 * lodash.isEmpty is used to detect empty collections/objects and it will return true for Integer, Boolean values.
 * ref: https://github.com/lodash/lodash/issues/496
 * @param {*} value 123
 * @returns yes
 */
const isDefinedNotNullNotEmpty = (value) =>
  !(
    value === undefined ||
    value === null ||
    Number.isNaN(value) ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  );

const removeUndefinedNullEmptyExclBoolInt = (obj) => lodash.pickBy(obj, isDefinedNotNullNotEmpty);

/**
 * Function to remove empty key ("") from payload
 * @param {*} payload {"key1":"a","":{"id":1}}
 * @returns // {"key1":"a"}
 */
const removeEmptyKey = (payload) => {
  const rawPayload = payload;
  const key = '';
  if (Object.prototype.hasOwnProperty.call(rawPayload, key)) {
    delete rawPayload[''];
  }
  return rawPayload;
};

/**
 * Recursively removes undefined, null, empty objects, and empty arrays from the given object at all levels.
 * @param {*} obj
 * @returns
 */
const removeUndefinedNullValuesAndEmptyObjectArray = (obj) => {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  function recursive(obj) {
    if (Array.isArray(obj)) {
      const cleanedArray = obj
        .map((item) => recursive(item))
        .filter((item) => isDefinedAndNotNull(item));
      return cleanedArray.length === 0 ? null : cleanedArray;
    }
    if (obj && typeof obj === 'object') {
      const data = {};
      Object.entries(obj).forEach(([key, value]) => {
        const cleanedValue = recursive(value);
        if (isDefinedAndNotNull(cleanedValue)) {
          data[key] = cleanedValue;
        }
      });
      return Object.keys(data).length === 0 ? null : data;
    }
    return obj;
  }
  const newObj = recursive(obj);
  return isDefinedAndNotNull(newObj) ? newObj : {};
};

// Format the destination.Config.dynamicMap arrays to hashMap
const getHashFromArray = (arrays, fromKey = 'from', toKey = 'to', isLowerCase = true) => {
  const hashMap = {};
  if (Array.isArray(arrays)) {
    arrays.forEach((array) => {
      if (isEmpty(array[fromKey])) return;
      hashMap[isLowerCase ? array[fromKey].toLowerCase() : array[fromKey]] = array[toKey];
    });
  }
  return hashMap;
};

/**
 * Format the destination.Config.dynamicMap arrays to hashMap
 * where value is an array
 * @param  {} arrays [{"from":"prop1","to":"val1"},{"from":"prop1","to":"val2"},{"from":"prop2","to":"val2"}]
 * @param  {} fromKey="from"
 * @param  {} toKey="to"
 * @param  {} isLowerCase=true
 * @param  {} return hashmap {"prop1":["val1","val2"],"prop2":["val2"]}
 */
const getHashFromArrayWithDuplicate = (
  arrays,
  fromKey = 'from',
  toKey = 'to',
  isLowerCase = true,
) => {
  const hashMap = {};
  if (Array.isArray(arrays)) {
    arrays.forEach((array) => {
      if (isEmpty(array[fromKey])) return;
      const key = isLowerCase ? array[fromKey].toLowerCase().trim() : array[fromKey].trim();

      if (hashMap[key]) {
        hashMap[key].add(array[toKey]);
      } else {
        hashMap[key] = new Set();
        hashMap[key].add(array[toKey]);
      }
    });
  }
  return hashMap;
};

/**
 * Format the arrays to hashMap with key as `fromKey` and value as Object
 * @param {*} arrays [{"id":"a0b8efe1-c828-4c63-8850-0d0742888f9d","name":"Email","type":"email","type_config":{},"date_created":"1662225840284","hide_from_guests":false,"required":false}]
 * @param {*} fromKey name
 * @param {*} isLowerCase false
 * @returns // {"Email":{"id":"a0b8efe1-c828-4c63-8850-0d0742888f9d","name":"Email","type":"email","type_config":{},"date_created":"1662225840284","hide_from_guests":false,"required":false}}
 */
const getHashFromArrayWithValueAsObject = (arrays, fromKey = 'from', isLowerCase = true) => {
  const hashMap = {};
  if (Array.isArray(arrays)) {
    arrays.forEach((array) => {
      if (isEmpty(array[fromKey])) return;
      hashMap[isLowerCase ? array[fromKey].toLowerCase() : array[fromKey]] = array;
    });
  }
  return hashMap;
};

// get the value from the message given a key
// it'll look for properties, traits and context.traits in the order
const getValueFromPropertiesOrTraits = ({ message, key }) => {
  const keySet = ['properties', 'traits', 'context.traits'];

  const val = lodash.find(
    lodash.map(keySet, (k) => get(message, `${k}.${key}`)),
    (v) => !lodash.isNil(v),
  );
  return !lodash.isNil(val) ? val : null;
};

/**
 * Checks if an object contains a circular reference.
 *
 * @param {object} obj - The object to check for circular references.
 * @param {array} [seen=[]] - An array that keeps track of objects already seen during the recursive traversal. Defaults to an empty array.
 * @returns {boolean} - True if a circular reference is found, false otherwise.
 */
const hasCircularReference = (obj, seen = []) => {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  if (seen.includes(obj)) {
    return true;
  }

  seen.push(obj);
  // eslint-disable-next-line no-restricted-syntax
  for (const value of Object.values(obj)) {
    if (hasCircularReference(value, seen)) {
      return true;
    }
  }
  seen.pop();
  return false;
};

// function to flatten a json
function flattenJson(data, separator = '.', mode = 'normal', flattenArrays = true) {
  const result = {};
  if (hasCircularReference(data)) {
    throw new InstrumentationError("Event has circular reference. Can't flatten the event");
  }

  // a recursive function to loop through the array of the data
  function recurse(cur, prop) {
    let i;
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      if (flattenArrays || typeof cur?.[0] === 'object') {
        for (i = 0; i < cur.length; i += 1) {
          if (mode === 'strict') {
            recurse(cur[i], `${prop}${separator}${i}`);
          } else {
            recurse(cur[i], `${prop}[${i}]`);
          }
        }
        if (cur.length === 0) {
          result[prop] = [];
        }
      } else {
        // to not flatten the array of non-object (string, booleans, numbers)
        result[prop] = cur;
      }
    } else {
      let isEmptyFlag = true;
      Object.keys(cur).forEach((key) => {
        isEmptyFlag = false;
        recurse(cur[key], prop ? `${prop}${separator}${key}` : key);
      });
      if (isEmptyFlag && prop) result[prop] = {};
    }
  }
  recurse(data, '');
  return result;
}

// Get the offset value in Seconds for timezone

const getOffsetInSec = (value) => {
  const name = moment.tz.zone(value);
  if (name) {
    const x = moment().tz(value).format('Z');
    const split = x.split(':');
    const hour = Number(split[0]);
    const min = Number(split[1]);
    let sec = 0;
    sec = hour < 0 ? -1 * (hour * -60 * 60 + min * 60) : hour * 60 * 60 + min * 60;
    return sec;
  }
  return undefined;
};

// Important !@!
// format date in yyyymmdd format
// NEED TO DEPRECATE
const getDateInFormat = (date) => {
  const x = new Date(date);
  const y = x.getFullYear().toString();
  let m = (x.getMonth() + 1).toString();
  let d = x.getDate().toString();
  d = d.length === 1 ? d : `0${d}`;
  m = m.length === 1 ? m : `0${m}`;
  const yyyymmdd = y + m + d;
  return yyyymmdd;
};

// Important !@!
// Generic timestamp formatter
const formatTimeStamp = (dateStr, format) => {
  const date = new Date(dateStr);
  // moment format is passed. format accordingly
  if (format) {
    return moment.utc(date).format(format);
  }

  // return default format
  return date.getTime();
};

const hashToSha256 = (value) => sha256(value);

// Check what type of gender and convert to f or m
const getFbGenderVal = (gender) => {
  if (typeof gender !== 'string') {
    return null;
  }
  if (
    gender.toUpperCase() === 'FEMALE' ||
    gender.toUpperCase() === 'F' ||
    gender.toUpperCase() === 'WOMAN'
  ) {
    return hashToSha256('f');
  }
  if (
    gender.toUpperCase() === 'MALE' ||
    gender.toUpperCase() === 'M' ||
    gender.toUpperCase() === 'MAN'
  ) {
    return hashToSha256('m');
  }
  return null;
};

// ========================================================================
// REQUEST FORMAT METHODS
// ========================================================================

// GET
const defaultGetRequestConfig = {
  requestFormat: 'PARAMS',
  requestMethod: 'GET',
};

// POST
const defaultPostRequestConfig = {
  requestFormat: 'JSON',
  requestMethod: 'POST',
};

// DELETE
const defaultDeleteRequestConfig = {
  requestFormat: 'JSON',
  requestMethod: 'DELETE',
};

// PUT
const defaultPutRequestConfig = {
  requestFormat: 'JSON',
  requestMethod: 'PUT',
};
// PATCH
const defaultPatchRequestConfig = {
  requestFormat: 'JSON',
  requestMethod: 'PATCH',
};

// DEFAULT
// TODO: add builder pattern to generate request and batchRequest
// and set payload for JSON_ARRAY
// JSON_ARRAY: { payload: [] }
const defaultRequestConfig = () => ({
  version: '1',
  type: 'REST',
  method: 'POST',
  endpoint: '',
  headers: {},
  params: {},
  body: {
    JSON: {},
    JSON_ARRAY: {},
    XML: {},
    FORM: {},
  },
  files: {},
});

// JSON_ARRAY: { payload: [] }
const defaultBatchRequestConfig = () => ({
  batchedRequest: {
    version: '1',
    type: 'REST',
    method: 'POST',
    endpoint: '',
    headers: {},
    params: {},
    body: {
      JSON: {},
      JSON_ARRAY: {},
      XML: {},
      FORM: {},
    },
    files: {},
  },
});

// Router transformer
// Success responses
const getSuccessRespEvents = (
  message,
  metadata,
  destination,
  batched = false,
  statusCode = 200,
) => ({
  batchedRequest: message,
  metadata,
  batched,
  statusCode,
  destination,
});

// ========================================================================
// Error Message UTILITIES
// ========================================================================
const ErrorMessage = {
  TypeNotFound: 'Invalid payload. Property Type is not present',
  TypeNotSupported: 'Message type not supported',
  FailedToConstructPayload: 'Payload could not be constructed',
};

// ========================================================================
// TRANSFORMER UTILITIES
// ========================================================================
const MESSAGE_MAPPING = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, `./data/GenericFieldMapping.json`)),
);

// Get the IP address from the message.
// NEED TO DEPRECATE
const getParsedIP = (message) => {
  if (message.context && message.context.ip) {
    return message.context.ip;
  }
  return message.request_ip;
};

// Important !@!
// create the mappingConfig from data JSONs for destinations
const getMappingConfig = (config, dir) => {
  const mappingConfig = {};
  const categoryKeys = Object.keys(config);
  categoryKeys.forEach((categoryKey) => {
    const category = config[categoryKey];
    mappingConfig[category.name] = JSON.parse(
      fs.readFileSync(path.resolve(dir, `./data/${category.name}.json`)),
    );
  });
  return mappingConfig;
};

// NEED a better way to handle it. Only used in Autopilot and Intercom
// NEED TO DEPRECATE
const updatePayload = (currentKey, eventMappingArr, value, payload) => {
  eventMappingArr.forEach((obj) => {
    if (obj.rudderKey === currentKey) {
      set(payload, obj.expectedKey, value);
    }
  });
  return payload;
};

// This method handles the operations between two keys from the sourceKeys. One of the possible
// usecase is to calculate the value from the "price" and "quantity"
//
// Definition of the operation object is as follows
//
// {
//   "operation": "multiplication",
//   "args": [
//     {
//       "sourceKeys": "properties.price"
//     },
//     {
//       "sourceKeys": "properties.quantity",
//       "defaultVal": 1
//     }
//   ]
// }
//
// Supported operations are "addition", "multiplication"
//
const handleSourceKeysOperation = ({ message, operationObject }) => {
  const { operation, args } = operationObject;

  // populate the values from the arguments
  // in the same order it is populated
  const argValues = args.map((arg) => {
    const { sourceKeys, defaultVal } = arg;
    const val = get(message, sourceKeys);
    if (val || val === false || val === 0) {
      return val;
    }
    return defaultVal;
  });

  // quick sanity check for the undefined values in the list.
  // if there is any undefined values, return null
  // without going further for operations
  const isAllDefined = lodash.every(argValues, (v) => !lodash.isNil(v));
  if (!isAllDefined) {
    return null;
  }

  // start handling operations
  let result = null;
  switch (operation) {
    case 'multiplication':
      result = 1;
      // eslint-disable-next-line no-restricted-syntax
      for (const v of argValues) {
        if (lodash.isNumber(v)) {
          result *= v;
        } else if (lodash.isString(v) && /^[+-]?(\d+(\.\d*)?|\.\d+)([Ee][+-]?\d+)?$/.test(v)) {
          result *= parseFloat(v);
        } else {
          // if there is a non number argument simply return null
          // non numbers can't be operated arithmatically
          return null;
        }
      }
      return result;
    case 'addition':
      result = 0;
      // eslint-disable-next-line no-restricted-syntax
      for (const v of argValues) {
        if (lodash.isNumber(v)) {
          result += v;
        } else {
          // if there is a non number argument simply return null
          // non numbers can't be operated arithmatically
          return null;
        }
      }
      return result;
    default:
      return null;
  }
};

const getValueFromMessage = (message, sourceKeys) => {
  if (Array.isArray(sourceKeys) && sourceKeys.length > 0) {
    if (sourceKeys.length === 1) {
      logger.warn('List with single element is not ideal. Use it as string instead');
    }
    // got the possible sourceKeys
    // eslint-disable-next-line no-restricted-syntax
    for (const sourceKey of sourceKeys) {
      let val = null;
      // if the sourceKey is an object we expect it to be a operation
      if (typeof sourceKey === 'object') {
        val = handleSourceKeysOperation({
          message,
          operationObject: sourceKey,
        });
      } else {
        val = get(message, sourceKey);
      }
      if (val || val === false || val === 0) {
        // return only if the value is valid.
        // else look for next possible source in precedence
        return val;
      }
    }
  } else if (typeof sourceKeys === 'string') {
    // got a single key
    // - we don't need to iterate over a loop for a single possible value
    return get(message, sourceKeys);
  } else if (typeof sourceKeys === 'object') {
    // if the sourceKey is an object we expect it to be a operation
    return handleSourceKeysOperation({ message, operationObject: sourceKeys });
  } else {
    // wrong sourceKey type. abort
    // DEVELOPER ERROR
    // TODO - think of a way to crash the pod
    throw new PlatformError('Wrong sourceKey type or blank sourceKey array');
  }
  return null;
};

// get a field value from message.
// if sourceFromGenericMap is true get its value from GenericFieldMapping.json and use it as sourceKey
// else use sourceKey from `data/message.json` for actual field precedence
// Example usage: getFieldValueFromMessage(message, "userId",true)
//                This will return the first nonnull value from
//                ["userId", "traits.userId", "traits.id", "context.traits.userId", "context.traits.id", "anonymousId"]
const getFieldValueFromMessage = (message, sourceKey) => {
  const sourceKeyMap = MESSAGE_MAPPING[sourceKey];
  if (sourceKeyMap) {
    return getValueFromMessage(message, sourceKeyMap);
  }
  return null;
};

function checkTimestamp(validateTimestamp, formattedVal) {
  const {
    allowedPastTimeDifference,
    allowedPastTimeUnit, // seconds, minutes, hours
    allowedFutureTimeDifference,
    allowedFutureTimeUnit, // seconds, minutes, hours
  } = validateTimestamp;

  let pastTimeDifference;
  let futureTimeDifference;

  const currentTime = moment.unix(moment().format('X'));
  const time = moment.unix(moment(formattedVal).format('X'));

  switch (allowedPastTimeUnit) {
    case 'seconds':
      pastTimeDifference = Math.ceil(moment.duration(currentTime.diff(time)).asSeconds());
      break;
    case 'minutes':
      pastTimeDifference = Math.ceil(moment.duration(currentTime.diff(time)).asMinutes());
      break;
    case 'hours':
      pastTimeDifference = Math.ceil(moment.duration(currentTime.diff(time)).asHours());
      break;
    default:
      break;
  }

  if (pastTimeDifference > allowedPastTimeDifference) {
    throw new InstrumentationError(
      `Allowed timestamp is [${allowedPastTimeDifference} ${allowedPastTimeUnit}] into the past`,
    );
  }

  if (pastTimeDifference <= 0) {
    switch (allowedFutureTimeUnit) {
      case 'seconds':
        futureTimeDifference = Math.ceil(moment.duration(time.diff(currentTime)).asSeconds());
        break;
      case 'minutes':
        futureTimeDifference = Math.ceil(moment.duration(time.diff(currentTime)).asMinutes());
        break;
      case 'hours':
        futureTimeDifference = Math.ceil(moment.duration(time.diff(currentTime)).asHours());
        break;
      default:
        break;
    }

    if (futureTimeDifference > allowedFutureTimeDifference) {
      throw new InstrumentationError(
        `Allowed timestamp is [${allowedFutureTimeDifference} ${allowedFutureTimeUnit}] into the future`,
      );
    }
  }
}

// handle type and format
function formatValues(formattedVal, formattingType, typeFormat, integrationsObj) {
  let curFormattedVal = formattedVal;

  const formattingFunctions = {
    timestamp: () => {
      curFormattedVal = formatTimeStamp(formattedVal, typeFormat);
    },
    secondTimestamp: () => {
      if (!moment(formattedVal, 'x', true).isValid()) {
        curFormattedVal = Math.floor(formatTimeStamp(formattedVal, typeFormat) / 1000);
      }
    },
    microSecondTimestamp: () => {
      curFormattedVal = moment.unix(moment(formattedVal).format('X'));
      curFormattedVal =
        curFormattedVal.toDate().getTime() * 1000 + curFormattedVal.toDate().getMilliseconds();
    },
    flatJson: () => {
      curFormattedVal = flattenJson(formattedVal);
    },
    encodeURIComponent: () => {
      curFormattedVal = encodeURIComponent(formattedVal);
    },
    jsonStringify: () => {
      curFormattedVal = JSON.stringify(formattedVal);
    },
    jsonStringifyOnFlatten: () => {
      curFormattedVal = JSON.stringify(flattenJson(formattedVal));
    },
    dobInMMDD: () => {
      curFormattedVal = String(formattedVal).slice(5);
      curFormattedVal = curFormattedVal.replace('-', '/');
    },
    jsonStringifyOnObject: () => {
      if (typeof formattedVal !== 'string') {
        curFormattedVal = JSON.stringify(formattedVal);
      }
    },
    numberForRevenue: () => {
      if (
        (typeof formattedVal === 'string' || formattedVal instanceof String) &&
        formattedVal.charAt(0) === '$'
      ) {
        curFormattedVal = formattedVal.substring(1);
      }
      curFormattedVal = Number.parseFloat(Number(curFormattedVal || 0).toFixed(2));
      if (Number.isNaN(curFormattedVal)) {
        throw new InstrumentationError('Revenue is not in the correct format');
      }
    },
    toString: () => {
      curFormattedVal = String(formattedVal);
    },
    toNumber: () => {
      curFormattedVal = Number(formattedVal);
    },
    toFloat: () => {
      curFormattedVal = parseFloat(formattedVal);
    },
    toInt: () => {
      curFormattedVal = parseInt(formattedVal, 10);
    },
    toLower: () => {
      curFormattedVal = formattedVal.toString().toLowerCase();
    },
    hashToSha256: () => {
      curFormattedVal =
        integrationsObj && integrationsObj.hashed
          ? String(formattedVal)
          : hashToSha256(String(formattedVal));
    },
    getFbGenderVal: () => {
      curFormattedVal = getFbGenderVal(formattedVal);
    },
    getOffsetInSec: () => {
      curFormattedVal = getOffsetInSec(formattedVal);
    },
    domainUrl: () => {
      curFormattedVal = formattedVal.replace('https://', '').replace('http://', '');
    },
    domainUrlV2: () => {
      const url = isValidUrl(formattedVal);
      if (!url) {
        throw new InstrumentationError(`Invalid URL: ${formattedVal}`);
      }
      curFormattedVal = url.hostname.replace('www.', '');
    },
    IsBoolean: () => {
      curFormattedVal = true;
      if (!(typeof formattedVal === 'boolean')) {
        logger.debug('Boolean value missing, so dropping it');
        curFormattedVal = false;
      }
    },
    IsArray: () => {
      curFormattedVal = formattedVal;
      if (!Array.isArray(formattedVal)) {
        logger.debug('Array value missing, so dropping it');
        curFormattedVal = undefined;
      }
    },
    trim: () => {
      if (typeof formattedVal === 'string') {
        curFormattedVal = formattedVal.trim();
      }
    },
    isFloat: () => {
      if (isDefinedAndNotNull(formattedVal)) {
        curFormattedVal = parseFloat(formattedVal);
        if (Number.isNaN(curFormattedVal)) {
          throw new InstrumentationError('Invalid float value');
        }
      }
    },
    removeSpacesAndDashes: () => {
      if (typeof formattedVal === 'string') {
        curFormattedVal = formattedVal.replace(/ /g, '').replace(/-/g, '');
      }
    },
  };

  if (formattingType in formattingFunctions) {
    const formattingFunction = formattingFunctions[formattingType];
    formattingFunction();
  }

  return curFormattedVal;
}

function handleExcludes(value, excludes, formattedVal) {
  if (typeof value === 'object') {
    // exclude the fields from the formattedVal
    excludes.forEach((key) => {
      // eslint-disable-next-line no-param-reassign
      delete formattedVal[key];
    });
  } else {
    logger.warn("excludes doesn't work with non-object data type. Ignoring excludes");
  }
}

function handleTemplate(template, value) {
  const hTemplate = Handlebars.compile(template.trim());
  const formattedVal = hTemplate({ value }).trim();
  return formattedVal;
}

function handleMultikeyMap(multikeyMap, strictMultiMap, formattedVal, destKey) {
  // sourceVal is expected to be an array
  // if value is present in sourceVal, returns the destVal
  // else returns the original value
  // Expected multikeyMap value:
  // "multikeyMap": [
  //   {
  //     "sourceVal": ["m", "M", "Male", "male"],
  //     "destVal": "M"
  //   },
  //   {
  //     "sourceVal": ["f", "F", "Female", "female"],
  //     "destVal": "F"
  //   }
  // ]
  let curFormattedVal = formattedVal;
  const finalKeyMap = multikeyMap || strictMultiMap;
  let foundVal = false;
  if (Array.isArray(finalKeyMap)) {
    finalKeyMap.some((map) => {
      if (!map.sourceVal || !isDefinedAndNotNull(map.destVal) || !Array.isArray(map.sourceVal)) {
        logger.warn('multikeyMap skipped: sourceVal and destVal must be of valid type');
        foundVal = true;
        return true;
      }

      if (map.sourceVal.includes(formattedVal)) {
        curFormattedVal = map.destVal;
        foundVal = true;
        return true;
      }

      return false;
    });
  } else {
    logger.warn('multikeyMap skipped: multikeyMap must be an array');
  }
  if (!foundVal) {
    if (strictMultiMap) {
      throw new InstrumentationError(`Invalid entry for key ${destKey}`);
    } else {
      curFormattedVal = undefined;
    }
  }
  return curFormattedVal;
}

// format the value as per the metadata values
// Expected metadata keys are: (according to precedence)
// - - type, typeFormat: expected data type and its format
// - - template : need to have a handlebar expression {{value}}
// - - excludes : fields you want to strip of from the final value (works only for object)
// - - - - ex: "anonymousId", "userId" from traits
const handleMetadataForValue = (value, metadata, destKey, integrationsObj = null) => {
  if (!metadata) {
    return value;
  }

  // get information from metadata
  const {
    type,
    typeFormat,
    template,
    defaultValue,
    excludes,
    multikeyMap,
    strictMultiMap,
    validateTimestamp,
    allowedKeyCheck,
    toArray,
  } = metadata;

  // if value is null and defaultValue is supplied - use that
  if (!isDefinedAndNotNull(value)) {
    return defaultValue || value;
  }
  // we've got a correct value. start processing
  let formattedVal = value;

  /**
   * validate allowed time difference
   */
  if (validateTimestamp) {
    checkTimestamp(validateTimestamp, formattedVal);
  }

  if (type) {
    if (Array.isArray(type)) {
      type.forEach((eachType) => {
        formattedVal = formatValues(formattedVal, eachType, typeFormat, integrationsObj);
      });
    } else {
      formattedVal = formatValues(formattedVal, type, typeFormat, integrationsObj);
    }
  }

  // handle template
  if (template) {
    formattedVal = handleTemplate(template, value);
  }

  // handle excludes
  if (excludes) {
    handleExcludes(value, excludes, formattedVal);
  }

  // handle multikeyMap
  if (multikeyMap || strictMultiMap) {
    formattedVal = handleMultikeyMap(multikeyMap, strictMultiMap, formattedVal, destKey);
  }

  if (allowedKeyCheck) {
    let foundVal = false;
    if (Array.isArray(allowedKeyCheck)) {
      allowedKeyCheck.some((key) => {
        switch (key.type) {
          case 'toLowerCase':
            formattedVal = formattedVal.toLowerCase();
            break;
          case 'toUpperCase':
            formattedVal = formattedVal.toUpperCase();
            break;
          default:
            break;
        }
        if (key.sourceVal.includes(formattedVal)) {
          foundVal = true;
          return true;
        }
        return false;
      });
    }
    if (!foundVal) {
      formattedVal = undefined;
    }
  }

  if (toArray) {
    if (Array.isArray(formattedVal)) {
      return formattedVal;
    }
    return [formattedVal];
  }

  return formattedVal;
};

// Given a destinationName according to the destination definition names,
// It'll look for the canonical names for that integration and return the
// `integrations` object for that destination, else null
const getIntegrationsObj = (message, destinationName = null) => {
  if (destinationName) {
    const canonicalNames = DestCanonicalNames[destinationName];
    // eslint-disable-next-line no-restricted-syntax
    for (const canonicalName of canonicalNames) {
      const integrationsObj = get(message, `integrations.${canonicalName}`);
      if (integrationsObj) {
        return integrationsObj;
      }
    }
  }
  return null;
};

// construct payload from an event and mappingJson
const constructPayload = (message, mappingJson, destinationName = null) => {
  // Mapping JSON should be an array
  if (Array.isArray(mappingJson) && mappingJson.length > 0) {
    // - construct a blank payload and return at the end
    // - if you to need merge multiple constructPayload do it on the transformer code
    // - - will give a cleaner approach
    // - - you don't need to iterate over multiple loops to construct a payload for a single event
    const payload = {};

    // loop through the mappingJson
    // Expected mappingJson :
    // [
    //   {
    //     sourceKeys: [ "userId", "context.traits.userId", "context.traits.id", "anonymousId" ],
    //     destKey: "uniqueid",
    //     required: true
    //   },
    //   {
    //     sourceKeys: "event",
    //     destKey: "eventName",
    //     required: true
    //   },
    //   {
    //     sourceKeys: "event",
    //     destKey: "eventName",
    //     required: true,
    //     metadata: {
    //       template: "Visited {{value}} page"
    //     }
    //   },
    //   {
    //     sourceKeys: "originalTimestamp",
    //     destKey: "timestamp",
    //     required: true,
    //     metadata: {
    //       type: "timestamp",
    //       typeFormat: "yyyymmdd"
    //     }
    //   },
    //   ...
    // ];
    mappingJson.forEach((mapping) => {
      const { sourceKeys, destKey, required, metadata, sourceFromGenericMap } = mapping;
      // get the value from event, pass sourceFromGenericMap in the mapping to force this to take the
      // sourcekeys from GenericFieldMapping, else take the sourceKeys from specific destination mapping sourceKeys
      const integrationsObj = destinationName ? getIntegrationsObj(message, destinationName) : null;
      const value = handleMetadataForValue(
        sourceFromGenericMap
          ? getFieldValueFromMessage(message, sourceKeys)
          : getValueFromMessage(message, sourceKeys),
        metadata,
        destKey,
        integrationsObj,
      );

      if (value || value === 0 || value === false) {
        if (destKey) {
          // set the value only if correct
          lodash.set(payload, destKey, value);
        } else {
          // to set to root and flatten later
          payload[''] = value;
        }
      } else if (required) {
        // throw error if reqired value is missing
        throw new InstrumentationError(`Missing required value from ${JSON.stringify(sourceKeys)}`);
      }
    });

    return payload;
  }

  // invalid mappingJson
  return null;
};

// External ID format
// {
//   "context": {
//     "externalId": [
//       {
//         "type": "kustomerId",
//         "id": "12345678"
//       }
//     ]
//   }
// }
// to get destination specific external id passed in context.
const getDestinationExternalID = (message, type) => {
  const { context } = message;
  const externalIdArray = context?.externalId || [];
  let externalIdObj;
  if (Array.isArray(externalIdArray)) {
    externalIdObj = externalIdArray.find((extIdObj) => extIdObj?.type === type);
  }
  const destinationExternalId = externalIdObj ? externalIdObj.id : null;
  return destinationExternalId;
};

// Get id, identifierType and object type from externalId for rETL
// type will be of the form: <DESTINATION-NAME>-<object>
const getDestinationExternalIDInfoForRetl = (message, destination) => {
  let externalIdArray = [];
  let destinationExternalId = null;
  let identifierType = null;
  let objectType = null;
  if (message.context && message.context.externalId) {
    externalIdArray = message.context.externalId;
  }
  if (externalIdArray) {
    externalIdArray.forEach((extIdObj) => {
      const { type, id } = extIdObj;
      if (type?.includes(`${destination}-`)) {
        destinationExternalId = id;
        objectType = type.replace(`${destination}-`, '');
        identifierType = extIdObj.identifierType;
      }
    });
  }
  return { destinationExternalId, objectType, identifierType };
};

const getDestinationExternalIDObjectForRetl = (message, destination) => {
  const { externalId } = message.context || {};
  let externalIdArray = [];

  if (externalId) {
    if (Array.isArray(externalId)) {
      externalIdArray = externalId;
    } else if (isObject(externalId) && !isEmptyObject(externalId)) {
      externalIdArray = [externalId];
    }
  }

  let obj;
  if (externalIdArray.length > 0) {
    // some stops the execution when the element is found
    externalIdArray.some((extIdObj) => {
      const { type } = extIdObj;
      if (type?.includes(`${destination}-`)) {
        obj = extIdObj;
        return true;
      }
      return false;
    });
  }
  return obj;
};

const isNonFuncObject = (value) => {
  const type = typeof value;
  return value != null && type === 'object' && !Array.isArray(value);
};

function getBrowserInfo(userAgent) {
  const ua = uaParser(userAgent);
  return { name: ua.browser.name, version: ua.browser.version };
}

function getInfoFromUA(prop, payload, defaultVal) {
  const ua = get(payload, 'context.userAgent');
  const devInfo = ua ? uaParser(ua) : {};
  return get(devInfo, prop) || defaultVal;
}

function getDeviceModel(payload, sourceKey) {
  const payloadVal = get(payload, sourceKey);

  if (payload.channel && payload.channel.toLowerCase() === 'web') {
    return getInfoFromUA('os.name', payload, payloadVal);
  }
  return payloadVal;
}

/** * This method forms an array of non-empty values from destination config where that particular config holds an array of "key-value" pair.
For example,
    Config{
      "groupKeySettings": [
        {
          "groupKey": "companyid"
        },
        {
          "groupKey": "accountid"
        }
      ]
    }
This will return an array as ["companyid", "accountid"]
The correcponding call is: getValuesAsArrayFromConfig(Config.groupKeySettings, "groupKey")
* */
function getValuesAsArrayFromConfig(configObject, key) {
  const returnArray = [];
  if (configObject && Array.isArray(configObject) && configObject.length > 0) {
    let value;
    configObject.forEach((element) => {
      value = element[key];
      if (value) {
        returnArray.push(value);
      }
    });
  }
  return returnArray;
}

// Accepts a timestamp and returns the corresponding unix timestamp
function toUnixTimestamp(timestamp) {
  const date = new Date(timestamp);
  const unixTimestamp = Math.floor(date.getTime() / 1000);
  return unixTimestamp;
}

// Accepts a timestamp and returns the corresponding unix timestamp in milliseconds
const toUnixTimestampInMS = (timestamp) => new Date(timestamp).getTime();

// Accecpts timestamp as a parameter and returns the difference of the same with current time.
function getTimeDifference(timestamp) {
  const currentTime = Date.now();
  const eventTime = new Date(timestamp);
  const duration = moment.duration(moment(currentTime).diff(moment(eventTime)));
  const days = duration.asDays();
  const years = duration.asYears();
  const months = duration.asMonths();
  const hours = duration.asHours();
  const minutes = duration.asMinutes();
  const seconds = duration.asSeconds();
  return { days, months, years, hours, minutes, seconds };
}

// Extract firstName and lastName from traits
// split the name with <space> and consider the 0th position as first name
// and the last item (only if name is not a single word) as lastName
function getFirstAndLastName(traits, defaultLastName = 'n/a') {
  let nameParts;
  if (traits.name) {
    nameParts = traits.name.split(' ');
  }
  return {
    firstName: traits.firstName || (nameParts && nameParts.length > 0 ? nameParts[0] : ''),
    lastName:
      traits.lastName ||
      (nameParts && nameParts.length > 1 ? nameParts[nameParts.length - 1] : defaultLastName),
  };
}

// Checks if the traits object has a firstName key and a lastName key as defined in GenericFieldMapping.json
// If it does have those two keys AND does NOT already have a name key
// Then this function will return fullName: "<firstName> <lastName>"
function getFullName(message) {
  let fullName;
  const firstName = getFieldValueFromMessage(message, 'firstName');
  const lastName = getFieldValueFromMessage(message, 'lastName');
  const name = getFieldValueFromMessage(message, 'name');
  if (!name && firstName && lastName) {
    fullName = `${firstName} ${lastName}`;
  }
  return fullName;
}

/**
 * Generates an exclusion list from mapping config.
 *
 * @param {Array} mappingConfig - The mapping config.
 *   [
 *     {
 *       "destKey": "item_code",
 *       "sourceKeys": [
 *         "product_id",
 *         "sku"
 *       ]
 *     },
 *     {
 *       "destKey": "name",
 *       "sourceKeys": "name"
 *     }
 *   ]
 * @returns {Array} - The generated exclusion list.
 *   ["product_id", "sku", "name"]
 */
const generateExclusionList = (mappingConfig) =>
  mappingConfig.flatMap((mapping) =>
    Array.isArray(mapping.sourceKeys) ? [...mapping.sourceKeys] : [mapping.sourceKeys],
  );

/**
 * Extract fileds from message with exclusions
 * Pass the keys of message for extraction and
 * exclusion fields to exlude and the payload to map into
 *
 * Example:
 * extractCustomFields(
 *   message,
 *   payload,
 *   ["traits", "context.traits", "properties"],
 *   [
 *     "firstName",
 *     "lastName",
 *     "phone",
 *     "title",
 *     "organization",
 *     "city",
 *     "region",
 *     "country",
 *     "zip",
 *     "image",
 *     "timezone"
 *   ]
 * )
 * -------------------------------------------
 * The above call will map the fields other than the
 * exclusion list from the given keys to the destination payload
 *
 */
function extractCustomFields(message, payload, keys, exclusionFields) {
  const mappingKeys = [];
  // Define reserved words
  const reservedWords = ['__proto__', 'constructor', 'prototype'];

  const isReservedWord = (key) => reservedWords.includes(key);

  if (Array.isArray(keys)) {
    keys.forEach((key) => {
      const messageContext = get(message, key);
      if (messageContext) {
        Object.keys(messageContext).forEach((k) => {
          if (!exclusionFields.includes(k) && !isReservedWord(k)) {
            mappingKeys.push(k);
          }
        });
        mappingKeys.forEach((mappingKey) => {
          if (!(typeof messageContext[mappingKey] === 'undefined')) {
            set(payload, mappingKey, get(messageContext, mappingKey));
          }
        });
      }
    });
  } else if (keys === 'root') {
    Object.keys(message).forEach((k) => {
      if (!exclusionFields.includes(k) && !isReservedWord(k)) {
        mappingKeys.push(k);
      }
    });
    mappingKeys.forEach((mappingKey) => {
      if (!(typeof message[mappingKey] === 'undefined')) {
        set(payload, mappingKey, get(message, mappingKey));
      }
    });
  } else {
    logger.debug('unable to parse keys');
  }

  return payload;
}

// Deleting nested properties from objects
function deleteObjectProperty(object, pathToObject) {
  let i;
  if (!object || !pathToObject) {
    return;
  }
  if (typeof pathToObject === 'string') {
    // eslint-disable-next-line no-param-reassign
    pathToObject = pathToObject.split('.');
  }
  for (i = 0; i < pathToObject.length - 1; i += 1) {
    // eslint-disable-next-line no-param-reassign
    object = object[pathToObject[i]];

    if (typeof object === 'undefined') {
      return;
    }
  }

  // eslint-disable-next-line no-param-reassign
  delete object[pathToObject.pop()];
}

// function convert keys in a object to title case

function toTitleCase(payload) {
  const newPayload = payload;
  Object.keys(payload).forEach((key) => {
    const value = newPayload[key];
    delete newPayload[key];
    const newKey = key
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
      .replace(/([a-z])(\d)/gi, '$1 $2')
      .replace(/(\d)([a-z])/gi, '$1 $2')
      .trim()
      .replace(/(_)/g, ` `)
      .replace(/(?:^|\s)(\w)/g, (match) => match.toUpperCase());
    newPayload[newKey] = value;
  });
  return newPayload;
}

// returns false if there is any empty string inside an array or true otherwise

function checkEmptyStringInarray(array) {
  const result = array.filter((item) => item === '').length === 0;
  return result;
}
// Returns raw string value of JSON
function getStringValueOfJSON(json) {
  let output = '';
  Object.keys(json).forEach((key) => {
    // eslint-disable-next-line no-prototype-builtins
    if (json.hasOwnProperty(key)) {
      output += `${key}: ${json[key]} `;
    }
  });
  return output;
}

const getTrackingPlanMetadata = (metadata) => ({
  trackingPlanId: metadata.trackingPlanId,
  workspaceId: metadata.workspaceId,
});

const getMetadata = (metadata = {}) => ({
  sourceType: metadata.sourceType,
  destinationType: metadata.destinationType,
  k8_namespace: metadata.namespace,
});

const getTransformationMetadata = (metadata = {}) => ({
  transformationId: metadata.transformationId,
  workspaceId: metadata.workspaceId,
});

// checks if array 2 is a subset of array 1
function checkSubsetOfArray(array1, array2) {
  const result = array2.every((val) => array1.includes(val));
  return result;
}

// splits array into equal parts and returns array of sub arrays
function returnArrayOfSubarrays(arr, len) {
  const chunks = [];
  let i = 0;
  const n = arr.length;
  while (i < n) {
    chunks.push(arr.slice(i, (i += len)));
  }
  return chunks;
}

// Helper method to add external Id to traits
// Traverse through the possible keys for traits using generic mapping and add externalId if traits found
function addExternalIdToTraits(message) {
  const identifierType = get(message, 'context.externalId.0.identifierType');
  const identifierValue = get(message, 'context.externalId.0.id');
  set(getFieldValueFromMessage(message, 'traits'), identifierType, identifierValue);
}
const adduserIdFromExternalId = (message) => {
  const externalId = get(message, 'context.externalId.0.id');
  if (externalId) {
    // eslint-disable-next-line no-param-reassign
    message.userId = externalId;
  }
};

/**
 * These are keys where the status-code can be present in the error object
 */
const errorStatusCodeKeys = ['response.status', 'code', 'status'];
/**
 * The status-code is expected to be present in one of the following properties
 * - response.status
 * - code
 * - status
 * The first matched status-code will be returned
 * If not the defaultStatusCode will be returned
 * If the value of defaultStatusCode is not set or is not a number then 400 will be returned by default
 *
 * Note: The not a number check is performed using lodash's isNumber function
 *
 * @param {object} error error object when an error is thrown
 * @param {Number} defaultStatusCode default status code that has to be set
 * @returns {Number}
 */
const getErrorStatusCode = (error, defaultStatusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR) => {
  try {
    let defaultStCode = defaultStatusCode;
    if (!lodash.isNumber(defaultStatusCode)) {
      defaultStCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    }
    const errStCode = errorStatusCodeKeys
      .map((statusKey) => get(error, statusKey))
      .find((stCode) => lodash.isNumber(stCode));
    return errStCode || defaultStCode;
  } catch (err) {
    logger.error('Failed in getErrorStatusCode', err);
    return defaultStatusCode;
  }
};

function isAxiosError(err) {
  return (
    Array.isArray(err?.config?.adapter) &&
    err?.config?.adapter?.length > 1 &&
    typeof err?.request?.socket === 'object' &&
    !!err?.request?.protocol &&
    !!err?.request?.method &&
    !!err?.request?.path &&
    !!err?.status
  );
}

/**
 * Used for generating error response with stats from native and built errors
 */
function generateErrorObject(error, defTags = {}, shouldEnrichErrorMessage = true) {
  let errObject = new BaseError(
    error.message,
    getErrorStatusCode(error),
    {
      ...error.statTags,
      ...defTags,
    },
    error.destinationResponse,
    error.authErrorCategory,
  );
  let errorMessage = error.message;
  if (isAxiosError(errObject.destinationResponse)) {
    delete errObject?.destinationResponse.config;
    delete errObject?.destinationResponse.request;
  }
  if (shouldEnrichErrorMessage) {
    if (errObject.destinationResponse) {
      errorMessage = JSON.stringify({
        message: errorMessage,
        destinationResponse: errObject.destinationResponse,
      });
    }
    errObject.message = errorMessage;
  }
  if (!(error instanceof BaseError)) {
    errObject = new TransformationError(errorMessage, getErrorStatusCode(error));
  }
  return errObject;
}
/**
 * Returns true for http status code in range of 200 to 300
 * @param {*} status
 * @returns
 */
function isHttpStatusSuccess(status) {
  return status >= 200 && status < 300;
}

/**
 * Returns true for http status code in range of 500 to 600
 * @param {*} status
 * @returns
 */
function isHttpStatusRetryable(status) {
  return status >= 500 && status < 600;
}
/**
 *
 * Utility function for UUID genration
 * @returns
 */
function generateUUID() {
  return crypto.randomUUID({
    disableEntropyCache: true,
  }); /* using disableEntropyCache as true to not cache the generated uuids.
  For more Info https://nodejs.org/api/crypto.html#cryptorandomuuidoptions:~:text=options%20%3CObject%3E-,disableEntropyCache,-%3Cboolean%3E%20By
  */
}

const isOAuthDestination = (destination) => {
  const { Config: destConf } = destination.DestinationDefinition;
  return destConf && destConf.auth && destConf.auth.type === 'OAuth';
};

const isOAuthSupported = (destination, destHandler) =>
  isOAuthDestination(destination) &&
  destHandler.processAuth &&
  typeof destHandler.processAuth === 'function';

function isAppleFamily(platform) {
  const appleOsNames = ['ios', 'watchos', 'ipados', 'tvos'];
  if (typeof platform === 'string') {
    return appleOsNames.includes(platform?.toLowerCase());
  }
  return false;
}

function removeHyphens(str) {
  if (!isString(str)) {
    return str;
  }
  return str.replace(/-/g, '');
}

/**
 * This function helps to remove any invalid object values from the config generated by dynamicForm,
 * dynamicCustomForm, and dynamicSelectForm web app form elements.
 *
 * example:
 * input: "eventsToEvents": [
                    {
                        "from": "spin_result",
                        "to": "Schedule"
                    },
                    {
                        "to": "Schedule"
                    }
                ]
 * output: "eventsToEvents": [
                    {
                        "from": "spin_result",
                        "to": "Schedule"
                    }
                ]

 * @param {*} attributeArray -> This is the config output (array) from dynamicForm/dynamicCustomForm/dynamicSelectForm element.
 * @param {*} keyLeft -> This is the name of the leftKey, in general it is 'from'.
 * @param {*} keyRight -> This is the name of the rightKey, in general it is 'to'.
 * @param {*} destinationType -> This is the type of the destination.
 * @param {*} destinationId -> This is the id of the destination.
 * @returns
 */
function getValidDynamicFormConfig(
  attributeArray,
  keyLeft,
  keyRight,
  destinationType,
  destinationId,
) {
  const res = attributeArray.filter(
    (element) =>
      (element[keyLeft] || element[keyLeft] === '') &&
      (element[keyRight] || element[keyRight] === ''),
  );
  if (res.length < attributeArray.length) {
    stats.increment('dest_transform_invalid_dynamicConfig_count', {
      destinationType,
      destinationId,
    });
  }
  return res;
}

/**
 * This method is used to check if the input events sent to router transformation are valid
 * It is to be used only for router transform destinations
 *
 * Example:
 * ```
 * const errorRespEvents = checkInvalidRtTfEvents(inputs);
 * if (errorRespEvents.length > 0) {
 *  return errorRespEvents;
 * }
 * ```
 * @param {Array<object>} inputs - list of rudder events to be transformed
 * @returns {Array<object> | []}
 */
const checkInvalidRtTfEvents = (inputs) => {
  if (!Array.isArray(inputs) || inputs.length === 0) {
    const respEvents = getErrorRespEvents([], 400, 'Invalid event array');
    return [respEvents];
  }
  return [];
};

const getEventReqMetadata = (event) => {
  try {
    return {
      destinationId: event?.destination?.ID,
      destName: event?.destination?.Name,
      metadata: event?.metadata,
    };
  } catch (error) {
    // Do nothing
  }
  return {};
};

/**
 * error handler during transformation of a single rudder event for rt transform destinaiton
 *
 * This function is to be used only when we have a simple error handling scenario
 * If some customisation wrt error handling is required, we recommend to not use this function
 *
 * @param {object} input - single rudder event
 * @param {*} error - error occurred during transformation of a single rudder event
 * @param {string} destType - destination name
 * @returns
 */
const handleRtTfSingleEventError = (input, error, reqMetadata) => {
  const errObj = generateErrorObject(error);

  const resp = getErrorRespEvents([input.metadata], errObj.status, errObj.message, errObj.statTags);

  // Add support for refreshing for OAuth destinations
  if (error?.authErrorCategory) {
    resp.authErrorCategory = error.authErrorCategory;
  }

  errNotificationClient.notify(error, 'Router Transformation (event level)', {
    ...resp,
    ...reqMetadata,
    ...getEventReqMetadata(input),
  });

  return { ...resp, destination: input?.destination };
};

/**
 * This function serves as a simple implementation of router transformation destinations
 *
 * <strong>Note</strong>:
 * Don't use this method when the following are the scenarios
 *  - When a specific router transformation logic is involved
 *  - When batching is involved
 * @param {Array<object>} inputs - List of rudder events to be transformed
 * @param {String} destType - destination definition name
 * @param {Function} singleTfFunc - single event transformation function, we'd recommend this to be an async function(always)
 * @returns
 */
const simpleProcessRouterDest = async (inputs, singleTfFunc, reqMetadata, processParams) => {
  const respList = await Promise.all(
    inputs.map(async (input) => {
      try {
        let resp = input.message;
        // transform if not already done
        if (!input.message.statusCode) {
          resp = await singleTfFunc(input, processParams);
        }

        return getSuccessRespEvents(resp, [input.metadata], input.destination);
      } catch (error) {
        return handleRtTfSingleEventError(input, error, reqMetadata);
      }
    }),
  );
  return respList;
};
/**
 * This is the sync version of simpleProcessRouterDest
 *
 * @param {*} inputs
 * @param {*} singleTfFunc
 * @param {*} reqMetadata
 * @param {*} processParams
 * @returns
 */
const simpleProcessRouterDestSync = async (inputs, singleTfFunc, reqMetadata, processParams) => {
  const respList = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const input of inputs) {
    try {
      let resp = input.message;
      // transform if not already done
      if (!input.message.statusCode) {
        // eslint-disable-next-line no-await-in-loop
        resp = await singleTfFunc(input, processParams, reqMetadata);
      }
      respList.push(getSuccessRespEvents(resp, [input.metadata], input.destination));
    } catch (error) {
      respList.push(handleRtTfSingleEventError(input, error, reqMetadata));
    }
  }

  return respList;
};

/**
 * Flattens the input payload to a single level of payload
 * @param {*} payload Input payload that needs to be flattened
 * @returns the flattened payload at all levels
 * Example:
 * payload={
    "address": {
        "city": {
            "Name": "Delhi",
            "pincode": 123455
        },
        "Country": "India"
    },
    "id": 1
}
flattenPayload={
    "Name": "Delhi",
    "pincode": 123455,
    "Country": "India",
    "id": 1
}
 */
const flattenMultilevelPayload = (payload) => {
  const flattenedPayload = {};
  if (payload) {
    Object.keys(payload).forEach((v) => {
      if (typeof payload[v] === 'object' && !Array.isArray(payload[v])) {
        const temp = flattenMultilevelPayload(payload[v]);
        Object.keys(temp).forEach((i) => {
          flattenedPayload[i] = temp[i];
        });
      } else {
        flattenedPayload[v] = payload[v];
      }
    });
  }
  return flattenedPayload;
};

/**
 * Gets the destintion's transform.js file used for transformation
 * **Note**: The transform.js file is imported from
 *  `v0/destinations/${dest}/transform`
 * @param {*} _version -> version for the transfor
 * @param {*} dest destination name
 * @returns
 *  The transform.js instance used for destination transformation
 */
const getDestHandler = (dest) => {
  const destName = DestHandlerMap[dest] || dest;
  // eslint-disable-next-line import/no-dynamic-require, global-require
  return require(`../destinations/${destName}/transform`);
};

/**
 * Obtain the authCache instance used to store the access token information to send/get information to/from destination
 * @param {string} destType destination name
 * @returns {Cache | undefined} The instance of "v0/util/cache.js"
 */
const getDestAuthCacheInstance = (destType) => {
  const destInf = getDestHandler(destType);
  return destInf?.authCache || {};
};

/**
 * This function removes all those variables which are
 * empty or undefined or null from all levels of object.
 * @param {*} obj
 * @returns payload without empty null or undefined variables
 */
const refinePayload = (obj) => {
  const refinedPayload = {};
  Object.keys(obj).forEach((ele) => {
    if (obj[ele] != null && typeof obj[ele] === 'object' && !Array.isArray(obj[ele])) {
      const refinedObject = refinePayload(obj[ele]);
      if (Object.keys(refinedObject).length > 0) {
        refinedPayload[ele] = refinePayload(obj[ele]);
      }
    } else if (
      typeof obj[ele] === 'boolean' ||
      typeof obj[ele] === 'number' ||
      isDefinedAndNotNullAndNotEmpty(obj[ele])
    ) {
      refinedPayload[ele] = obj[ele];
    }
  });
  return refinedPayload;
};

const validateEmail = (email) => {
  const regex =
    /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\dA-Za-z-]+\.)+[A-Za-z]{2,}))$/;
  return !!regex.test(email);
};

const validatePhoneWithCountryCode = (phone) => {
  const regex = /^\+(?:[\d{] ?){6,14}\d$/;
  return !!regex.test(phone);
};

/**
 * checks for hybrid mode
 * @param {*} Config
 * @returns
 */
const isHybridModeEnabled = (Config) => Config.connectionMode === 'hybrid';

/**
 * Get event type from the Rudder message object
 * @param {RudderMessage} message Rudder message object
 * @returns lower case `type` field inside the Rudder message object
 */
const getEventType = (message) => message?.type?.toLowerCase();

// Set the user ID to an empty string for
// all the falsy values (including 0 and false)
// Otherwise, server panics while un-marshalling the response
// while expecting only strings.
const checkAndCorrectUserId = (statusCode, userId) => {
  if (!userId) {
    return '';
  }
  if (statusCode !== 400 && userId) {
    return `${userId}`;
  }
  return userId;
};

/**
 * Get access token to be bound to the event req headers
 *
 * **Note**:
 * - the schema that we'd get in `metadata.secret` can be different
 * for different destinations
 * - useful only for OAuth destinations
 *
 * @param {Object} metadata
 * @param {string} accessTokenKey
 *  - represents the property name under which you have accessToken information in "metadata.secret" object
 *  - property paths like data.t.accessToken, some.prop.access_token, prop.accessToken are not supported
 * @returns
 *  accesstoken information
 * @example
 *  getAccessToken(metadata, "access_token") ✅
 *  getAccessToken(metadata, "prop.token") ❌
 */
const getAccessToken = (metadata, accessTokenKey) => {
  // OAuth for this destination
  const { secret } = metadata;
  // we would need to verify if secret is present and also if the access token field is present in secret
  if (!secret?.[accessTokenKey]) {
    throw new OAuthSecretError('OAuth - access token not found');
  }
  return secret[accessTokenKey];
};

/**
 * This function takes an array of transformed events and groups them into batches based on the maximum batch size provided.
 *
 * @param { Array<{ message: *[], metadata: *, destination: * }> } transformedEventsList
 *  - An array of objects representing transformed events to be batched.
 * @param { Number } maxBatchSize An integer representing the maximum size of each batch of events.
 *
 * @returns { Array<{ events: *[], metadata: *[], destination: * }> }
 *  - A list of objects where each object contains a batch of events, its corresponding metadata, and destination.
 *
 * @example
 *  const transformedEventsList = [
 *    {
 *      message: [{ userId: 1 }, { userId: 2 }],
 *      metadata: { jobId: 1 },
 *      destination: { name: 'dest' }
 *    },
 *    {
 *      message: [{ userId: 3 }, { userId: 4 }],
 *      metadata: { jobId: 2 },
 *      destination: { name: 'dest' }
 *    },
 *    {
 *      message: [{ userId: 5 }],
 *      metadata: { jobId: 3 },
 *      destination: { name: 'dest' }
 *    }
 *  ];
 *  const maxBatchSize = 3;
 *
 *  batchMultiplexedEvents(transformedEventsList, maxBatchSize)
 *  returns [
 *    {
 *      events: [{ userId: 1 }, { userId: 2 }, { userId: 5 }],
 *      metadata: [{ jobId: 1 }, { jobId: 3 }],
 *      destination: { name: 'dest' },
 *    },
 *    {
 *      events: [{ userId: 3 }, { userId: 4 }],
 *      metadata: [{ jobId: 2 }],
 *      destination: { name: 'dest' },
 *    }
 *  ]
 */
const batchMultiplexedEvents = (transformedEventsList, maxBatchSize) => {
  const batchedEvents = [];

  if (Array.isArray(transformedEventsList)) {
    transformedEventsList.forEach((transformedInput) => {
      let transformedMessage = Array.isArray(transformedInput.message)
        ? transformedInput.message
        : [transformedInput.message];
      let eventsNotBatched = true;
      if (batchedEvents.length > 0) {
        const batch = batchedEvents[batchedEvents.length - 1];
        if (batch.events.length + transformedMessage.length <= maxBatchSize) {
          batch.events.push(...transformedMessage);
          batch.metadata.push(transformedInput.metadata);
          eventsNotBatched = false;
        }
      }
      if (batchedEvents.length === 0 || eventsNotBatched) {
        if (transformedMessage.length > maxBatchSize) {
          transformedMessage = lodash.chunk(transformedMessage, maxBatchSize);
        }
        batchedEvents.push({
          events: transformedMessage,
          metadata: [transformedInput.metadata],
          destination: transformedInput.destination,
        });
      }
    });
  }

  return batchedEvents;
};

/**
 * Groups events with the same message type together in batches.
 * Each batch contains events that have the same message type and are from different users.
 * @param {*} inputs - An array of events
 * @returns {*} - An array of batches
 */
const groupEventsByType = (inputs) => {
  const batches = [];
  let currentInputsArray = inputs;
  while (currentInputsArray.length > 0) {
    const remainingInputsArray = [];
    const userOrderTracker = {};
    const event = currentInputsArray.shift();
    const messageType = event.message.type;
    const batch = [event];
    currentInputsArray.forEach((currentInput) => {
      const currentMessageType = currentInput.message.type;
      const currentUser = currentInput.metadata.userId;
      if (currentMessageType === messageType && !userOrderTracker[currentUser]) {
        batch.push(currentInput);
      } else {
        remainingInputsArray.push(currentInput);
        userOrderTracker[currentUser] = true;
      }
    });
    batches.push(batch);
    currentInputsArray = remainingInputsArray;
  }

  return batches;
};

/**
 * This function helps to detarmine type of error occured. According to the response
 * we set authErrorCategory to take decision if we need to refresh the access_token
 * or need to de-activate authStatus for the destination.
 *
 * **Scenarios**:
 * - statusCode=401, response.error.details !== "" -> REFRESH_TOKEN
 * - statusCode=403, response.error.details !== "" -> AUTH_STATUS_INACTIVE
 *
 * @param {*} code
 * @param {*} response
 * @returns
 */
const getAuthErrCategoryFromErrDetailsAndStCode = (code, response) => {
  if (code === 401 && (!get(response, 'error.details') || typeof response === 'string'))
    return REFRESH_TOKEN;
  if (code === 403 && (!get(response, 'error.details') || typeof response === 'string'))
    return AUTH_STATUS_INACTIVE;
  return '';
};

/**
 * This function helps to determine the type of error occurred. We set the authErrorCategory
 * as per the destination response that is received and take the decision whether
 * to refresh the access_token or de-activate authStatus.
 *
 * **Scenarios**:
 * - statusCode=401 -> REFRESH_TOKEN
 * - statusCode=403 -> AUTH_STATUS_INACTIVE
 *
 * @param {*} status
 * @returns
 */
const getAuthErrCategoryFromStCode = (status) => {
  if (status === 401) {
    // UNAUTHORIZED
    return REFRESH_TOKEN;
  }
  if (status === 403) {
    // ACCESS_DENIED
    return AUTH_STATUS_INACTIVE;
  }
  return '';
};

const isValidInteger = (value) => {
  if (Number.isNaN(value) || !isDefinedAndNotNull(value)) {
    return false;
  }
  if (typeof value === 'number' && value % 1 === 0) {
    return true;
  }
  // Use a regular expression to check if the string is a valid integer or a valid floating-point number
  return typeof value === 'string' ? /^-?\d+$/.test(value) : false;
};
const validateEventName = (event) => {
  if (!event || typeof event !== 'string') {
    throw new InstrumentationError('Event is a required field and should be a string');
  }
};

const IsGzipSupported = (reqMetadata = {}) => {
  if (reqMetadata && typeof reqMetadata === 'object' && !Array.isArray(reqMetadata)) {
    const { features } = reqMetadata;
    return !!features?.[FEATURE_GZIP_SUPPORT];
  }
  return false;
};

/**
 * Returns an array containing the values of the specified key from each object in the input array.
 * If the input array is falsy (null, undefined, empty array), an empty array is returned.
 *
 * @param {Array} arr - The input array from which values will be extracted.
 * @param {string} key - The key of the property whose values will be extracted from each object in the input array.
 * @returns {Array} - A new array containing the values of the specified key from each object in the input array.
 *
 * @example
 * const configArray = [
 *   { name: 'John', age: 25 },
 *   { name: 'Jane', age: 30 },
 *   { name: 'Bob', age: 35 }
 * ];
 *
 * const result = parseConfigArray(configArray, 'name');
 *  Output: ['John', 'Jane', 'Bob']
 */
const parseConfigArray = (arr, key) => {
  if (!arr) {
    return [];
  }
  return arr.map((item) => item[key]);
};

/**
 * Finds an existing batch based on metadata JobIds from the provided batch and metadataMap.
 * @param {*} batch
 * @param {*} metadataMap The map containing metadata items indexed by JobIds.
 * @returns
 */
const findExistingBatch = (batch, metadataMap) => {
  const existingMetadataItem = batch.metadata.find((metadataItem) =>
    metadataMap.has(metadataItem.jobId),
  );
  return existingMetadataItem ? metadataMap.get(existingMetadataItem.jobId) : null;
};

/**
 * Removes duplicate metadata within each merged batch object.
 * @param {*} mergedBatches An array of merged batch objects.
 */
const removeDuplicateMetadata = (mergedBatches) => {
  mergedBatches.forEach((batch) => {
    const metadataSet = new Set();
    // eslint-disable-next-line no-param-reassign
    batch.metadata = batch.metadata.filter((metadataItem) => {
      if (!metadataSet.has(metadataItem.jobId)) {
        metadataSet.add(metadataItem.jobId);
        return true;
      }
      return false;
    });
  });
};

/**
 * Combines batched requests with the same JobIds.
 * @param {*} inputBatches The array of batched request objects.
 * @returns  The combined batched requests with merged JobIds.
 *
 */
const combineBatchRequestsWithSameJobIds = (inputBatches) => {
  const combineBatches = (batches) => {
    const clonedBatches = [...batches];
    const mergedBatches = [];
    const metadataMap = new Map();

    clonedBatches.forEach((batch) => {
      const existingBatch = findExistingBatch(batch, metadataMap);

      if (existingBatch) {
        // Merge batchedRequests arrays
        existingBatch.batchedRequest = [
          ...CommonUtils.toArray(existingBatch.batchedRequest),
          ...CommonUtils.toArray(batch.batchedRequest),
        ];

        // Merge metadata
        batch.metadata.forEach((metadataItem) => {
          if (!metadataMap.has(metadataItem.jobId)) {
            metadataMap.set(metadataItem.jobId, existingBatch);
          }
          existingBatch.metadata.push(metadataItem);
        });
      } else {
        mergedBatches.push(batch);
        batch.metadata.forEach((metadataItem) => {
          metadataMap.set(metadataItem.jobId, batch);
        });
      }
    });

    // Remove duplicate metadata within each merged object
    removeDuplicateMetadata(mergedBatches);

    return mergedBatches;
  };
  // We need to run this twice because in first pass some batches might not get merged
  // and in second pass they might get merged
  // Example: [[{jobID:1}, {jobID:2}], [{jobID:3}], [{jobID:1}, {jobID:3}]]
  // 1st pass: [[{jobID:1}, {jobID:2}, {jobID:3}], [{jobID:3}]]
  // 2nd pass: [[{jobID:1}, {jobID:2}, {jobID:3}]]
  return combineBatches(combineBatches(inputBatches));
};

/**
 * This function validates the event and return it as string.
 * @param {*} isMandatory The event is a required field.
 * @param {*} convertToLowerCase The event should be converted to lower-case.
 * @returns {string} Event name converted to string.
 */
const validateEventAndLowerCaseConversion = (event, isMandatory, convertToLowerCase) => {
  if (!isDefined(event) || typeof event === 'object' || typeof event === 'boolean') {
    throw new InstrumentationError('Event should not be a object, NaN, boolean or undefined');
  }

  // handling 0 as it is a valid value
  if (isMandatory && !event && event !== 0) {
    throw new InstrumentationError('Event is a required field');
  }

  return convertToLowerCase ? event.toString().toLowerCase() : event.toString();
};

/**
 * This function applies custom mappings to the event.
 * @param {*} event The event to be transformed.
 * @param {*} mappings The custom mappings to be applied.
 * @returns {object} The transformed event.
 */
const applyCustomMappings = (event, mappings) =>
  JsonTemplateEngine.createAsSync(mappings, { defaultPathType: PathType.JSON }).evaluate(event);

const applyJSONStringTemplate = (message, template) =>
  JsonTemplateEngine.createAsSync(template.replace(/{{/g, '${').replace(/}}/g, '}'), {
    defaultPathType: PathType.JSON,
  }).evaluate(message);

/**
 * This groups the events by destination ID and source ID.
 * Note: sourceID is only used for rETL events.
 * @param {*} events The events to be grouped.
 * @returns {array} The array of grouped events.
 */
const groupRouterTransformEvents = (events) =>
  Object.values(
    lodash.groupBy(events, (ev) => [ev.destination?.ID, ev.context?.sources?.job_id || 'default']),
  );

/*
 * Gets url path omitting the hostname & protocol
 *
 * **Note**:
 * - This should only be used when there are no dynamic paths in URL
 * @param {*} inputUrl
 * @returns
 */
const getRelativePathFromURL = (inputUrl) => {
  if (isValidUrl(inputUrl)) {
    const url = new URL(inputUrl);
    return url.pathname;
  }
  return inputUrl;
};

const isEventSentByVDMV1Flow = (event) => event?.message?.context?.mappedToDestination;

const isEventSentByVDMV2Flow = (event) =>
  event?.connection?.config?.destination?.schemaVersion === VDM_V2_SCHEMA_VERSION;

const convertToUuid = (input) => {
  const NAMESPACE = v5.DNS;

  if (!isDefinedAndNotNull(input)) {
    throw new InstrumentationError('Input is undefined or null.');
  }

  try {
    // Stringify and trim the input
    const trimmedInput = String(input).trim();

    // Check for empty input after trimming
    if (!trimmedInput) {
      throw new InstrumentationError('Input is empty or invalid.');
    }
    // Generate and return UUID
    return v5(trimmedInput, NAMESPACE);
  } catch (error) {
    const errorMessage = `Failed to transform input to uuid: ${error.message}`;
    throw new InstrumentationError(errorMessage);
  }
};
// ========================================================================
// EXPORTS
// ========================================================================
// keep it sorted to find easily
module.exports = {
  ErrorMessage,
  addExternalIdToTraits,
  adduserIdFromExternalId,
  applyCustomMappings,
  applyJSONStringTemplate,
  base64Convertor,
  batchMultiplexedEvents,
  checkEmptyStringInarray,
  checkSubsetOfArray,
  constructPayload,
  defaultBatchRequestConfig,
  defaultDeleteRequestConfig,
  defaultGetRequestConfig,
  defaultPatchRequestConfig,
  defaultPostRequestConfig,
  defaultPutRequestConfig,
  defaultRequestConfig,
  deleteObjectProperty,
  generateExclusionList,
  extractCustomFields,
  flattenJson,
  flattenMap,
  flattenMultilevelPayload,
  formatTimeStamp,
  formatValue,
  generateErrorObject,
  generateUUID,
  getBrowserInfo,
  getDateInFormat,
  getDestinationExternalID,
  getDestinationExternalIDInfoForRetl,
  getDestinationExternalIDObjectForRetl,
  getDeviceModel,
  getEventTime,
  getFieldValueFromMessage,
  getFirstAndLastName,
  getFullName,
  getHashFromArray,
  getHashFromArrayWithDuplicate,
  getHashFromArrayWithValueAsObject,
  getIntegrationsObj,
  getMappingConfig,
  getMetadata,
  getTransformationMetadata,
  getTrackingPlanMetadata,
  getParsedIP,
  getStringValueOfJSON,
  getSuccessRespEvents,
  getTimeDifference,
  getType,
  getValidDynamicFormConfig,
  getValueFromMessage,
  getValueFromPropertiesOrTraits,
  getValuesAsArrayFromConfig,
  groupRouterTransformEvents,
  handleSourceKeysOperation,
  hashToSha256,
  isAppleFamily,
  isBlank,
  isDefined,
  isDefinedAndNotNull,
  isDefinedAndNotNullAndNotEmpty,
  isEmpty,
  isEventSentByVDMV1Flow,
  isEventSentByVDMV2Flow,
  isNotEmpty,
  isNull,
  isEmptyObject,
  isHttpStatusRetryable,
  isHttpStatusSuccess,
  isNonFuncObject,
  isOAuthDestination,
  isOAuthSupported,
  isObject,
  isPrimitive,
  isValidUrl,
  removeHyphens,
  removeNullValues,
  removeUndefinedAndNullAndEmptyValues,
  removeUndefinedAndNullValues,
  removeUndefinedNullEmptyExclBoolInt,
  removeUndefinedNullValuesAndEmptyObjectArray,
  removeUndefinedValues,
  removeUndefinedAndNullRecurse,
  returnArrayOfSubarrays,
  stripTrailingSlash,
  toTitleCase,
  toUnixTimestamp,
  toUnixTimestampInMS,
  updatePayload,
  checkInvalidRtTfEvents,
  simpleProcessRouterDest,
  simpleProcessRouterDestSync,
  handleRtTfSingleEventError,
  getErrorStatusCode,
  getDestAuthCacheInstance,
  refinePayload,
  validateEmail,
  validateEventName,
  validatePhoneWithCountryCode,
  getEventReqMetadata,
  isHybridModeEnabled,
  getEventType,
  checkAndCorrectUserId,
  getAccessToken,
  formatValues,
  groupEventsByType,
  hasCircularReference,
  getAuthErrCategoryFromErrDetailsAndStCode,
  getAuthErrCategoryFromStCode,
  isValidInteger,
  isNewStatusCodesAccepted,
  IsGzipSupported,
  parseConfigArray,
  findExistingBatch,
  removeDuplicateMetadata,
  combineBatchRequestsWithSameJobIds,
  validateEventAndLowerCaseConversion,
  getRelativePathFromURL,
  removeEmptyKey,
  isAxiosError,
  convertToUuid,
};
