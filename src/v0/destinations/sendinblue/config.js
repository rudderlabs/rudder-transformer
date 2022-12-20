const { getMappingConfig } = require("../../util");

const BASE_ENDPOINT_MAIN = "https://api.sendinblue.com";
const BASE_ENDPOINT_TRACKER = "https://in-automate.sendinblue.com";
const VERSION_MAIN = "v3";
const VERSION_TRACKER = "v2";
const EMAIL_SUFFIX = "@mailin-sms.com";

const getContactDetailsEndpoint = identifier => {
  return `${BASE_ENDPOINT_MAIN}/${VERSION_MAIN}/contacts/${identifier}`;
};

const getUnlinkContactEndpoint = listId => {
  return `${BASE_ENDPOINT_MAIN}/${VERSION_MAIN}/contacts/lists/${listId}/contacts/remove`;
};

const CONFIG_CATEGORIES = {
  CREATE_OR_UPDATE_CONTACT: {
    name: "SendinblueCreateOrUpdateContactConfig",
    type: "identify",
    endpoint: `${BASE_ENDPOINT_MAIN}/${VERSION_MAIN}/contacts`
  },
  CREATE_DOI_CONTACT: {
    name: "SendinblueCreateDOIContactConfig",
    type: "identify",
    endpoint: `${BASE_ENDPOINT_MAIN}/${VERSION_MAIN}/contacts/doubleOptinConfirmation`
  },
  UPDATE_DOI_CONTACT: {
    name: "SendinblueUpdateDOIContactConfig",
    type: "identify",
    endpoint: `${BASE_ENDPOINT_MAIN}/${VERSION_MAIN}/contacts/<identifier>`
  },
  TRACK_EVENTS: {
    name: "SendinblueTrackEventConfig",
    type: "track",
    endpoint: `${BASE_ENDPOINT_TRACKER}/api/${VERSION_TRACKER}/trackEvent`
  },
  TRACK_LINK: {
    name: "SendinblueTrackLinkConfig",
    eventName: "trackLink",
    type: "track",
    endpoint: `${BASE_ENDPOINT_TRACKER}/api/${VERSION_TRACKER}/trackLink`
  },
  PAGE: {
    name: "SendinbluePageConfig",
    type: "page",
    endpoint: `${BASE_ENDPOINT_TRACKER}/api/${VERSION_TRACKER}/trackPage`
  }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  BASE_ENDPOINT_MAIN,
  BASE_ENDPOINT_TRACKER,
  VERSION_MAIN,
  VERSION_TRACKER,
  EMAIL_SUFFIX,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  getContactDetailsEndpoint,
  getUnlinkContactEndpoint,
  DESTINATION: "SENDINBLUE"
};
