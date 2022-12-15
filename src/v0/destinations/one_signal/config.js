const { getMappingConfig } = require("../../util");

const BASE_URL = "https://onesignal.com/api/v1";

const ENDPOINTS = {
  IDENTIFY: {
    endpoint: "/players"
  },
  TRACK: {
    endpoint: "/apps"
  },
  GROUP: {
    endpoint: "/apps"
  }
};

const ConfigCategory = {
  IDENTIFY: { name: "OneSignalIdentifyConfig", endpoint: "/players" }
};

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

module.exports = {
  BASE_URL,
  ENDPOINTS,
  ConfigCategory,
  mappingConfig
};
