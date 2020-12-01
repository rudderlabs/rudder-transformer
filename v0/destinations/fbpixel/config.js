const { getMappingConfig } = require("../../util");

const CONFIG_CATEGORIES = {
  USERDATA: { type: "identify", name: "FBPIXELUserDataConfig" },
  COMMON: { name: "FBPIXELCommonConfig" },
  //   TRACK: { name: "FBPIXELTrackConfig" },
  PAGE: { type: "page", name: "FBPIXELPageScreenCustomConfig" }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG
};
