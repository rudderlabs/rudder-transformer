const { getMappingConfig } = require("../../util");

const ConfigCategory = {
  IDENTIFY: {
    name: "MPIdentifyConfig"
  },
  TRACK: {
    name: "MPTrackConfig"
  }
};

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

module.exports = {
  ConfigCategory,
  mappingConfig
};
