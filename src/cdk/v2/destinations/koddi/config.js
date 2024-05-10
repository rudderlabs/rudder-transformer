const { getMappingConfig } = require('../../../../v0/util');

const CONFIG_CATEGORIES = {
  IMPRESSIONS: {
    type: 'track',
    name: 'ImpressionsConfig',
  },
  CLICKS: {
    type: 'track',
    name: 'ClicksConfig',
  },
  CONVERSIONS: {
    type: 'track',
    name: 'ConversionsConfig',
  },
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  IMPRESSIONS_CONFIG: MAPPING_CONFIG[CONFIG_CATEGORIES.IMPRESSIONS.name],
  CLICKS_CONFIG: MAPPING_CONFIG[CONFIG_CATEGORIES.CLICKS.name],
  CONVERSIONS_CONFIG: MAPPING_CONFIG[CONFIG_CATEGORIES.CONVERSIONS.name],
};
