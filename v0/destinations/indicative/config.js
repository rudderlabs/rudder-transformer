const { getMappingConfig } = require("../util");

const ConfigCategory = {
  PAGE: {
    name: "LPPageConfig",
    action: "advance"
  },
  IDENTIFY: {
    name: "LPIdentifyConfig",
    action: "setUserAttributes"
  },
  TRACK: {
    name: "LPTrackConfig",
    action: "track"
  },
  SCREEN: {
    name: "LPScreenConfig",
    action: "advance"
  },
  START: {
    name: "LPStartConfig",
    action: "start"
  }
};

const ENDPOINT = "https://api.leanplum.com/api";
const API_VERSION = "1.0.6";

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

module.exports = {
  ConfigCategory,
  mappingConfig,
  ENDPOINT,
  API_VERSION
};
