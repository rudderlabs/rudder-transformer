const { getMappingConfig } = require("../../util");

const BASE_URL = "https://www.woopra.com/track";
const ConfigCategories = {
  TRACK: {
    type: "track",
    name: "WoopraTrackConfig"
  },
  IDENTIFY: {
    type: "identify",
    name: "WoopraIdentifyConfig"
  },
  PAGE: {
    type: "page",
    name: "WoopraPageConfig"
  }
};
const mappingConfig = getMappingConfig(ConfigCategories, __dirname);
module.exports = {
  BASE_URL,
  mappingConfig,
  ConfigCategories
};
