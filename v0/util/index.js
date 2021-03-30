/* eslint-disable  consistent-return */
/* eslint-disable  no-param-reassign */
/* eslint-disable  array-callback-return */

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

// ========================================================================
// GENERIC UTLITY
// ========================================================================

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

const formatValue = value => {
  if (!value || value < 0) return null;
  return Math.round(value);
};

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
      hashMap[isLowerCase ? array[fromKey].toLowerCase() : array[fromKey]] =
        array[toKey];
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
          throw new Error(
            `One of ${JSON.stringify(mapping.sourceKeys)} is required`
          );
        }
      }
    });
  }
  return payload;
};

// function to flatten a json
function flattenJson(data) {
  const result = {};
  let l;

  // a recursive function to loop through the array of the data
  function recurse(cur, prop) {
    let i;
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      for (i = 0, l = cur.length; i < l; i += 1) {
        recurse(cur[i], `${prop}[${i}]`);
      }
      if (l === 0) {
        result[prop] = [];
      }
    } else {
      let isEmptyFlag = true;
      Object.keys(cur).forEach(key => {
        isEmptyFlag = false;
        recurse(cur[key], prop ? `${prop}.${key}` : key);
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
  switch (format) {
    default:
      return date.getTime();
  }
};

//

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

// DEFAULT
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
      XML: {},
      FORM: {}
    },
    files: {}
  };
};

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
const getErrorRespEvents = (metadata, statusCode, error, batched = false) => {
  return { metadata, batched, statusCode, error };
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

const getValueFromMessage = (message, sourceKey) => {
  if (Array.isArray(sourceKey) && sourceKey.length > 0) {
    if (sourceKey.length === 1) {
      logger.warn(
        "List with single element is not ideal. Use it as string instead"
      );
    }
    // got the possible sourceKeys
    for (let index = 0; index < sourceKey.length; index += 1) {
      const val = get(message, sourceKey[index]);
      if (val) {
        // return only if the value is valid.
        // else look for next possible source in precedence
        return val;
      }
    }
  } else if (typeof sourceKey === "string") {
    // got a single key
    // - we don't need to iterate over a loop for a single possible value
    return get(message, sourceKey);
  } else {
    // wrong sourceKey type. abort
    // DEVELOPER ERROR
    throw new Error("Wrong sourceKey type or blank sourceKey array");
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
const handleMetadataForValue = (value, metadata) => {
  if (!metadata) {
    return value;
  }

  // get infor from metadata
  const { type, typeFormat, template, defaultValue, excludes } = metadata;

  // if value is null and defaultValue is supplied - use that
  if (!value) {
    return defaultValue || value;
  }
  // we've got a correct value. start processing
  let formattedVal = value;

  // handle type and format
  if (type) {
    switch (type) {
      case "timestamp":
        formattedVal = formatTimeStamp(formattedVal, typeFormat);
        break;
      case "secondTimestamp":
        formattedVal = Math.floor(
          formatTimeStamp(formattedVal, typeFormat) / 1000
        );
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
          throw new Error("Revenue is not in the correct format");
        }
        break;
      case "toString":
        formattedVal = String(formattedVal);
        break;
      case "toNumber":
        formattedVal = Number(formattedVal);
        break;
      case "hashToSha256":
        formattedVal = hashToSha256(String(formattedVal));
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
      default:
        break;
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
  return formattedVal;
};

// construct payload from an event and mappingJson
const constructPayload = (message, mappingJson) => {
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
      const value = handleMetadataForValue(
        sourceFromGenericMap
          ? getFieldValueFromMessage(message, sourceKeys)
          : getValueFromMessage(message, sourceKeys),
        metadata
      );

      if (value) {
        // set the value only if correct
        set(payload, destKey, value);
      } else if (required) {
        // throw error if reqired value is missing
        throw new Error(
          `Missing required value from ${JSON.stringify(sourceKeys)}`
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

function isEmpty(input) {
  return _.isEmpty(_.toString(input).trim());
}

const isObject = value => {
  const type = typeof value;
  return (
    value != null &&
    (type === "object" || type === "function") &&
    !Array.isArray(value)
  );
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
 *   "email",
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
  keys.map(key => {
    const messageContext = get(message, key);
    if (messageContext) {
      const values = [];
      Object.keys(messageContext).map(value => {
        if (!exclusionFields.includes(value)) values.push(value);
      });
      values.map(val => {
        if (!(typeof messageContext[val] === "undefined")) {
          set(destination, val, get(messageContext, val));
        }
      });
    }
  });
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

// ========================================================================
// EXPORTS
// ========================================================================
// keep it sorted to find easily
module.exports = {
  ErrorMessage,
  constructPayload,
  checkEmptyStringInarray,
  defaultBatchRequestConfig,
  defaultDeleteRequestConfig,
  defaultGetRequestConfig,
  defaultPostRequestConfig,
  defaultPutRequestConfig,
  defaultRequestConfig,
  deleteObjectProperty,
  extractCustomFields,
  flattenJson,
  formatValue,
  getBrowserInfo,
  getDateInFormat,
  getDestinationExternalID,
  getDeviceModel,
  getErrorRespEvents,
  getFieldValueFromMessage,
  getFirstAndLastName,
  getHashFromArray,
  getMappingConfig,
  getParsedIP,
  getSuccessRespEvents,
  getTimeDifference,
  getValueFromMessage,
  getValuesAsArrayFromConfig,
  isBlank,
  isDefined,
  isDefinedAndNotNull,
  isEmpty,
  isObject,
  isPrimitive,
  isValidUrl,
  removeNullValues,
  removeUndefinedAndNullAndEmptyValues,
  removeUndefinedAndNullValues,
  removeUndefinedValues,
  setValues,
  stripTrailingSlash,
  toTitleCase,
  toUnixTimestamp,
  updatePayload
};
