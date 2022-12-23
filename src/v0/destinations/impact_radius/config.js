const { getMappingConfig } = require("../../util");

const CONFIG_CATEGORIES = {
  IDENTIFY: {
    name: "ImpactIdentifyConfig",
    endPoint: "https://trkapi.impact.com/PageLoad"
  },

  TRACK: {
    name: "ACTrack",
    base_url: "https://api.impact.com/Advertisers/"
  }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG
};
