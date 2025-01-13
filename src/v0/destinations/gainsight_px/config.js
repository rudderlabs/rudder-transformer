const { getMappingConfig } = require('../../util');

const BASE_ENDPOINT = 'https://api.aptrinsic.com/v1';
const BASE_EU_ENDPOINT = 'https://api-eu.aptrinsic.com/v1';
const BASE_US2_ENDPOINT = 'https://api-us2.aptrinsic.com/v1';

const getBaseEndpoint = (Config) => {
  const { dataCenter } = Config;
  switch (dataCenter) {
    case 'EU':
      return BASE_EU_ENDPOINT;
    case 'US2':
      return BASE_US2_ENDPOINT;
    default:
      return BASE_ENDPOINT;
  }
};

const getUsersEndpoint = (Config) => `${getBaseEndpoint(Config)}/users`;

const getCustomEventsEndpoint = (Config) => `${getBaseEndpoint(Config)}/events/custom`;

const getAccountsEndpoint = (Config) => `${getBaseEndpoint(Config)}/accounts`;

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
  USER_EXCLUSION_FIELDS,
  ACCOUNT_EXCLUSION_FIELDS,
  identifyMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name],
  trackMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK.name],
  groupMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.GROUP.name],
  getUsersEndpoint,
  getCustomEventsEndpoint,
  getAccountsEndpoint,
  BASE_ENDPOINT,
  BASE_EU_ENDPOINT,
  BASE_US2_ENDPOINT,
  getBaseEndpoint,
};
