const { getMappingConfig } = require('../../util');

const ENDPOINTS = {
  GET_TOKEN: `auth.marketingcloudapis.com/v2/token`,
  CONTACTS: `rest.marketingcloudapis.com/contacts/v1/contacts`,
  INSERT_CONTACTS: `rest.marketingcloudapis.com/hub/v1/dataevents/key:`,
};

const CONFIG_CATEGORIES = {
  IDENTIFY: {
    type: 'identify',
    name: 'SFMCInsertIdentifyContactsConfig',
  },
  TRACK: {
    type: 'track',
    name: 'SFMCInsertTrackContactsConfig',
  },
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  ENDPOINTS,
  MAPPING_CONFIG,
  CONFIG_CATEGORIES,
};
