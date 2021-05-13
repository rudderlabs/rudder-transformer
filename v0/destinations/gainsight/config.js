const { getMappingConfig } = require("../../util");

const CONFIG_CATEGORIES = {
  IDENTIFY: { type: "identify", name: "GainsightIdentify" },
  GROUP: { type: "group", name: "GainsightGroup" },
  TRACK: { type: "track", name: "GainsightTrack" }
};

const MAPPING_CONFIG = getMappingConfig(__dirname, CONFIG_CATEGORIES);

module.exports = {
  identifyMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name]
};
