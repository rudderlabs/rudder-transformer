const { getMappingConfig } = require("../../util");

const CONFIG_CATEGORIES = {
  IDENTIFY: { type: "identify", name: "LEMNISKIdentifyConfig" },
  TRACK: { type: "track", name: "LEMNISKTrackConfig" },
  PAGE: { type: "page", name: "LEMNISKPageConfig" }
};

const DIAPI_CONFIG_CATEGORIES = {
  TRACK: { type: "track", name: "LEMNISKDIAPITrackConfig" }
};
const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);
const DIAPI_MAPPING_CONFIG = getMappingConfig(
  DIAPI_CONFIG_CATEGORIES,
  __dirname
);
module.exports = {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  DIAPI_MAPPING_CONFIG,
  DIAPI_CONFIG_CATEGORIES
};
