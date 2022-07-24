const { getMappingConfig } = require("../../util");

const BASE_ENDPOINT = "https://api.hubapi.com";

const CONTACT_PROPERTY_MAP_ENDPOINT = `${BASE_ENDPOINT}/properties/v1/contacts/properties`;

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
// Ref - https://developers.hubspot.com/docs/api/crm/contacts#endpoint?spec=GET-/crm/v3/objects/contacts
const MAX_BATCH_SIZE_CRM_CONTACT = 10;

// track
const TRACK_CRM_ENDPOINT = `${BASE_ENDPOINT}/events/v3/send`;

/* CRM Custom Objects */
const CRM_ASSOCIATION_V3 = `${BASE_ENDPOINT}/crm/v3/associations/:fromObjectType/:toObjectType/batch/create`;

const ConfigCategory = {
  COMMON: {
    name: "HSCommonConfig"
  },
  TRACK: {
    name: "HSTrackConfig"
  },
  TRACK_PROPERTIES: {
    name: "HSTrackPropertiesConfig"
  }
};

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);
const hsCommonConfigJson = mappingConfig[ConfigCategory.COMMON.name];

module.exports = {
  BASE_ENDPOINT,
  CONTACT_PROPERTY_MAP_ENDPOINT,
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
  TRACK_CRM_ENDPOINT,
  CRM_ASSOCIATION_V3,
  ConfigCategory,
  mappingConfig,
  hsCommonConfigJson
};
