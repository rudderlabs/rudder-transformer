/* eslint-disable radix */
const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const set = require("set-value");
const get = require("get-value");

const getParsedIP = message => {
  if (message.context && message.context.ip) {
    return message.context.ip;
  }
  return message.request_ip;
};

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

const isPrimitive = arg => {
  const type = typeof arg;
  return arg == null || (type !== "object" && type !== "function");
};

const isDefined = x => !_.isUndefined(x);
const isNotNull = x => x != null;
const isDefinedAndNotNull = x => isDefined(x) && isNotNull(x);

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

const removeUndefinedValues = obj => _.pickBy(obj, isDefined);
const removeNullValues = obj => _.pickBy(obj, isNotNull);
const removeUndefinedAndNullValues = obj => _.pickBy(obj, isDefinedAndNotNull);

const updatePayload = (currentKey, eventMappingArr, value, payload) => {
  eventMappingArr.forEach(obj => {
    if (obj.rudderKey === currentKey) {
      set(payload, obj.expectedKey, value);
    }
  });
  return payload;
};

const defaultGetRequestConfig = {
  requestFormat: "PARAMS",
  requestMethod: "GET"
};

const defaultPostRequestConfig = {
  requestFormat: "JSON",
  requestMethod: "POST"
};

const defaultDeleteRequestConfig = {
  requestFormat: "JSON",
  requestMethod: "DELETE"
};
const defaultPutRequestConfig = {
  requestFormat: "JSON",
  requestMethod: "PUT"
};

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

function setValues(payload, message, mappingJson) {
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
}
function formatValue(value) {
  if (!value || value < 0) return 0;
  return Math.round(value);
}

function getHashFromArray(arrays, fromKey = "from", toKey = "to") {
  const hashMap = {};
  if (Array.isArray(arrays)) {
    arrays.forEach(array => {
      hashMap[array[fromKey]] = array[toKey];
    });
  }
  return hashMap;
}

const MESSAGE_MAPPING = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, `./GenericFieldMapping.json`))
);

// Important !@!
// - get value from a list of sourceKeys in precedence order
// - get value from a string key
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
// check `data/message.json` for actual field precedence
// Example usage: getFieldValueFromMessage(message, "userId")
//                This will return the first nonnull value from
//                ["userId", "context.traits.userId", "context.traits.id", "anonymousId"]
const getFieldValueFromMessage = (message, field) => {
  const sourceKey = MESSAGE_MAPPING[field];
  if (sourceKey) {
    return getValueFromMessage(message, sourceKey);
  }
  return null;
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
      for (i = 0, l = cur.length; i < l; i += 1)
        recurse(cur[i], `${prop}[${i}]`);
      if (l === 0) result[prop] = [];
    } else {
      let isEmpty = true;
      Object.keys(cur).forEach(key => {
        isEmpty = false;
        recurse(cur[key], prop ? `${prop}.${key}` : key);
      });
      if (isEmpty && prop) result[prop] = {};
    }
  }
  if (data) {
    recurse(data, "");
  }
  return result;
}

module.exports = {
  getMappingConfig,
  getDateInFormat,
  removeUndefinedValues,
  removeNullValues,
  removeUndefinedAndNullValues,
  defaultGetRequestConfig,
  defaultPostRequestConfig,
  defaultDeleteRequestConfig,
  defaultPutRequestConfig,
  updatePayload,
  defaultRequestConfig,
  isPrimitive,
  getParsedIP,
  setValues,
  formatValue,
  flattenJson,
  getHashFromArray,
  getFieldValueFromMessage
};
