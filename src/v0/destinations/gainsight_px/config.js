const { getMappingConfig } = require('../../util');

const BASE_ENDPOINT = 'https://api.aptrinsic.com/v1';
const ENDPOINTS = {
  USERS_ENDPOINT: `${BASE_ENDPOINT}/users`,
  CUSTOM_EVENTS_ENDPOINT: `${BASE_ENDPOINT}/events/custom`,
  ACCOUNTS_ENDPOINT: `${BASE_ENDPOINT}/accounts`,
};

const CONFIG_CATEGORIES = {
  IDENTIFY: { type: 'identify', name: 'GainsightPX_Identify' },
  TRACK: { type: 'track', name: 'GainsightPX_Track' },
  GROUP: { type: 'group', name: 'GainsightPX_Group' },
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

const USER_EXCLUSION_FIELDS = [
  'email',
  'firstName',
  'lastName',
  'gender',
  'lastSeenDate',
  'signUpDate',
  'firstVisitDate',
  'title',
  'phone',
  'score',
  'role',
  'subscriptionId',
  'numberOfVisits',
  'createDate',
  'globalUnsubscribe',
  'sfdcContactId',
  'countryName',
  'countryCode',
  'stateName',
  'stateCode',
  'stateCode',
  'city',
  'street',
  'postalCode',
  'continent',
  'regionName',
  'timeZone',
  'latitude',
  'longitude',
];

const ACCOUNT_EXCLUSION_FIELDS = [
  'name',
  'trackedSubscriptionId',
  'sfdcId',
  'dunsNumber',
  'industry',
  'numberOfEmployees',
  'sicCode',
  'website',
  'naicsCode',
  'plan',
  'numberOfUsers',
  'parentGroupId',
  'createDate',
  'lastModifiedDate',
  'lastSeenDate',
  'countryName',
  'countryCode',
  'stateName',
  'stateCode',
  'stateCode',
  'city',
  'street',
  'postalCode',
  'continent',
  'regionName',
  'timeZone',
  'latitude',
  'longitude',
];

module.exports = {
  ENDPOINTS,
  USER_EXCLUSION_FIELDS,
  ACCOUNT_EXCLUSION_FIELDS,
  identifyMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name],
  trackMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK.name],
  groupMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.GROUP.name],
};
