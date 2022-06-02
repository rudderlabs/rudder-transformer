const { getMappingConfig } = require("../../util");

const BASE_URL = "https://s2s.singular.net/api/v1";

const CONFIG_CATEGORIES = {
  SESSION: {
    name: "SINGULARSessionNotificationConfig",
    type: "track"
  },
  EVENT: {
    name: "SINGULAREventNotificationConfig",
    type: "track"
  }
};

const sessionEvents = [
  "Application Installed",
  "Application Updated",
  "Application Opened"
];

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);
module.exports = {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  sessionEvents,
  BASE_URL
};
