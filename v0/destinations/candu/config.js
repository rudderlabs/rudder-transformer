const endpoint = "https://api.candu.ai/api/eventWebhook";
const { getMappingConfig } = require("../../util");

const CONFIG_CATEGORIES = {
  IDENTIFY: { type: "identify", name: "CanduIdentify" },
  TRACK: { type: "track", name: "CanduTrack" }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  endpoint,
  identifyDataMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name],
  trackDataMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK.name]
};
