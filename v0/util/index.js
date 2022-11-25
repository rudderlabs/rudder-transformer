// ========================================================================
// Make sure you are putting any new method in relevant section
// INLINERS ==> Inline methods
// REQUEST FORMATS ==> Various request formats to format the final response
// TRANSFORMER UTILITIES ==> Utility methods having dependency on event/message
// GENERIC ==> Other methods which doesn't fit in other categories
// ========================================================================
const Handlebars = require("handlebars");

const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const set = require("set-value");
const get = require("get-value");
const uaParser = require("ua-parser-js");
const moment = require("moment-timezone");
const sha256 = require("sha256");
const logger = require("../../logger");
const stats = require("../../util/stats");
const {
  DestCanonicalNames,
  DestHandlerMap
} = require("../../constants/destinationCanonicalNames");
const { TRANSFORMER_METRIC } = require("./constant");
const { TransformationError } = require("./errors");
// ========================================================================
// INLINERS
// ========================================================================

const isDefined = x => !_.isUndefined(x);
const isNotEmpty = x => !_.isEmpty(x);
const isNotNull = x => x != null;
const isDefinedAndNotNull = x => isDefined(x) && isNotNull(x);
const isDefinedAndNotNullAndNotEmpty = x =>
  isDefined(x) && isNotNull(x) && isNotEmpty(x);
const removeUndefinedValues = obj => _.pickBy(obj, isDefined);
const removeNullValues = obj => _.pickBy(obj, isNotNull);
const removeUndefinedAndNullValues = obj => _.pickBy(obj, isDefinedAndNotNull);
const removeUndefinedAndNullAndEmptyValues = obj =>
  _.pickBy(obj, isDefinedAndNotNullAndNotEmpty);
const isBlank = value => _.isEmpty(_.toString(value));
const flattenMap = collection => _.flatMap(collection, x => x);
// ========================================================================
// GENERIC UTLITY
// ========================================================================

class CustomError extends Error {
  constructor(message, statusCode, metadata) {
    super(message);
    // *Note*: This schema is being used by other endpoints like /poll, /fileUpload etc,.
    // Apart from destination transformation
    this.response = { status: statusCode || 400, metadata };
  }
}

const getEventTime = message => {
  return new Date(message.timestamp).toISOString();
};

const base64Convertor = string => {
  return Buffer.from(string).toString("base64");
};

// return a valid URL object if correct else null
const isValidUrl = url => {
  try {
    return new URL(url);
  } catch (err) {
    return null;
  }
};

const stripTrailingSlash = str => {
  return str && str.endsWith("/") ? str.slice(0, -1) : str;
};

