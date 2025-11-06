const { getMappingConfig } = require('../../util');

const ConfigCategory = {
  IDENTIFY: {
    name: 'BrazeUserAttributesConfig',
  },
  DEFAULT: {
    name: 'BrazeUserAttributesConfig',
  },
};

function getIdentifyEndpoint(baseEndpoint) {
  return {
    endpoint: `${baseEndpoint}/users/identify`,
    path: 'users/identify',
  };
}

function getTrackEndPoint(baseEndpoint) {
  return {
    endpoint: `${baseEndpoint}/users/track`,
    path: 'users/track',
  };
}

function getSubscriptionGroupEndPoint(baseEndpoint) {
  return {
    endpoint: `${baseEndpoint}/v2/subscription/status/set`,
    path: 'v2/subscription/status/set',
  };
}

function getAliasMergeEndPoint(baseEndpoint) {
  return {
    endpoint: `${baseEndpoint}/users/merge`,
    path: 'users/merge',
  };
}

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

const BRAZE_PARTNER_NAME = 'RudderStack';

// max requests per batch
// Ref: https://www.braze.com/docs/api/endpoints/user_data/post_user_track/
const TRACK_BRAZE_MAX_REQ_COUNT = 75;
const TRACK_BRAZE_MAX_EXTERNAL_ID_COUNT = 75;
const IDENTIFY_BRAZE_MAX_REQ_COUNT = 50;
// https://www.braze.com/docs/api/endpoints/user_data/post_user_delete/

const ALIAS_BRAZE_MAX_REQ_COUNT = 50;
const SUBSCRIPTION_BRAZE_MAX_REQ_COUNT = 25;

const DEL_MAX_BATCH_SIZE = 50;
const DESTINATION = 'braze';

const CustomAttributeOperationTypes = {
  REMOVE: 'remove',
  UPDATE: 'update',
  ADD: 'add',
  CREATE: 'create',
};

const BRAZE_NON_BILLABLE_ATTRIBUTES = [
  'country',
  'language',
  'email_subscribe',
  'push_subscribe',
  'subscription_groups',
];

const BRAZE_PURCHASE_STANDARD_PROPERTIES = ['product_id', 'sku', 'price', 'quantity', 'currency'];

module.exports = {
  ConfigCategory,
  mappingConfig,
  getIdentifyEndpoint,
  getTrackEndPoint,
  getSubscriptionGroupEndPoint,
  getAliasMergeEndPoint,
  BRAZE_PARTNER_NAME,
  BRAZE_PURCHASE_STANDARD_PROPERTIES,
  TRACK_BRAZE_MAX_REQ_COUNT,
  TRACK_BRAZE_MAX_EXTERNAL_ID_COUNT,
  IDENTIFY_BRAZE_MAX_REQ_COUNT,
  DESTINATION,
  CustomAttributeOperationTypes,
  DEL_MAX_BATCH_SIZE,
  BRAZE_NON_BILLABLE_ATTRIBUTES,
  ALIAS_BRAZE_MAX_REQ_COUNT,
  SUBSCRIPTION_BRAZE_MAX_REQ_COUNT,
};
