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
  formatValue
};
