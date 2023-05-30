const { getMappingConfig } = require('../../util');

const WEBENGAGE_IDENTIFY_EXCLUSION = [
  'email',
  'phone',
  'phoneNumber',
  'phone_number',
  'firstName',
  'firstname',
  'lastname',
  'lastName',
  'name',
  'userId',
  'anonymousId',
  'birthDate',
  'dateOfBirth',
  'dateofbirth',
  'birthday',
  'dob',
  'DOB',
  'gender',
  'emailOptIn',
  'smsOptIn',
  'whatsappOptIn',
  'company',
  'hashedEmail',
  'hashedPhone',
  'postalCode',
  'country',
  'city',
  'locality',
  'region',
];
const ENDPOINT = (dataCenter) => {
  const endPoint =
    dataCenter === 'ind'
      ? 'https://api.in.webengage.com/v1/accounts'
      : 'https://api.webengage.com/v1/accounts';
  return endPoint;
};
const CONFIG_CATEGORIES = {
  IDENTIFY: {
    name: 'WEBENGAGEIdentifyConfig',
    type: 'identify',
  },
  EVENT: {
    name: 'WEBENGAGETrackConfig',
    type: 'track',
  },
};
const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);
module.exports = {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  WEBENGAGE_IDENTIFY_EXCLUSION,
  ENDPOINT,
};
