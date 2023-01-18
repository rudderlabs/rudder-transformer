const { getMappingConfig } = require('../../util');

const DEFAULT_BASE_ENDPOINT = 'https://app.posthog.com';

const CONFIG_CATEGORIES = {
  ALIAS: {
    name: 'PHAliasConfig',
    type: 'alias',
    event: '$create_alias',
  },
  TRACK: { name: 'PHTrackConfig', type: 'capture' },
  IDENTIFY: {
    name: 'PHIdentifyConfig',
    type: 'identify',
    event: '$identify',
  },
  GROUP: {
    name: 'PHGroupConfigOld',
    type: 'group',
    event: '$groupidentify',
  },
  GROUPV2: {
    name: 'PHGroupConfig',
    type: 'group',
    event: '$groupidentify',
  },
  PAGE: {
    name: 'PHPageConfig',
    type: 'page',
    event: '$pageview',
  },
  SCREEN: {
    name: 'PHScreenConfig',
    type: 'screen',
    event: '$screen',
  },
  PROPERTY: {
    name: 'PHPropertiesConfig',
  },
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  DEFAULT_BASE_ENDPOINT,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
};
