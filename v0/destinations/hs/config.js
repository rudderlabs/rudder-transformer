const { getMappingConfig } = require("../../util");

const CONFIG_CATEGORIES = {
  IDENTIFY: {
    name: "HSIdentifyConfig"
  }
};

const MAX_BATCH_SIZE = 1000;
const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  MAX_BATCH_SIZE,
  hSIdentifyConfigJson: MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name]
};
