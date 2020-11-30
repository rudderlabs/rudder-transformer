const { getMappingConfig } = require("../../util");

const CONFIG_CATEGORIES = {
  IDENTIFY: { name: "FBPIXELIdentifyConfig" },
  TRACK: { name: "FBPIXELTrackConfig" },
  PAGE: { name: "FBPIXELPageScreenConfig" }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG
};