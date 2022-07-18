const { getMappingConfig } = require("../../util");

const BASE_ENDPOINT = "https://api.hubapi.com";

const CONTACT_PROPERTIES = `${BASE_ENDPOINT}/properties/v1/contacts/properties`;

/* Legacy API */
// identify
const IDENTIFY_CREATE_NEW_CONTACT = `${BASE_ENDPOINT}/contacts/v1/contact`;
const IDENTIFY_CREATE_UPDATE_CONTACT = `${BASE_ENDPOINT}/contacts/v1/contact/createOrUpdate/email/:contact_email`;

// batch for identify
const BATCH_CONTACT_ENDPOINT = `${BASE_ENDPOINT}/contacts/v1/contact/batch/`;
const MAX_BATCH_SIZE = 1000;

// track
const TRACK_ENDPOINT = "https://track.hubspot.com/v1/event";

/* NEW API */
const IDENTIFY_CRM_SEARCH_CONTACT = `${BASE_ENDPOINT}/crm/v3/objects/contacts/search`;
const IDENTIFY_CRM_CREATE_NEW_CONTACT = `${BASE_ENDPOINT}/crm/v3/objects/contacts`;
const IDENTIFY_CRM_UPDATE_NEW_CONTACT = `${BASE_ENDPOINT}/crm/v3/objects/contacts/:contactId`;

// batch for identify
const BATCH_IDENTIFY_CRM_CREATE_NEW_CONTACT = `${BASE_ENDPOINT}/crm/v3/objects/contacts/batch/create`;
const BATCH_IDENTIFY_CRM_UPDATE_NEW_CONTACT = `${BASE_ENDPOINT}/crm/v3/objects/contacts/batch/update`;
const MAX_BATCH_SIZE_CRM_CONTACT = 10;

const ConfigCategory = {
  IDENTIFY: {
    name: "HSCommonConfig"
  }
};

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);
const hsCommonConfigJson = mappingConfig[ConfigCategory.IDENTIFY.name];

module.exports = {
  BASE_ENDPOINT,
  CONTACT_PROPERTIES,
  TRACK_ENDPOINT,
  IDENTIFY_CREATE_UPDATE_CONTACT,
  IDENTIFY_CREATE_NEW_CONTACT,
  BATCH_CONTACT_ENDPOINT,
  MAX_BATCH_SIZE,
  IDENTIFY_CRM_SEARCH_CONTACT,
  IDENTIFY_CRM_CREATE_NEW_CONTACT,
  IDENTIFY_CRM_UPDATE_NEW_CONTACT,
  BATCH_IDENTIFY_CRM_CREATE_NEW_CONTACT,
  BATCH_IDENTIFY_CRM_UPDATE_NEW_CONTACT,
  MAX_BATCH_SIZE_CRM_CONTACT,
  ConfigCategory,
  mappingConfig,
  hsCommonConfigJson
};
