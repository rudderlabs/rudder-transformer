import { getMappingConfig } from '../../util';

const API_VERSION = 'v22';

const OFFLINE_USER_DATA_JOBS_ENDPOINT = 'offlineUserDataJobs';
const BASE_ENDPOINT = `https://googleads.googleapis.com/${API_VERSION}/customers`;
const CONFIG_CATEGORIES = {
  AUDIENCE_LIST: { type: 'audienceList', name: 'offlineDataJobs' },
  ADDRESSINFO: { type: 'addressInfo', name: 'addressInfo' },
};
const ADDRESS_INFO_ATTRIBUTES = ['firstName', 'lastName', 'country', 'postalCode'];
const attributeMapping: Record<string, string> = {
  email: 'hashedEmail',
  phone: 'hashedPhoneNumber',
};
const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);
const TYPEOFLIST: Readonly<Record<string, string>> = Object.freeze({
  userID: 'thirdPartyUserId',
  mobileDeviceID: 'mobileId',
});

const consentConfigMap: Record<string, string> = {
  personalizationConsent: 'adPersonalization',
  userDataConsent: 'adUserData',
};

const offlineDataJobsMapping = MAPPING_CONFIG[CONFIG_CATEGORIES.AUDIENCE_LIST.name];
const addressInfoMapping = MAPPING_CONFIG[CONFIG_CATEGORIES.ADDRESSINFO.name];
const destType = 'google_adwords_remarketing_lists';

export {
  API_VERSION,
  OFFLINE_USER_DATA_JOBS_ENDPOINT,
  BASE_ENDPOINT,
  TYPEOFLIST,
  attributeMapping,
  offlineDataJobsMapping,
  addressInfoMapping,
  ADDRESS_INFO_ATTRIBUTES,
  consentConfigMap,
  destType,
};
