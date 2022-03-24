const { getMappingConfig } = require("../../util");

const BASE_URL = "https://api.getblueshift.com";
const BASE_URL_EU = "https://api.eu.getblueshift.com";

const CONFIG_CATEGORIES = {
  IDENTIFY: {
    name: "blueshiftIdentifyConfig",
    type: "identify",
    endpoint: "/customers"
  },
  TRACK: {
    name: "blueshiftTrackConfig",
    type: "track",
    endpoint: "/event"
  },
  GROUP: {
    name: "blueshiftGroupConfig",
    type: "group",
    endpoint: "/custom_user_lists/add_user_to_list/:list_id"
  }
};
const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);
module.exports = { CONFIG_CATEGORIES, MAPPING_CONFIG, BASE_URL_EU, BASE_URL };
