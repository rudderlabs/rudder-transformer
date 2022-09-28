const { getMappingConfig } = require("../../util");

const CONFIG_CATEGORIES = {
  CREATE_OR_UPDATE_CONTACT: {
    name: "MailJetIdentifyConfig",
    type: "identify",
    endpoint:
      "https://api.mailjet.com/v3/REST/contactslist/list_ID/managemanycontacts"
  }
};
const MAX_BATCH_SIZE = 5000;

const ACTIONS = ["addforce", "addnoforce", "remove", "unsub"];

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  ACTIONS,
  MAPPING_CONFIG,
  MAX_BATCH_SIZE,
  CONFIG_CATEGORIES,
  DESTINATION: "MAILJET"
};
