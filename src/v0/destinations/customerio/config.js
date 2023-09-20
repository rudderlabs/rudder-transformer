const { getMappingConfig } = require('../../util');

const IDENTITY_ENDPOINT = 'https://track.customer.io/api/v1/customers/:id';

const USER_EVENT_ENDPOINT = 'https://track.customer.io/api/v1/customers/:id/events';

const MERGE_USER_ENDPOINT = 'https://track.customer.io/api/v1/merge_customers';

const ANON_EVENT_ENDPOINT = 'https://track.customer.io/api/v1/events';

const DEVICE_REGISTER_ENDPOINT = 'https://track.customer.io/api/v1/customers/:id/devices';

const DEVICE_DELETE_ENDPOINT = 'https://track.customer.io/api/v1/customers/:id/devices/:device_id';

const OBJECT_EVENT_ENDPOINT = 'https://track.customer.io/api/v2/batch';

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
  IDENTITY_ENDPOINT,
  MERGE_USER_ENDPOINT,
  USER_EVENT_ENDPOINT,
  ANON_EVENT_ENDPOINT,
  OBJECT_EVENT_ENDPOINT,
  DEFAULT_OBJECT_ACTION,
  DEVICE_DELETE_ENDPOINT,
  DEVICE_REGISTER_ENDPOINT,
  configFieldsToCheck,
};
