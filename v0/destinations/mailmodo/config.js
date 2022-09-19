const { getMappingConfig } = require("../../util");

const BASE_URL = "https://api.mailmodo.com/api/v1";

const DESTINATION = "mailmodo";

const ConfigCategory = {
  IDENTIFY: {
    name: "identifyConfig",
    endpoint: "/addToList/batch"
  },
  TRACK: {
    name: "trackConfig",
    endpoint: "/addEvent"
  }
};

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);
const IDENTIFY_MAX_BATCH_SIZE = 100;

module.exports = {
  BASE_URL,
  IDENTIFY_MAX_BATCH_SIZE,
  ConfigCategory,
  mappingConfig,
  DESTINATION
};
