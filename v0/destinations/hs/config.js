const { getMappingConfig } = require("../../util");

const BASE_ENDPOINT = "https://api.hubapi.com";

// For fetching properties from HubSpot
const CONTACT_PROPERTY_MAP_ENDPOINT = `${BASE_ENDPOINT}/properties/v1/contacts/properties`;

/*
 * Legacy API
 */
// Identify
// Ref - https://legacydocs.hubspot.com/docs/methods/contacts/create_contact
const IDENTIFY_CREATE_NEW_CONTACT = `${BASE_ENDPOINT}/contacts/v1/contact`;
// Ref - https://legacydocs.hubspot.com/docs/methods/contacts/create_or_update
const IDENTIFY_CREATE_UPDATE_CONTACT = `${BASE_ENDPOINT}/contacts/v1/contact/createOrUpdate/email/:contact_email`;

// Identify Batch
// Ref - https://legacydocs.hubspot.com/docs/methods/contacts/batch_create_or_update
const BATCH_CONTACT_ENDPOINT = `${BASE_ENDPOINT}/contacts/v1/contact/batch/`;
const MAX_BATCH_SIZE = 1000;

// Track
// Ref - https://legacydocs.hubspot.com/docs/methods/enterprise_events/http_api
const TRACK_ENDPOINT = "https://track.hubspot.com/v1/event";

/*
 * NEW API
 */
// Identify
// Ref - https://developers.hubspot.com/docs/api/crm/contacts#endpoint?spec=GET-/crm/v3/objects/contacts
const IDENTIFY_CRM_SEARCH_CONTACT = `${BASE_ENDPOINT}/crm/v3/objects/contacts/search`;
const IDENTIFY_CRM_SEARCH_ALL_OBJECTS = `${BASE_ENDPOINT}/crm/v3/objects/:objectType/search`;
const IDENTIFY_CRM_CREATE_NEW_CONTACT = `${BASE_ENDPOINT}/crm/v3/objects/contacts`;
const IDENTIFY_CRM_UPDATE_CONTACT = `${BASE_ENDPOINT}/crm/v3/objects/contacts/:contactId`;

// Identify Batch
const BATCH_IDENTIFY_CRM_CREATE_NEW_CONTACT = `${BASE_ENDPOINT}/crm/v3/objects/contacts/batch/create`;
const BATCH_IDENTIFY_CRM_UPDATE_CONTACT = `${BASE_ENDPOINT}/crm/v3/objects/contacts/batch/update`;
// Ref - https://developers.hubspot.com/docs/api/crm/contacts#endpoint?spec=GET-/crm/v3/objects/contacts
const MAX_BATCH_SIZE_CRM_CONTACT = 10;

// Track
// Ref - https://developers.hubspot.com/docs/api/analytics/events
const TRACK_CRM_ENDPOINT = `${BASE_ENDPOINT}/events/v3/send`;

/* CRM ALL Objects */
const CRM_CREATE_UPDATE_ALL_OBJECTS = `${BASE_ENDPOINT}/crm/v3/objects/:objectType`;

// Batch for custom Objects
// Ref - https://developers.hubspot.com/docs/api/crm/crm-custom-objects
const BATCH_CREATE_CUSTOM_OBJECTS = `${BASE_ENDPOINT}/crm/v3/objects/:objectType/batch/create`;

/* CRM Association v3 */
// Ref - https://developers.hubspot.com/docs/api/crm/associations
const CRM_ASSOCIATION_V3 = `${BASE_ENDPOINT}/crm/v3/associations/:fromObjectType/:toObjectType/batch/create`;

// Ref - https://developers.hubspot.com/docs/api/crm/understanding-the-crm
const MAX_BATCH_SIZE_CRM_OBJECT = 100;

const SEARCH_LIMIT_VALUE = 100;
// API version (value) is taken from the webapp
const API_VERSION = {
  v1: "legacyApi",
  v3: "newApi"
};

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

const RETL_CREATE_ASSOCIATION_OPERATION = "createAssociation";
const RETL_SOURCE = "rETL";

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
  IDENTIFY_CRM_SEARCH_ALL_OBJECTS,
  IDENTIFY_CRM_CREATE_NEW_CONTACT,
  IDENTIFY_CRM_UPDATE_CONTACT,
  BATCH_IDENTIFY_CRM_CREATE_NEW_CONTACT,
  BATCH_IDENTIFY_CRM_UPDATE_CONTACT,
  MAX_BATCH_SIZE_CRM_CONTACT,
  TRACK_CRM_ENDPOINT,
  CRM_CREATE_UPDATE_ALL_OBJECTS,
  BATCH_CREATE_CUSTOM_OBJECTS,
  CRM_ASSOCIATION_V3,
  MAX_BATCH_SIZE_CRM_OBJECT,
  API_VERSION,
  ConfigCategory,
  mappingConfig,
  hsCommonConfigJson,
  SEARCH_LIMIT_VALUE,
  RETL_SOURCE,
  RETL_CREATE_ASSOCIATION_OPERATION
};
