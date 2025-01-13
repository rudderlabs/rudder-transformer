const { getMappingConfig } = require('../../../../v0/util');

const getCreateContactEndpoint = (config) => `${config.apiBaseUrl}/v2/contacts`;
const getUpdateContactEndpoint = (config, contactId, email) => {
  if (contactId) {
    return `${config.apiBaseUrl}/v2/contacts/${contactId}`;
  }
  return `${config.apiBaseUrl}/v2/contacts/email:${email}`;
};

const getEventsEndpoint = (config) => `${config.apiBaseUrl}/v2/contactactivities`;
const getContactEndpoint = getUpdateContactEndpoint;

const CONFIG_CATEGORIES = {
  IDENTIFY: {
    name: 'CordialIdentifyConfig',
    type: 'identify',
  },
  TRACK: {
    name: 'CordialTrackConfig',
    type: 'track',
  },
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  IDENTIFY_CONFIG: MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name],
  TRACK_CONFIG: MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK.name],
  getCreateContactEndpoint,
  getUpdateContactEndpoint,
  getEventsEndpoint,
  getContactEndpoint,
};