const isPrimitive = arg => {
  const type = typeof arg;
  return arg == null || (type !== "object" && type !== "function");
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
const getType = arg => {
  const type = typeof arg;
  if (arg == null) {
    return "NULL";
  }
  if (Array.isArray(arg)) {
    return "array";
  }
  return type;
};

const formatValue = value => {
  if (!value || value < 0) return null;
  return Math.round(value);
};

function isEmpty(input) {
  return _.isEmpty(_.toString(input).trim());
}

/**
 * Returns true for empty object {}
 * @param {*} obj
 * @returns
 */
function isEmptyObject(obj) {
  if (!obj) {
    logger.warn("input is undefined or null");
    return true;
  }
  return Object.keys(obj).length === 0;
}

/**
 * Function to check if value is Defined, Not null and Not Empty.
 * Create this function, Because existing isDefinedAndNotNullAndNotEmpty(123) is returning false due to lodash _.isEmpty function.
 * _.isEmpty is used to detect empty collections/objects and it will return true for Integer, Boolean values.
 * ref: https://github.com/lodash/lodash/issues/496
 * @param {*} value 123
 * @returns yes
 */
const isDefinedNotNullNotEmpty = value => {
  return !(
    value === undefined ||
    value === null ||
    Number.isNaN(value) ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
};

const removeUndefinedNullEmptyExclBoolInt = obj =>
  _.pickBy(obj, isDefinedNotNullNotEmpty);

// Format the destination.Config.dynamicMap arrays to hashMap
const getHashFromArray = (
  arrays,
  fromKey = "from",
  toKey = "to",
  isLowerCase = true
) => {
  const hashMap = {};
  if (Array.isArray(arrays)) {
    arrays.forEach(array => {
      if (isEmpty(array[fromKey])) return;
      hashMap[isLowerCase ? array[fromKey].toLowerCase() : array[fromKey]] =
        array[toKey];
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
  fromKey = "from",
  toKey = "to",
  isLowerCase = true
) => {
  const hashMap = {};
  if (Array.isArray(arrays)) {
    arrays.forEach(array => {
      if (isEmpty(array[fromKey])) return;
      const key = isLowerCase
        ? array[fromKey].toLowerCase().trim()
        : array[fromKey].trim();

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
const getHashFromArrayWithValueAsObject = (
  arrays,
  fromKey = "from",
  isLowerCase = true
) => {
  const hashMap = {};
  if (Array.isArray(arrays)) {
    arrays.forEach(array => {
      if (isEmpty(array[fromKey])) return;
      hashMap[
        isLowerCase ? array[fromKey].toLowerCase() : array[fromKey]
      ] = array;
    });
  }
  return hashMap;
};

// NEED to decouple value finding and `required` checking
// NEED TO DEPRECATE
const setValues = (payload, message, mappingJson) => {
  if (Array.isArray(mappingJson)) {
    let val;
    let sourceKeys;
    mappingJson.forEach(mapping => {
      val = undefined;
      sourceKeys = mapping.sourceKeys;
      if (Array.isArray(sourceKeys) && sourceKeys.length > 0) {
        for (let index = 0; index < sourceKeys.length; index += 1) {
          val = get(message, sourceKeys[index]);
          if (val) {
            break;
          }
        }
        if (val) {
          set(payload, mapping.destKey, val);
        } else if (mapping.required) {
          throw new CustomError(
            `One of ${JSON.stringify(mapping.sourceKeys)} is required`
          );
        }
      }
    });
  }
  return payload;
};

// get the value from the message given a key
// it'll look for properties, traits and context.traits in the order
const getValueFromPropertiesOrTraits = ({ message, key }) => {
  const keySet = ["properties", "traits", "context.traits"];

  const val = _.find(
    _.map(keySet, k => get(message, `${k}.${key}`)),
    v => !_.isNil(v)
  );
  return !_.isNil(val) ? val : null;
};

// function to flatten a json
function flattenJson(data, separator = ".", mode = "normal") {
  const result = {};
  let l;

  // a recursive function to loop through the array of the data
  function recurse(cur, prop) {
    let i;
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      for (i = 0, l = cur.length; i < l; i += 1) {
        if (mode === "strict") {
          recurse(cur[i], `${prop}${separator}${i}`);
        } else {
          recurse(cur[i], `${prop}[${i}]`);
        }
      }
      if (l === 0) {
        result[prop] = [];
      }
    } else {
      let isEmptyFlag = true;
      Object.keys(cur).forEach(key => {
        isEmptyFlag = false;
        recurse(cur[key], prop ? `${prop}${separator}${key}` : key);
      });
      if (isEmptyFlag && prop) result[prop] = {};
    }
  }

  recurse(data, "");
  return result;
}

// Get the offset value in Seconds for timezone

const getOffsetInSec = value => {
  const name = moment.tz.zone(value);
  if (name) {
    const x = moment()
      .tz(value)
      .format("Z");
    const split = x.split(":");
    const hour = Number(split[0]);
    const min = Number(split[1]);
    let sec = 0;
    sec =
      hour < 0 ? -1 * (hour * -60 * 60 + min * 60) : hour * 60 * 60 + min * 60;
    return sec;
  }
  return undefined;
};

// Important !@!
// format date in yyyymmdd format
// NEED TO DEPRECATE
const getDateInFormat = date => {
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

const hashToSha256 = value => {
  return sha256(value);
};

// Check what type of gender and convert to f or m
const getFbGenderVal = gender => {
  if (
    gender.toUpperCase() === "FEMALE" ||
    gender.toUpperCase() === "F" ||
    gender.toUpperCase() === "WOMAN"
  ) {
    return hashToSha256("f");
  }
  if (
    gender.toUpperCase() === "MALE" ||
    gender.toUpperCase() === "M" ||
    gender.toUpperCase() === "MAN"
  ) {
    return hashToSha256("m");
  }
  return null;
};

// ========================================================================
// REQUEST FORMAT METHODS
// ========================================================================

// GET
const defaultGetRequestConfig = {
  requestFormat: "PARAMS",
  requestMethod: "GET"
};

// POST
const defaultPostRequestConfig = {
  requestFormat: "JSON",
  requestMethod: "POST"
};

// DELETE
const defaultDeleteRequestConfig = {
  requestFormat: "JSON",
  requestMethod: "DELETE"
};

// PUT
const defaultPutRequestConfig = {
  requestFormat: "JSON",
  requestMethod: "PUT"
};
// PATCH
const defaultPatchRequestConfig = {
  requestFormat: "JSON",
  requestMethod: "PATCH"
};

// DEFAULT
// TODO: add builder pattern to generate request and batchRequest
// and set payload for JSON_ARRAY
// JSON_ARRAY: { payload: [] }
const defaultRequestConfig = () => {
  return {
    version: "1",
    type: "REST",
    method: "POST",
    endpoint: "",
    headers: {},
    params: {},
    body: {
      JSON: {},
      JSON_ARRAY: {},
      XML: {},
      FORM: {}
    },
    files: {}
  };
};

// JSON_ARRAY: { payload: [] }
const defaultBatchRequestConfig = () => {
  return {
    batchedRequest: {
      version: "1",
      type: "REST",
      method: "POST",
      endpoint: "",
      headers: {},
      params: {},
      body: {
        JSON: {},
        JSON_ARRAY: {},
        XML: {},
        FORM: {}
      },
      files: {}
    }
  };
};

// Router transformer
// Success responses
const getSuccessRespEvents = (
  message,
  metadata,
  destination,
  batched = false
) => {
  return {
    batchedRequest: message,
    metadata,
    batched,
    statusCode: 200,
    destination
  };
};

// Router transformer
// Error responses
const getErrorRespEvents = (
  metadata,
  statusCode,
  error,
  statTags,
  batched = false
) => {
  return { metadata, batched, statusCode, error, statTags };
};

// ========================================================================
// Error Message UTILITIES
// ========================================================================
const ErrorMessage = {
  TypeNotFound: "Invalid payload. Property Type is not present",
  TypeNotSupported: "Message type not supported",
  FailedToConstructPayload: "Payload could not be constructed"
};

// ========================================================================
// TRANSFORMER UTILITIES
// ========================================================================
const MESSAGE_MAPPING = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, `./data/GenericFieldMapping.json`))
);

// Get the IP address from the message.
// NEED TO DEPRECATE
const getParsedIP = message => {
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
  categoryKeys.forEach(categoryKey => {
    const category = config[categoryKey];
    mappingConfig[category.name] = JSON.parse(
      fs.readFileSync(path.resolve(dir, `./data/${category.name}.json`))
    );
  });
  return mappingConfig;
};

// NEED a better way to handle it. Only used in Autopilot and Intercom
// NEED TO DEPRECATE
const updatePayload = (currentKey, eventMappingArr, value, payload) => {
  eventMappingArr.forEach(obj => {
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
  const argValues = args.map(arg => {
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
  const isAllDefined = _.every(argValues, v => {
    return !_.isNil(v);
  });
  if (!isAllDefined) {
    return null;
  }

  // start handling operations
  let result = null;
  switch (operation) {
    case "multiplication":
      result = 1;
      for (let ind = 0; ind < argValues.length; ind += 1) {
        const v = argValues[ind];
        if (_.isNumber(v)) {
          result *= v;
        } else {
          // if there is a non number argument simply return null
          // non numbers can't be operated arithmatically
          return null;
        }
      }
      return result;
    case "addition":
      result = 0;
      for (let ind = 0; ind < argValues.length; ind += 1) {
        const v = argValues[ind];
        if (_.isNumber(v)) {
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
      logger.warn(
        "List with single element is not ideal. Use it as string instead"
      );
    }
    // got the possible sourceKeys
    for (let index = 0; index < sourceKeys.length; index += 1) {
      const sourceKey = sourceKeys[index];
      let val = null;
      // if the sourceKey is an object we expect it to be a operation
      if (typeof sourceKey === "object") {
        val = handleSourceKeysOperation({
          message,
          operationObject: sourceKey
        });
      } else {
        val = get(message, sourceKeys[index]);
      }
      if (val || val === false || val === 0) {
        // return only if the value is valid.
        // else look for next possible source in precedence
        return val;
      }
    }
  } else if (typeof sourceKeys === "string") {
    // got a single key
    // - we don't need to iterate over a loop for a single possible value
    return get(message, sourceKeys);
  } else if (typeof sourceKeys === "object") {
    // if the sourceKey is an object we expect it to be a operation
    return handleSourceKeysOperation({ message, operationObject: sourceKeys });
  } else {
    // wrong sourceKey type. abort
    // DEVELOPER ERROR
    // TODO - think of a way to crash the pod
    throw new CustomError("Wrong sourceKey type or blank sourceKey array");
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

// format the value as per the metadata values
// Expected metadata keys are: (according to precedence)
// - - type, typeFormat: expected data type and its format
// - - template : need to have a handlebar expression {{value}}
// - - excludes : fields you want to strip of from the final value (works only for object)
// - - - - ex: "anonymousId", "userId" from traits
const handleMetadataForValue = (
  value,
  metadata,
  destKey,
  integrationsObj = null
) => {
  if (!metadata) {
    return value;
  }

  // get infor from metadata
  const {
    type,
    typeFormat,
    template,
    defaultValue,
    excludes,
    multikeyMap,
    strictMultiMap,
    validateTimestamp,
    allowedKeyCheck
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
    const {
      allowedPastTimeDifference,
      allowedPastTimeUnit, // seconds, minutes, hours
      allowedFutureTimeDifference,
      allowedFutureTimeUnit // seconds, minutes, hours
    } = validateTimestamp;

    let pastTimeDifference;
    let futureTimeDifference;

    const currentTime = moment.unix(moment().format("X"));
    const time = moment.unix(moment(formattedVal).format("X"));

    switch (allowedPastTimeUnit) {
      case "seconds":
        pastTimeDifference = Math.ceil(
          moment.duration(currentTime.diff(time)).asSeconds()
        );
        break;
      case "minutes":
        pastTimeDifference = Math.ceil(
          moment.duration(currentTime.diff(time)).asMinutes()
        );
        break;
      case "hours":
        pastTimeDifference = Math.ceil(
          moment.duration(currentTime.diff(time)).asHours()
        );
        break;
      default:
        break;
    }

    if (pastTimeDifference > allowedPastTimeDifference) {
      throw new CustomError(
        `Allowed timestamp is [${allowedPastTimeDifference} ${allowedPastTimeUnit}] into the past`
      );
    }

    if (pastTimeDifference <= 0) {
      switch (allowedFutureTimeUnit) {
        case "seconds":
          futureTimeDifference = Math.ceil(
            moment.duration(time.diff(currentTime)).asSeconds()
          );
          break;
        case "minutes":
          futureTimeDifference = Math.ceil(
            moment.duration(time.diff(currentTime)).asMinutes()
          );
          break;
        case "hours":
          futureTimeDifference = Math.ceil(
            moment.duration(time.diff(currentTime)).asHours()
          );
          break;
        default:
          break;
      }

      if (futureTimeDifference > allowedFutureTimeDifference) {
        throw new CustomError(
          `Allowed timestamp is [${allowedFutureTimeDifference} ${allowedFutureTimeUnit}] into the future`
        );
      }
    }
  }

  // handle type and format
  function formatValues(formatingType) {
    switch (formatingType) {
      case "timestamp":
        formattedVal = formatTimeStamp(formattedVal, typeFormat);
        break;
      case "secondTimestamp":
        if (!moment(formattedVal, "x", true).isValid()) {
          formattedVal = Math.floor(
            formatTimeStamp(formattedVal, typeFormat) / 1000
          );
        }
        break;
      case "microSecondTimestamp":
        formattedVal = moment.unix(moment(formattedVal).format("X"));
        formattedVal =
          formattedVal.toDate().getTime() * 1000 +
          formattedVal.toDate().getMilliseconds();
        break;
      case "flatJson":
        formattedVal = flattenJson(formattedVal);
        break;
      case "encodeURIComponent":
        formattedVal = encodeURIComponent(JSON.stringify(formattedVal));
        break;
      case "jsonStringify":
        formattedVal = JSON.stringify(formattedVal);
        break;
      case "jsonStringifyOnFlatten":
        formattedVal = JSON.stringify(flattenJson(formattedVal));
        break;
      case "dobInMMDD":
        formattedVal = String(formattedVal).slice(5);
        formattedVal = formattedVal.replace("-", "/");
        break;
      case "jsonStringifyOnObject":
        // if already a string, will not stringify
        // calling stringify on string will add escape characters
        if (typeof formattedVal !== "string") {
          formattedVal = JSON.stringify(formattedVal);
        }
        break;
      case "numberForRevenue":
        if (
          (typeof formattedVal === "string" ||
            formattedVal instanceof String) &&
          formattedVal.charAt(0) === "$"
        ) {
          formattedVal = formattedVal.substring(1);
        }
        formattedVal = Number.parseFloat(Number(formattedVal || 0).toFixed(2));
        if (Number.isNaN(formattedVal)) {
          throw new TransformationError("Revenue is not in the correct format");
        }
        break;
      case "toString":
        formattedVal = String(formattedVal);
        break;
      case "toNumber":
        formattedVal = Number(formattedVal);
        break;
      case "toFloat":
        formattedVal = parseFloat(formattedVal);
        break;
      case "toInt":
        formattedVal = parseInt(formattedVal, 10);
        break;
      case "toLower":
        formattedVal = formattedVal.toString().toLowerCase();
        break;
      case "hashToSha256":
        formattedVal =
          integrationsObj && integrationsObj.hashed
            ? String(formattedVal)
            : hashToSha256(String(formattedVal));
        break;
      case "getFbGenderVal":
        formattedVal = getFbGenderVal(formattedVal);
        break;
      case "getOffsetInSec":
        formattedVal = getOffsetInSec(formattedVal);
        break;
      case "domainUrl":
        formattedVal = formattedVal
          .replace("https://", "")
          .replace("http://", "");
        break;
      case "domainUrlV2": {
        const url = new URL(formattedVal);
        formattedVal = url.hostname.replace("www.", "");
        break;
      }
      case "IsBoolean":
        if (!(typeof formattedVal === "boolean")) {
          logger.debug("Boolean value missing, so dropping it");
        }
        break;
      case "trim":
        if (typeof formattedVal === "string") {
          formattedVal = formattedVal.trim();
        }
        break;
      default:
        break;
    }
  }
  if (type) {
    if (Array.isArray(type)) {
      type.forEach(eachType => {
        formatValues(eachType);
      });
    } else {
      formatValues(type);
    }
  }

  // handle template
  if (template) {
    const hTemplate = Handlebars.compile(template.trim());
    formattedVal = hTemplate({ value }).trim();
  }

  // handle excludes
  if (excludes) {
    if (typeof value === "object") {
      // exlude the fields from the formattedVal
      excludes.forEach(key => {
        delete formattedVal[key];
      });
    } else {
      logger.warn(
        "exludes doesn't work with non-object data type. Ignoring exludes"
      );
    }
  }

  // handle multikeyMap
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
  if (multikeyMap || strictMultiMap) {
    const finalKeyMap = multikeyMap || strictMultiMap;
    let foundVal = false;
    if (Array.isArray(finalKeyMap)) {
      finalKeyMap.some(map => {
        if (
          !map.sourceVal ||
          !isDefinedAndNotNull(map.destVal) ||
          !Array.isArray(map.sourceVal)
        ) {
          logger.warn(
            "multikeyMap skipped: sourceVal and destVal must be of valid type"
          );
          foundVal = true;
          return true;
        }

        if (map.sourceVal.includes(formattedVal)) {
          formattedVal = map.destVal;
          foundVal = true;
          return true;
        }
      });
    } else {
      logger.warn("multikeyMap skipped: multikeyMap must be an array");
    }
    if (!foundVal) {
      if (strictMultiMap) {
        throw new TransformationError(`Invalid entry for key ${destKey}`, 400);
      } else {
        formattedVal = undefined;
      }
    }
  }

  if (allowedKeyCheck) {
    let foundVal = false;
    if (Array.isArray(allowedKeyCheck)) {
      allowedKeyCheck.some(key => {
        switch (key.type) {
          case "toLowerCase":
            formattedVal = formattedVal.toLowerCase();
            break;
          case "toUpperCase":
            formattedVal = formattedVal.toUpperCase();
            break;
          default:
            break;
        }
        if (key.sourceVal.includes(formattedVal)) {
          foundVal = true;
          return true;
        }
      });
    }
    if (!foundVal) {
      formattedVal = undefined;
    }
  }

  return formattedVal;
};

// Given a destinationName according to the destination definition names,
// It'll look for the canonical names for that integration and return the
// `integrations` object for that destination, else null
const getIntegrationsObj = (message, destinationName = null) => {
  if (destinationName) {
    const canonicalNames = DestCanonicalNames[destinationName];
    for (let index = 0; index < canonicalNames.length; index += 1) {
      const integrationsObj = get(
        message,
        `integrations.${canonicalNames[index]}`
      );
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
    mappingJson.forEach(mapping => {
      const {
        sourceKeys,
        destKey,
        required,
        metadata,
        sourceFromGenericMap
      } = mapping;
      // get the value from event, pass sourceFromGenericMap in the mapping to force this to take the
      // sourcekeys from GenericFieldMapping, else take the sourceKeys from specific destination mapping sourceKeys
      const integrationsObj = destinationName
        ? getIntegrationsObj(message, destinationName)
        : null;
      const value = handleMetadataForValue(
        sourceFromGenericMap
          ? getFieldValueFromMessage(message, sourceKeys)
          : getValueFromMessage(message, sourceKeys),
        metadata,
        destKey,
        integrationsObj
      );

      if (value || value === 0 || value === false) {
        if (destKey) {
          // set the value only if correct
          _.set(payload, destKey, value);
        } else {
          // to set to root and flatten later
          payload[""] = value;
        }
      } else if (required) {
        // throw error if reqired value is missing
        throw new TransformationError(
          `Missing required value from ${JSON.stringify(sourceKeys)}`,
          400
        );
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
function getDestinationExternalID(message, type) {
  let externalIdArray = null;
  let destinationExternalId = null;
  if (message.context && message.context.externalId) {
    externalIdArray = message.context.externalId;
  }
  if (externalIdArray) {
    externalIdArray.forEach(extIdObj => {
      if (extIdObj.type === type) {
        destinationExternalId = extIdObj.id;
      }
    });
  }
  return destinationExternalId;
}

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
    externalIdArray.forEach(extIdObj => {
      const { type } = extIdObj;
      if (type.includes(`${destination}-`)) {
        destinationExternalId = extIdObj.id;
        objectType = type.replace(`${destination}-`, "");
        identifierType = extIdObj.identifierType;
      }
    });
  }
  return { destinationExternalId, objectType, identifierType };
};

const getDestinationExternalIDObjectForRetl = (message, destination) => {
  let externalIdArray = [];
  if (message.context && message.context.externalId) {
    externalIdArray = message.context.externalId;
  }
  let obj;
  if (externalIdArray) {
    // some stops the execution when the element is found
    externalIdArray.some(extIdObj => {
      const { type } = extIdObj;
      if (type.includes(`${destination}-`)) {
        obj = extIdObj;
        return true;
      }
      return false;
    });
  }
  return obj;
};

const isObject = value => {
  const type = typeof value;
  return (
    value != null &&
    (type === "object" || type === "function") &&
    !Array.isArray(value)
  );
};

const isNonFuncObject = value => {
  const type = typeof value;
  return value != null && type === "object" && !Array.isArray(value);
};

function getBrowserInfo(userAgent) {
  const ua = uaParser(userAgent);
  return { name: ua.browser.name, version: ua.browser.version };
}

function getInfoFromUA(prop, payload, defaultVal) {
  const ua = get(payload, "context.userAgent");
  const devInfo = ua ? uaParser(ua) : {};
  return get(devInfo, prop) || defaultVal;
}

function getDeviceModel(payload, sourceKey) {
  const payloadVal = get(payload, sourceKey);

  if (payload.channel && payload.channel.toLowerCase() === "web") {
    return getInfoFromUA("os.name", payload, payloadVal);
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
    configObject.forEach(element => {
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
function getFirstAndLastName(traits, defaultLastName = "n/a") {
  let nameParts;
  if (traits.name) {
    nameParts = traits.name.split(" ");
  }
  return {
    firstName:
      traits.firstName ||
      (nameParts && nameParts.length > 0 ? nameParts[0] : ""),
    lastName:
      traits.lastName ||
      (nameParts && nameParts.length > 1
        ? nameParts[nameParts.length - 1]
        : defaultLastName)
  };
}

// Checks if the traits object has a firstName key and a lastName key as defined in GenericFieldMapping.json
// If it does have those two keys AND does NOT already have a name key
// Then this function will return fullName: "<firstName> <lastName>"
function getFullName(message) {
  let fullName;
  const firstName = getFieldValueFromMessage(message, "firstName");
  const lastName = getFieldValueFromMessage(message, "lastName");
  const name = getFieldValueFromMessage(message, "name");
  if (!name && firstName && lastName) {
    fullName = `${firstName} ${lastName}`;
  }
  return fullName;
}

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
 * exlusion list from the given keys to the destination payload
 *
 */
function extractCustomFields(message, destination, keys, exclusionFields) {
  const mappingKeys = [];
  if (Array.isArray(keys)) {
    keys.map(key => {
      const messageContext = get(message, key);
      if (messageContext) {
        Object.keys(messageContext).map(k => {
          if (!exclusionFields.includes(k)) mappingKeys.push(k);
        });
        mappingKeys.map(mappingKey => {
          if (!(typeof messageContext[mappingKey] === "undefined")) {
            set(destination, mappingKey, get(messageContext, mappingKey));
          }
        });
      }
    });
  } else if (keys === "root") {
    Object.keys(message).map(k => {
      if (!exclusionFields.includes(k)) mappingKeys.push(k);
    });
    mappingKeys.map(mappingKey => {
      if (!(typeof message[mappingKey] === "undefined")) {
        set(destination, mappingKey, get(message, mappingKey));
      }
    });
  } else {
    logger.debug("unable to parse keys");
  }

  return destination;
}

// Deleting nested properties from objects
function deleteObjectProperty(object, pathToObject) {
  let i;
  if (!object || !pathToObject) {
    return;
  }
  if (typeof pathToObject === "string") {
    pathToObject = pathToObject.split(".");
  }
  for (i = 0; i < pathToObject.length - 1; i += 1) {
    object = object[pathToObject[i]];

    if (typeof object === "undefined") {
      return;
    }
  }

  delete object[pathToObject.pop()];
}

// function convert keys in a object to title case

function toTitleCase(payload) {
  const newPayload = payload;
  Object.keys(payload).forEach(key => {
    const value = newPayload[key];
    delete newPayload[key];
    const newKey = key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
      .replace(/([a-z])([0-9])/gi, "$1 $2")
      .replace(/([0-9])([a-z])/gi, "$1 $2")
      .trim()
      .replace(/(_)/g, ` `)
      .replace(/(^\w{1})|(\s+\w{1})/g, match => {
        return match.toUpperCase();
      });
    newPayload[newKey] = value;
  });
  return newPayload;
}

// returns false if there is any empty string inside an array or true otherwise

function checkEmptyStringInarray(array) {
  const result = array.filter(item => item === "").length === 0;
  return result;
}
// Returns raw string value of JSON
function getStringValueOfJSON(json) {
  let output = "";
  Object.keys(json).forEach(key => {
    // eslint-disable-next-line no-prototype-builtins
    if (json.hasOwnProperty(key)) {
      output += `${key}: ${json[key]} `;
    }
  });
  return output;
}

const getMetadata = metadata => {
  return {
    sourceType: metadata.sourceType,
    destinationType: metadata.destinationType,
    k8_namespace: metadata.namespace
  };
};
// checks if array 2 is a subset of array 1
function checkSubsetOfArray(array1, array2) {
  const result = array2.every(val => array1.includes(val));
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
  const identifierType = get(message, "context.externalId.0.identifierType");
  const identifierValue = get(message, "context.externalId.0.id");
  set(
    getFieldValueFromMessage(message, "traits"),
    identifierType,
    identifierValue
  );
}
const adduserIdFromExternalId = message => {
  const externalId = get(message, "context.externalId.0.id");
  if (externalId) {
    message.userId = externalId;
  }
};

/**
 * These are keys where the status-code can be present in the error object
 */
const errorStatusCodeKeys = ["response.status", "code", "status"];
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
const getErrorStatusCode = (error, defaultStatusCode = 400) => {
  try {
    let defaultStCode = defaultStatusCode;
    if (!_.isNumber(defaultStatusCode)) {
      defaultStCode = 400;
    }
    const errStCode = errorStatusCodeKeys
      .map(statusKey => get(error, statusKey))
      .find(stCode => _.isNumber(stCode));
    return errStCode || defaultStCode;
  } catch (err) {
    logger.error("Failed in getErrorStatusCode", err);
    return defaultStatusCode;
  }
};

/**
 * Used for generating error response with stats from native and built errors
 * @param {*} arg
 * @param {*} destination
 * @param {*} transformStage
 */
function generateErrorObject(error, destination = "", transformStage) {
  const { message, destinationResponse } = error;
  let { statTags } = error;
  if (!statTags) {
    statTags = {
      destType: destination,
      stage: transformStage,
      scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.EXCEPTION.SCOPE
    };
  }
  // In previous versions of cdk, we had destination tag
  // This block is mainly to support it and also for backward for non-cdk destinations
  if (statTags.destination) {
    statTags.destType = statTags.destination;
    delete statTags.destination;
  }
  // When thrown using TransformationError or ApiError, we wouldn't set stage while throwing error
  if (!statTags.destType) {
    statTags.destType = destination.toUpperCase();
  }
  // When thrown using TransformationError or ApiError, we wouldn't set stage while throwing error
  if (!statTags.stage) {
    statTags.stage = transformStage;
  }
  if (statTags.destType) {
    // Upper-casing the destination to maintain parity with destType(which is upper-cased dest. Def Name)
    statTags.destType = statTags.destType.toUpperCase();
  }
  const response = {
    status: getErrorStatusCode(error),
    message: message || "Error occurred while processing the payload.",
    destinationResponse,
    statTags
  };
  // Extra Params needed for OAuth destinations' Response handling
  if (error.authErrorCategory) {
    response.authErrorCategory = error.authErrorCategory || "";
  }
  return response;
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
  // Public Domain/MIT
  let d = new Date().getTime();
  if (
    typeof performance !== "undefined" &&
    typeof performance.now === "function"
  ) {
    d += performance.now(); // use high-precision timer if available
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

const isOAuthDestination = destination => {
  const { Config: destConf } = destination.DestinationDefinition;
  return destConf && destConf.auth && destConf.auth.type === "OAuth";
};

const isOAuthSupported = (destination, destHandler) => {
  return (
    isOAuthDestination(destination) &&
    destHandler.processAuth &&
    typeof destHandler.processAuth === "function"
  );
};

function isAppleFamily(platform) {
  const appleOsNames = ["ios", "watchos", "ipados", "tvos"];
  if (typeof platform === "string") {
    return appleOsNames.includes(platform?.toLowerCase());
  }
  return false;
}

function removeHyphens(str) {
  return str.replace(/-/g, "");
}

function isCdkDestination(event) {
  // TODO: maybe dont need all these checks in place
  return (
    event.destination &&
    event.destination.DestinationDefinition &&
    event.destination.DestinationDefinition.Config &&
    event.destination.DestinationDefinition.Config.cdkEnabled
  );
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
  destinationId
) {
  const res = attributeArray.filter(element => {
    return (
      (element[keyLeft] || element[keyLeft] === "") &&
      (element[keyRight] || element[keyRight] === "")
    );
  });
  if (res.length < attributeArray.length) {
    stats.increment("dest_transform_invalid_dynamicConfig_count", 1, {
      destinationType,
      destinationId
    });
  }
  return res;
}

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
const handleRtTfSingleEventError = (input, error, destType) => {
  const errObj = generateErrorObject(
    error,
    destType, // Preference is destination definition name
    TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM
  );
  return getErrorRespEvents(
    [input.metadata],
    errObj.status,
    errObj.message,
    errObj.statTags
  );
};

/**
 * This method is used to check if the input events sent to router transformation are valid
 * It is to be used only for router transform destinations
 *
 * Example:
 * ```
 * const errorRespEvents = checkInvalidRtTfEvents(inputs, destType);
 * if (errorRespEvents.length > 0) {
 *  return errorRespEvents;
 * }
 * ```
 * @param {Array<object>} inputs - list of rudder events to be transformed
 * @param {String} destType - destination name
 * @returns {Array<object> | []}
 */
const checkInvalidRtTfEvents = (inputs, destType) => {
  let destTyp = destType;
  if (!destTyp) {
    destTyp = "";
  }
  if (!Array.isArray(inputs) || inputs.length === 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array", {
      destType: destTyp.toUpperCase(),
      stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
      scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.EXCEPTION.SCOPE
    });
    return [respEvents];
  }
  return [];
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
const simpleProcessRouterDest = async (inputs, destType, singleTfFunc) => {
  const errorRespEvents = checkInvalidRtTfEvents(inputs, destType);
  if (errorRespEvents.length > 0) {
    return errorRespEvents;
  }

  const respList = await Promise.all(
    inputs.map(async input => {
      try {
        let resp = input.message;
        // transform if not already done
        if (!input.message.statusCode) {
          resp = await singleTfFunc(input);
        }

        return getSuccessRespEvents(resp, [input.metadata], input.destination);
      } catch (error) {
        return handleRtTfSingleEventError(input, error, destType);
      }
    })
  );
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
const flattenMultilevelPayload = payload => {
  const flattenedPayload = {};
  if (payload) {
    Object.keys(payload).forEach(v => {
      if (typeof payload[v] === "object" && !Array.isArray(payload[v])) {
        const temp = flattenMultilevelPayload(payload[v]);
        Object.keys(temp).forEach(i => {
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
const getDestHandler = dest => {
  const destName = DestHandlerMap[dest] || dest;
  // eslint-disable-next-line import/no-dynamic-require, global-require
  return require(`../destinations/${destName}/transform`);
};

/**
 * Obtain the authCache instance used to store the access token information to send/get information to/from destination
 * @param {string} destType destination name
 * @returns {Cache | undefined} The instance of "v0/util/cache.js"
 */
const getDestAuthCacheInstance = destType => {
  const destInf = getDestHandler(destType);
  return destInf?.authCache || {};
};

/**
 * This function removes all those variables which are
 * empty or undefined or null from all levels of object.
 * @param {*} obj
 * @returns payload without empty null or undefined variables
 */
const refinePayload = obj => {
  const refinedPayload = {};
  Object.keys(obj).forEach(ele => {
    if (
      obj[ele] != null &&
      typeof obj[ele] === "object" &&
      !Array.isArray(obj[ele])
    ) {
      const refinedObject = refinePayload(obj[ele]);
      if (Object.keys(refinedObject).length !== 0) {
        refinedPayload[ele] = refinePayload(obj[ele]);
      }
    } else if (
      typeof obj[ele] === "boolean" ||
      typeof obj[ele] === "number" ||
      isDefinedAndNotNullAndNotEmpty(obj[ele])
    ) {
      refinedPayload[ele] = obj[ele];
    }
  });
  return refinedPayload;
};

// ========================================================================
// EXPORTS
// ========================================================================
// keep it sorted to find easily
module.exports = {
  CustomError,
  TransformationError,
  ErrorMessage,
  addExternalIdToTraits,
  adduserIdFromExternalId,
  base64Convertor,
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
  getErrorRespEvents,
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
  getParsedIP,
  getStringValueOfJSON,
  getSuccessRespEvents,
  getTimeDifference,
  getType,
  getValidDynamicFormConfig,
  getValueFromMessage,
  getValueFromPropertiesOrTraits,
  getValuesAsArrayFromConfig,
  handleSourceKeysOperation,
  isAppleFamily,
  isBlank,
  isCdkDestination,
  isDefined,
  isDefinedAndNotNull,
  isDefinedAndNotNullAndNotEmpty,
  isEmpty,
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
  removeUndefinedValues,
  returnArrayOfSubarrays,
  setValues,
  stripTrailingSlash,
  toTitleCase,
  toUnixTimestamp,
  updatePayload,
  checkInvalidRtTfEvents,
  simpleProcessRouterDest,
  handleRtTfSingleEventError,
  getErrorStatusCode,
  getDestAuthCacheInstance,
  refinePayload
};
