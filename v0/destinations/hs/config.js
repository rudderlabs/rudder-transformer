const { getMappingConfig } = require("../../util");

const ConfigCategory = {
  IDENTIFY: {
    name: "HSIdentifyConfig"
  }
};

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);
const TRACK_ENDPOINT = "https://track.hubspot.com/v1/event";
const BATCH_CONTACT_ENDPOINT = "https://api.hubapi.com/contacts/v1/contact/batch/";
const MAX_BATCH_SIZE = 1000;

module.exports = {
  ConfigCategory,
  mappingConfig,
  BATCH_CONTACT_ENDPOINT,
  MAX_BATCH_SIZE,
  TRACK_ENDPOINT
};
