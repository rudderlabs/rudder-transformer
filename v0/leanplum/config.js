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
  }
};

const ENDPOINT = "https://api.leanplum.com/api";

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

module.exports = {
  ConfigCategory,
  mappingConfig,
  ENDPOINT
};
