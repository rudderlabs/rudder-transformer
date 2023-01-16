const { getMappingConfig } = require('../../util');

const BASE_ENDPOINT = 'https://googleads.googleapis.com/v10/customers';
const CONFIG_CATEGORIES = {
  AUDIENCE_LIST: { type: 'audienceList', name: 'offlineDataJobs' },
  ADDRESSINFO: { type: 'addressInfo', name: 'addressInfo' },
};
const attributeMapping = {
  email: 'hashedEmail',
  phone: 'hashedPhoneNumber',
};
const hashAttributes = ['email', 'phone', 'firstName', 'lastName'];
const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);
const TYPEOFLIST = Object.freeze({
  userID: 'thirdPartyUserId',
  mobileDeviceID: 'mobileId',
});

module.exports = {
  BASE_ENDPOINT,
  TYPEOFLIST,
  attributeMapping,
  hashAttributes,
  offlineDataJobsMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.AUDIENCE_LIST.name],
  addressInfoMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.ADDRESSINFO.name],
};
