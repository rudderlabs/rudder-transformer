const { getMappingConfig } = require("../../util");

const ENDPOINT = "http://www.woopra.com/track";
const CONFIG_CATEGORIES = {
  TRACK: { type: "track", name: "WoopraTrack" },
  IDENTIFY: { type: "identify", name: "WoopraIdentify" }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);
module.exports = {
  ENDPOINT,
  trackMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK.name],
  identifyMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name]
};
