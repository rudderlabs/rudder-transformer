const { getMappingConfig } = require('../../util');

const BASE_ENDPOINT = 'https://track.customer.io/api';
const BASE_ENDPOINT_V1 = `${BASE_ENDPOINT}/v1`;
const BASE_ENDPOINT_V2 = `${BASE_ENDPOINT}/v2`;

const ENDPOINTS = {
  identity: {
    endpoint: `${BASE_ENDPOINT_V1}/customers/:id`,
    path: 'v1/customers',
  },
  userEvent: {
    endpoint: `${BASE_ENDPOINT_V1}/customers/:id/events`,
    path: 'v1/customers/events',
  },
  mergeUser: {
    endpoint: `${BASE_ENDPOINT_V1}/merge_customers`,
    path: 'v1/merge_customers',
  },
  anonEvent: {
    endpoint: `${BASE_ENDPOINT_V1}/events`,
    path: 'v1/events',
  },
  deviceRegister: {
    endpoint: `${BASE_ENDPOINT_V1}/customers/:id/devices`,
    path: 'v1/customers/devices',
  },
  deviceDelete: {
    endpoint: `${BASE_ENDPOINT_V1}/customers/:id/devices/:device_id`,
    path: 'v1/customers/devices/delete',
  },
  objectEvent: {
    endpoint: `${BASE_ENDPOINT_V2}/batch`,
    path: 'v2/batch',
  },
};

const CONFIG_CATEGORIES = {
  OBJECT_EVENTS: {
    type: 'group',
    name: 'customerIoGroup',
  },
};

const configFieldsToCheck = ['siteID', 'apiKey'];

const MAX_BATCH_SIZE = 1000;
const DEFAULT_OBJECT_ACTION = 'identify';
const OBJECT_ACTIONS = ['identify', 'delete', 'add_relationships', 'delete_relationships'];

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  MAX_BATCH_SIZE,
  MAPPING_CONFIG,
  OBJECT_ACTIONS,
  CONFIG_CATEGORIES,
  ENDPOINTS,
  DEFAULT_OBJECT_ACTION,
  configFieldsToCheck,
};
