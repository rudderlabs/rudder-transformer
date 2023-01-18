const { getMappingConfig } = require('../../util');

const BASE_ENDPOINT = 'https://api.custify.com';

// track events | Track
const TRACK_ENDPOINT = `${BASE_ENDPOINT}/event`;
// Create, Update a Person with a company | Identify
const USER_ENDPOINT = `${BASE_ENDPOINT}/people`;
// Create, update, delete a company | Group
const COMAPNY_ENDPOINT = `${BASE_ENDPOINT}/company`;

const ConfigCategory = {
  TRACK: {
    endpoint: TRACK_ENDPOINT,
    name: 'CUSTIFYTrackConfig',
  },
  IDENTIFY: {
    endpoint: USER_ENDPOINT,
    name: 'CUSTIFYIdentifyConfig',
  },
  GROUP_COMPANY: {
    endpoint: COMAPNY_ENDPOINT,
    name: 'CUSTIFYGroupCompanyConfig',
  },
  GROUP_USER: {
    endpoint: USER_ENDPOINT,
    name: 'CUSTIFYGroupUserConfig',
  },
};

const MappingConfig = getMappingConfig(ConfigCategory, __dirname);

const ReservedTraitsProperties = [
  'userId',
  'email',
  'phone',
  'name',
  'signed_up_at',
  'session_count',
  'unsubscribed_from_emails',
  'unsubscribed_from_calls',
  'company',
];

const ReservedCompanyProperties = [
  'id',
  'name',
  'industry',
  'company_id',
  'size',
  'website',
  'plan',
  'monthly_revenue',
  'churned',
];

module.exports = {
  ConfigCategory,
  MappingConfig,
  ReservedCompanyProperties,
  ReservedTraitsProperties,
};
