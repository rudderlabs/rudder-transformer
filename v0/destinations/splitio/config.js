const { getMappingConfig } = require("../../util");

const BASE_URL = "https://api.split.io";

const endpoints = {
  eventUrl: `${BASE_URL}/api/events`,
  identifyUrl: `${BASE_URL}/internal/api/v2/users `,
  GroupUrl: `${BASE_URL}/internal/api/v2/groups`
};

const CONFIG_CATEGORIES = {
  EVENT: { endPoint: endpoints.eventUrl, name: "EventConfig" },
  IDENTIFY: { endPoint: endpoints.identifyUrl, name: "IdentifyConfig" },
  GROUP: { endPoint: endpoints.groupUrl, name: "GroupConfig" }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

const KEY_CHECK_LIST = [
  "eventTypeId",
  "environmentName",
  "trafficTypeName",
  "key",
  "timestamp",
  "value"
];

module.exports = {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  KEY_CHECK_LIST
};
