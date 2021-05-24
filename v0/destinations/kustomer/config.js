const { getMappingConfig } = require("../../util");

const BASE_ENDPOINT = "https://api.kustomerapp.com";

const CONFIG_CATEGORIES = {
  IDENTIFY: { name: "KustomerIdentify" },
  PAGE: { name: "KustomerPage" },
  SCREEN: { name: "KustomerScreen" },
  TRACK: { name: "KustomerTrack" }
};

// const EVENT_REGEX = {
//   EVENT: /^[a-zA-Z]{1}[a-zA-Z0-9-_.]+$/,
//   NUMBER: /^[a-zA-Z]{1}[a-zA-Z0-9-_]{2,32}Num$/,
//   STRING: /(?!.*(Num|At))^[a-zA-Z]{1}[a-zA-Z0-9-_]{2,32}$/,
//   DATE_TIME: /^[a-zA-Z]{1}[a-zA-Z0-9-_]{2,32}At$/
// };

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  BASE_ENDPOINT,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG
};
