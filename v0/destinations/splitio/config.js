const { getMappingConfig } = require("../../util");

const BASE_URL = "https://events.split.io";

const endpoints = {
  eventUrl: `${BASE_URL}/api/events`
};

const CONFIG_CATEGORIES = {
  EVENT: { endPoint: endpoints.eventUrl, name: "EventConfig" }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

const KEY_CHECK_LIST = [
  "eventTypeId",
  "environmentName",
  "trafficTypeName",
  "key",
  "timestamp",
  "value",
  "revenue",
  "total"
];

module.exports = {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  KEY_CHECK_LIST
};
