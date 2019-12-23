/* eslint-disable radix */
const fs = require("fs");
const path = require("path");
const _ = require("lodash");

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

const isDefined = x => !_.isUndefined(x);

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

const isObject = value => {
  var type = typeof value;
  return value != null && (type == "object" || type == "function");
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

function validTimestamp(input) {
  // eslint-disable-next-line no-restricted-globals
  if (!isNaN(input)) return false;
  return new Date(input).getTime() > 0;
}

const defaultGetRequestConfig = {
  requestFormat: "PARAMS",
  requestMethod: "GET"
};

const defaultPostRequestConfig = {
  requestFormat: "JSON",
  requestMethod: "POST"
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
  isObject,
  toSnakeCase,
  toSafeDBString,
  validTimestamp,
  defaultGetRequestConfig,
  defaultPostRequestConfig,
  defaultRequestConfig
};
