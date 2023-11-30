const { getMappingConfig } = require('../../util');

const ACCESS_TOKEN_CACHE_TTL = process.env.ACCESS_TOKEN_CACHE_TTL
  ? parseInt(process.env.ACCESS_TOKEN_CACHE_TTL, 10)
  : 0;

const ConfigCategory = {
  IDENTIFY_LEAD: {
    name: 'SFIdentifyLeadConfig',
  },
  IDENTIFY_CONTACT: {
    name: 'SFIdentifyContactConfig',
  },
  IGNORE_LEAD: {
    name: 'SFIgnoreLeadConfig',
  },
  IGNORE_CONTACT: {
    name: 'SFIgnoreContactConfig',
  },
};

const SF_API_VERSION = '50.0';
const SF_TOKEN_REQUEST_URL = 'https://login.salesforce.com/services/oauth2/token';
const SF_TOKEN_REQUEST_URL_SANDBOX = 'https://test.salesforce.com/services/oauth2/token';

const DESTINATION = 'Salesforce';
const OAUTH = 'oauth';
const LEGACY = 'legacy';

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

module.exports = {
  SF_API_VERSION,
  SF_TOKEN_REQUEST_URL,
  SF_TOKEN_REQUEST_URL_SANDBOX,
  identifyLeadMappingJson: mappingConfig[ConfigCategory.IDENTIFY_LEAD.name],
  identifyContactMappingJson: mappingConfig[ConfigCategory.IDENTIFY_CONTACT.name],
  ignoredLeadTraits: mappingConfig[ConfigCategory.IGNORE_LEAD.name],
  ignoredContactTraits: mappingConfig[ConfigCategory.IGNORE_CONTACT.name],
  ACCESS_TOKEN_CACHE_TTL,
  DESTINATION,
  OAUTH,
  LEGACY,
};
