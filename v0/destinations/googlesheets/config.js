const { getMappingConfig } = require("../../util");

const CONFIG_CATEGORIES = {
  SHEETS: { name: "GSMapping" }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  MAPPING_CONFIG,
  CONFIG_CATEGORIES
};
