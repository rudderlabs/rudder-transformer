const { getMappingConfig } = require('../../../../v0/util');

/**
 * ref :- https://developers.koddi.com/reference/winning-ads
 * impressions - https://developers.koddi.com/reference/impressions-1
 * clicks - https://developers.koddi.com/reference/clicks-1
 * conversions - https://developers.koddi.com/reference/conversions-1
 */
const EVENT_TYPES = {
  IMPRESSIONS: 'impressions',
  CLICKS: 'clicks',
  CONVERSIONS: 'conversions',
};

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
  EVENT_TYPES,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  IMPRESSIONS_CONFIG: MAPPING_CONFIG[CONFIG_CATEGORIES.IMPRESSIONS.name],
  CLICKS_CONFIG: MAPPING_CONFIG[CONFIG_CATEGORIES.CLICKS.name],
  CONVERSIONS_CONFIG: MAPPING_CONFIG[CONFIG_CATEGORIES.CONVERSIONS.name],
};
