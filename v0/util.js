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

const removeUndefinedValues = obj => _.pickBy(obj, isDefined);

const defaultRequestConfig = {
  requestFormat: "PARAMS",
  requestMethod: "GET"
};

module.exports = {
  getMappingConfig,
  toStringValues,
  removeUndefinedValues,
  defaultRequestConfig
};
