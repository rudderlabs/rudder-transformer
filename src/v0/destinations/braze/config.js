const { getMappingConfig } = require('../../util');

const ConfigCategory = {
  IDENTIFY: {
    name: 'BrazeUserAttributesConfig',
  },
  DEFAULT: {
    name: 'BrazeUserAttributesConfig',
  },
};

function getIdentifyEndpoint(endPoint) {
  return `${endPoint}/users/identify`;
}

function getTrackEndPoint(endPoint) {
  return `${endPoint}/users/track`;
}

function getSubscriptionGroupEndPoint(endPoint) {
  return `${endPoint}/subscription/status/set`;
}

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

const BRAZE_PARTNER_NAME = 'RudderStack';

// max requests per batch
// Ref: https://www.braze.com/docs/api/endpoints/user_data/post_user_track/
const TRACK_BRAZE_MAX_REQ_COUNT = 75;
const IDENTIFY_BRAZE_MAX_REQ_COUNT = 50;
// https://www.braze.com/docs/api/endpoints/user_data/post_user_delete/

const DEL_MAX_BATCH_SIZE = 50;
const DESTINATION = 'braze';

const CustomAttributeOperationTypes = {
  REMOVE: 'remove',
  UPDATE: 'update',
  ADD: 'add',
  CREATE: 'create',
};

module.exports = {
  ConfigCategory,
  mappingConfig,
  getIdentifyEndpoint,
  getTrackEndPoint,
  getSubscriptionGroupEndPoint,
  BRAZE_PARTNER_NAME,
  TRACK_BRAZE_MAX_REQ_COUNT,
  IDENTIFY_BRAZE_MAX_REQ_COUNT,
  DESTINATION,
  CustomAttributeOperationTypes,
  DEL_MAX_BATCH_SIZE,
};
