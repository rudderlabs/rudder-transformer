const { getMappingConfig } = require("../../util");

const BASE_URL = "https://connect.signl4.com/webhook";

const ConfigCategory = {
  TRACK: { name: "Signl4TrackConfig" }
};

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

module.exports = {
  BASE_URL,
  ConfigCategory,
  mappingConfig
};
