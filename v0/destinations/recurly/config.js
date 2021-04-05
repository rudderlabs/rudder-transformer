const { getMappingConfig } = require("../../util");

const DEFAULT_BASE_ENDPOINT = "https://v3.recurly.com";
const ACCEPT_HEADERS = "application/vnd.recurly.v2021-02-25";
const BILL_TO_SELF = "self";
const BILL_TO_PARENT = "parent";

const CONFIG_CATEGORIES = {
  IDENTIFY: {
    name: "RCIdentifyConfig",
    type: "identify",
    relativeURI: "/accounts"
  },
  ADDRESS: {
    name: "RCAddressConfig",
    type: "address"
  }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  ACCEPT_HEADERS,
  DEFAULT_BASE_ENDPOINT,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  BILL_TO_SELF,
  BILL_TO_PARENT
};
