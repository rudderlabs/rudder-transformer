const { getMappingConfig } = require('../../util');

const API_VERSION = 'v19';

const OFFLINE_USER_DATA_JOBS_ENDPOINT = 'offlineUserDataJobs';
const BASE_ENDPOINT = `https://googleads.googleapis.com/${API_VERSION}/customers`;
const CONFIG_CATEGORIES = {
  AUDIENCE_LIST: { type: 'audienceList', name: 'offlineDataJobs' },
  ADDRESSINFO: { type: 'addressInfo', name: 'addressInfo' },
};
const ADDRESS_INFO_ATTRIBUTES = ['firstName', 'lastName', 'country', 'postalCode'];
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
  API_VERSION,
  OFFLINE_USER_DATA_JOBS_ENDPOINT,
  BASE_ENDPOINT,
  TYPEOFLIST,
  attributeMapping,
  hashAttributes,
  offlineDataJobsMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.AUDIENCE_LIST.name],
  addressInfoMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.ADDRESSINFO.name],
  ADDRESS_INFO_ATTRIBUTES,
  consentConfigMap,
  destType: 'google_adwords_remarketing_lists',
};
