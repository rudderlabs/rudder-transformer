const { getMappingConfig } = require('../../util');

const BASE_ENDPOINT = 'https://googleads.googleapis.com/v16/customers';
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

const consentConfigMap = {
  personalizationConsent: 'adPersonalization',
  userDataConsent: 'adUserData',
};

module.exports = {
  BASE_ENDPOINT,
  TYPEOFLIST,
  attributeMapping,
  hashAttributes,
  offlineDataJobsMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.AUDIENCE_LIST.name],
  addressInfoMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.ADDRESSINFO.name],
  consentConfigMap,
  destType: 'google_adwords_remarketing_lists',
};
