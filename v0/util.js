/* eslint-disable radix */
const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const set = require("set-value");
const moment = require("moment");

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
  var type = typeof arg;
  return arg == null || (type != "object" && type != "function");
};

const isDefined = x => !_.isUndefined(x);
const isNotNull = x => x != null;
const isDefinedAndNotNull = x => isDefined(x) && isNotNull(x);

const toStringValues = obj => {
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === "object") {
      return toString(obj[key]);
    }

    obj[key] = "" + obj[key];
  });

  return obj;
};

const getDateInFormat = date => {
  var x = new Date(date);
  var y = x.getFullYear().toString();
  var m = (x.getMonth() + 1).toString();
  var d = x.getDate().toString();
  d.length == 1 && (d = "0" + d);
  m.length == 1 && (m = "0" + m);
  var yyyymmdd = y + m + d;
  return yyyymmdd;
};

const removeUndefinedValues = obj => _.pickBy(obj, isDefined);
const removeNullValues = obj => _.pickBy(obj, isNotNull);
const removeUndefinedAndNullValues = obj => _.pickBy(obj, isDefinedAndNotNull);

const updatePayload = (currentKey, eventMappingArr, value, payload) => {
  eventMappingArr.map(obj => {
    if (obj.rudderKey === currentKey) {
      set(payload, obj.expectedKey, value);
    }
  });
  return payload;
};

const toSnakeCase = str => {
  if (!str) return "";
  return String(str)
    .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, "")
    .replace(/([a-z])([A-Z])/g, (m, a, b) => a + "_" + b.toLowerCase())
    .replace(/[^A-Za-z0-9]+|_+/g, "_")
    .toLowerCase();
};

const toSafeDBString = str => {
  if (parseInt(str[0]) > 0) str = `_${str}`;
  str = str.replace(/[^a-zA-Z0-9_]+/g, "");
  return str.substr(0, 127);
};

// older implementation with fallback to new Date()
function validTimestamp(input) {
  // eslint-disable-next-line no-restricted-globals
  if (!isNaN(input)) return false;
  return new Date(input).getTime() > 0;
}

const timestampFuncFormats = [moment.ISO_8601, moment.RFC_2822];

const timestampStringFormats = [
  "YYYY-MM-DD HH:mm:ss",
  "YYYY-MM-DD HH:mm:ss Z",
  "YYYY-MM-DD HH:mm:ss.SSS Z",
  "YYYY-MM-DDTHH:mm:ss",
  "YYYY-MM-DDTHH:mm:ssZ",
  "YYYY-MM-DDTHH:mm:ss.SSZ",
  "YYYY-MM-DDTHH:mm:ss.SSSZ",
  "YYYY-MM-DD",
  "MM-DD-YYYY",
  "YYYY-MM-DD HH:mm",
  "YYYY-MM-DD HH:mm Z",
  // ISO_8061 v2.20.0 HTML5 formats
  moment.HTML5_FMT.DATETIME_LOCAL,
  moment.HTML5_FMT.DATETIME_LOCAL_SECONDS,
  moment.HTML5_FMT.DATETIME_LOCAL_MS,
  moment.HTML5_FMT.DATE,
  moment.HTML5_FMT.TIME,
  moment.HTML5_FMT.TIME_SECONDS,
  moment.HTML5_FMT.TIME_MS,
  moment.HTML5_FMT.WEEK,
  moment.HTML5_FMT.MONTH
];

// function validTimestamp(input) {
//   try {
//     if (moment(input, timestampStringFormats, true).isValid()) {
//       return true;
//     }
//     for (let index = 0; index < timestampFuncFormats.length; index++) {
//       var x;
//       try {
//         x = moment(input, timestampFuncFormats[index], true).isValid();
//       } catch (error) {
//         // ignoring error here;
//       }
//       if (x) return true;
//     }
//   } catch (error) {
//     return false;
//   }
//   return false;
// }

const isObject = value => {
  var type = typeof value;
  return value != null && (type == "object" || type == "function");
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

module.exports = {
  getMappingConfig,
  toStringValues,
  getDateInFormat,
  removeUndefinedValues,
  removeNullValues,
  removeUndefinedAndNullValues,
  isObject,
  toSnakeCase,
  toSafeDBString,
  validTimestamp,
  defaultGetRequestConfig,
  defaultPostRequestConfig,
  defaultDeleteRequestConfig,
  defaultPutRequestConfig,
  updatePayload,
  defaultRequestConfig,
  isPrimitive
};
