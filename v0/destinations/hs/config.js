const { getMappingConfig } = require("../../util");

const BASE_ENDPOINT = "https://api.hubapi.com";

const CONTACT_PROPERTIES = `${BASE_ENDPOINT}/properties/v1/contacts/properties`;

const TRACK_ENDPOINT = "https://track.hubspot.com/v1/event";
const IDENTIFY_CREATE_UPDATE_CONTACT = `${BASE_ENDPOINT}/contacts/v1/contact/createOrUpdate/email/:contact_email`;
const IDENTIFY_CREATE_NEW_CONTACT = `${BASE_ENDPOINT}/contacts/v1/contact`;

const BATCH_CONTACT_ENDPOINT = `${BASE_ENDPOINT}/contacts/v1/contact/batch/`;
const MAX_BATCH_SIZE = 1000;

const ConfigCategory = {
  IDENTIFY: {
    name: "HSIdentifyConfig"
  }
};

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);
const hsIdentifyConfigJson = mappingConfig[ConfigCategory.IDENTIFY.name];

module.exports = {
  BASE_ENDPOINT,
  CONTACT_PROPERTIES,
  TRACK_ENDPOINT,
  IDENTIFY_CREATE_UPDATE_CONTACT,
  IDENTIFY_CREATE_NEW_CONTACT,
  BATCH_CONTACT_ENDPOINT,
  MAX_BATCH_SIZE,
  ConfigCategory,
  mappingConfig,
  hsIdentifyConfigJson
};
