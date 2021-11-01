const { getMappingConfig } = require("../../util");

const ConfigCategory = {
  IDENTIFY: {
    name: "HSIdentifyConfig"
  }
};

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

module.exports = {
  ConfigCategory,
  mappingConfig
};
