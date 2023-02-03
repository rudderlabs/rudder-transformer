const { getMappingConfig } = require('../../util');

// For IDENTIFY
// https://developers.activecampaign.com/reference/create-or-update-contact-new
// https://developers.activecampaign.com/reference/retrieve-all-tags
// https://developers.activecampaign.com/reference/create-a-new-tag
// https://developers.activecampaign.com/reference/contact-tags
// https://developers.activecampaign.com/reference/update-list-status-for-contact

// For PAGE
// https://developers.activecampaign.com/reference/site-tracking

// For SCREEN
// https://developers.activecampaign.com/reference/list-all-event-types
// https://developers.activecampaign.com/reference/create-a-new-event-name-only
// https://developers.activecampaign.com/reference/track-event

// For TRACK
// https://developers.activecampaign.com/reference/list-all-event-types
// https://developers.activecampaign.com/reference/create-a-new-event-name-only
// https://developers.activecampaign.com/reference/track-event

const CONFIG_CATEGORIES = {
  IDENTIFY: {
    name: 'ACIdentify',
    // default api-url for creating contact
    endPoint: '/api/3/contact/sync',
    tagEndPoint: '/api/3/tags',
    fieldEndPoint: '/api/3/fields',
    mergeTagWithContactUrl: '/api/3/contactTags',
    mergeFieldValueWithContactUrl: '/api/3/fieldValues',
    mergeListWithContactUrl: '/api/3/contactLists',
  },

  PAGE: { name: 'ACPage', endPoint: '/api/3/siteTrackingDomains' },

  SCREEN: {
    name: 'ACScreen',
    endPoint: 'https://trackcmp.net/event',
    getEventEndPoint: '/api/3/eventTrackingEvents',
  },

  TRACK: {
    name: 'ACTrack',
    endPoint: 'https://trackcmp.net/event',
    getEventEndPoint: '/api/3/eventTrackingEvents',
  },
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
};
