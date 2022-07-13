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

/**
 * HubSpot's default contact properties fields
 */
const LEAD_STATUS = [
  "NEW",
  "OPEN",
  "IN_PROGRESS",
  "OPEN_DEAL",
  "UNQUALIFIED",
  "ATTEMPTED_TO_CONTACT",
  "CONNECTED",
  "BAD_TIMING"
];
const LIFECYCLE_STAGE = [
  "subscriber",
  "lead",
  "marketingqualifiedlead",
  "salesqualifiedlead",
  "opportunity",
  "customer",
  "evangelist",
  "other"
];

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
  LEAD_STATUS,
  LIFECYCLE_STAGE,
  mappingConfig,
  hsIdentifyConfigJson
};
