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
};
const MAX_BATCH_SIZE = 200; // Maximum number of events to send in a single batch
const mappingConfig = getMappingConfig(ConfigCategories, __dirname);
const batchEndpoint =
  'https://experience.ninetailed.co/v2/organizations/{{organisationId}}/environments/{{environment}}/events';
module.exports = { ConfigCategories, mappingConfig, batchEndpoint, MAX_BATCH_SIZE };
