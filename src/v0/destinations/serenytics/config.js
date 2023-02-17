const { getMappingConfig } = require('../../util');

const CONFIG_CATEGORIES = {
  IDENTIFY: {
    name: 'SerenyticsIdentifyConfig',
  },
  TRACK: {
    name: 'SerenyticsTrackConfig',
  },
  GROUP: {
    name: 'SerenyticsGroupConfig',
  },
  SCREEN: {
    name: 'SerenyticsPageScreenConfig',
  },
  PAGE: {
    name: 'SerenyticsPageScreenConfig',
  },
  ALIAS: {
    name: 'SerenyticsAliasConfig',
  },
};

const SERENYTICS_TRACK_EXCLUSION_LIST = ['price', 'currency', 'product_id', 'product_name'];

const SERENYTICS_IDENTIFY_EXCLUSION_LIST = [
  'firstName',
  'first_name',
  'last_name',
  'lastName',
  'age',
  'email',
  'userId',
  'user_id',
];

const SERENYTICS_PAGE_SCREEN_EXCLUSION_LIST = ['path', 'url', 'title', 'category'];

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  SERENYTICS_TRACK_EXCLUSION_LIST,
  SERENYTICS_IDENTIFY_EXCLUSION_LIST,
  SERENYTICS_PAGE_SCREEN_EXCLUSION_LIST,
};
