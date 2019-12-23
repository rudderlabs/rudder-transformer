const { getMappingConfig } = require("../util");

const ConfigCategory = {
  DEFAULT: {
    name: "WHDefaultConfig"
  },
  TRACK: {
    name: "WHTrackConfig"
  }
};

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

module.exports = {
  ConfigCategory,
  mappingConfig
};
