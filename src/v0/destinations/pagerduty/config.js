const BASE_ENDPOINT = 'https://events.pagerduty.com/v2';

const { getMappingConfig } = require('../../util');

const CONFIG_CATEGORIES = {
  ALERT_EVENT: {
    name: 'pagerdutyAlertEventConfig',
    type: 'track',
    endpoint: `${BASE_ENDPOINT}/enqueue`,
  },
  CHANGE_EVENT: {
    name: 'pagerdutyChangeEventConfig',
    type: 'track',
    endpoint: `${BASE_ENDPOINT}/change/enqueue`,
  },
};

const EVENT_ACTIONS = ['trigger', 'acknowledge', 'resolve'];
const DEFAULT_EVENT_ACTION = 'trigger';

const SEVERITIES = ['critical', 'warning', 'error', 'info'];
const DEFAULT_SEVERITY = 'critical';

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  SEVERITIES,
  BASE_ENDPOINT,
  EVENT_ACTIONS,
  MAPPING_CONFIG,
  DEFAULT_SEVERITY,
  CONFIG_CATEGORIES,
  DEFAULT_EVENT_ACTION,
};
