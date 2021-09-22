const { getMappingConfig } = require("../../util");

const ConfigCategory = {
  IDENTIFY: {
    name: "HSIdentifyConfig"
  }
};

const MAX_BATCH_SIZE = 1000;
const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

module.exports = {
  ConfigCategory,
  MAX_BATCH_SIZE,
  mappingConfig
};
