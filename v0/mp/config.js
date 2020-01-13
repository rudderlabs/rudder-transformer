const { getMappingConfig } = require("../util");

const ConfigCategory = {
  IDENTIFY: {
    name: "MPIdentifyConfig"
  }
};

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

module.exports = {
  ConfigCategory,
  mappingConfig
};
