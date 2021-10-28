const { getMappingConfig } = require("../../util");

const CONFIG_CATEGORIES = {
  IDENTIFY: {
    name: "HSIdentifyConfig"
  }
};

const MAX_BATCH_SIZE = 1000;
const BATCH_CONTACT_ENDPOINT =
  "https://api.hubapi.com/contacts/v1/contact/batch/";
const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  MAX_BATCH_SIZE,
  BATCH_CONTACT_ENDPOINT,
  hSIdentifyConfigJson: MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name]
};
