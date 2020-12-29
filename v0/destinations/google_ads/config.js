const { getMappingConfig } = require("../../util");

const baseEndpoint = "https://www.googleadservices.com/pagead/conversion/app/";

const CONFIG_CATEGORIES = {
  TRACK: { name: "GoogleAdsTrackConfig" }
};
const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);
const trackConfig = MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK.name];

module.exports = {
  trackConfig,
  baseEndpoint
};
