const { getMappingConfig } = require("../../util");

const DEFAULT_BASE_ENDPOINT = "https://v3.recurly.com";
const ACCEPT_HEADERS = "application/vnd.recurly.v2021-02-25";
const BILL_TO_SELF = "self";
const ECOM_EVENTS = ["checkout started", "order completed"];

const CONFIG_CATEGORIES = {
  IDENTIFY: {
    name: "RCIdentifyConfig",
    type: "identify"
  },
  ADDRESS: {
    name: "RCAddressConfig",
    type: "address"
  },
  ECOMITEM: {
    name: "RCEcomItemConfig",
    type: "item"
  },
  ECOMLINEITEM: {
    name: "RCEcomLineItemConfig",
    type: "item"
  }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  ACCEPT_HEADERS,
  DEFAULT_BASE_ENDPOINT,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  BILL_TO_SELF,
  ECOM_EVENTS
};
