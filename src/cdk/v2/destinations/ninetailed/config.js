const { getMappingConfig } = require('../../../../v0/util');

const ConfigCategories = {
  GENERAL: {
    type: 'general',
    name: 'generalPayloadMapping',
  },
  CONTEXT: {
    type: 'context',
    name: 'contextMapping',
  },
  TRACK: {
    type: 'track',
    name: 'trackMapping',
  },
  IDENTIFY: {
    type: 'identify',
    name: 'identifyMapping',
  },
};

const mappingConfig = getMappingConfig(ConfigCategories, __dirname);
const batchEndpoint =
  'https://experience.ninetailed.co/v2/organizations/{{organisationId}}/environments/{{environment}}/events';

module.exports = { ConfigCategories, mappingConfig, batchEndpoint, MAX_BATCH_SIZE: 200 };
