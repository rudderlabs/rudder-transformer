const BASE_ENDPOINT = "https://events.pagerduty.com/v2";

const { getMappingConfig } = require("../../util");

const CONFIG_CATEGORIES = {
  ALERT_EVENT: {
    name: "pagerdutyAlertEventConfig",
    type: "track",
    endpoint: `${BASE_ENDPOINT}/enqueue`
  },
  CHANGE_EVENT: {
    name: "pagerdutyChangeEventConfig",
    type: "track",
    endpoint: `${BASE_ENDPOINT}/change/enqueue`
  }
};

const eventActions = ["trigger", "acknowledge", "resolve"];
const defaultEventAction = "trigger";

const severities = ["critical", "warning", "error", "info"];
const defaultSeverity = "critical";

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  severities,
  eventActions,
  BASE_ENDPOINT,
  MAPPING_CONFIG,
  defaultSeverity,
  CONFIG_CATEGORIES,
  defaultEventAction
};
