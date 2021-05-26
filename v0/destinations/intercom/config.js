const { getMappingConfig } = require("../../util");

const BASE_ENDPOINT = "https://api.intercom.io";
const ENDPOINTS = {
  IDENTIFY_ENDPOINT: `${BASE_ENDPOINT}/contacts`,
  GROUP_ENDPOINT: `${BASE_ENDPOINT}/companies`,
  TRACK_ENDPOINT: `${BASE_ENDPOINT}/events`,
  getAttachEndpoint: (id) =>
    `${BASE_ENDPOINT}/contacts/${id}/companies`
};

const CONFIG_CATEGORY = {
  IDENTIFY: { type: "identify", name: "INTERCOMIdentifyConfig" },
  GROUP: { type: "group", name: "INTERCOMGroupConfig" },
  TRACK: { type: "track", name: "INTERCOMTrackConfig" }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORY, __dirname);

module.exports = {
  ENDPOINTS,
  identifyDataMapping: MAPPING_CONFIG[CONFIG_CATEGORY.IDENTIFY.name],
  groupDataMapping: MAPPING_CONFIG[CONFIG_CATEGORY.GROUP.name],
  trackDataMapping: MAPPING_CONFIG[CONFIG_CATEGORY.TRACK.name],
};
