const { getMappingConfig } = require('../../util');

const BASE_URL = 'https://api.factors.ai/integrations/rudderstack_platform';

const ConfigCategories = {
  TRACK: {
    type: 'track',
    name: 'FactorsAITrackConfig',
  },
  IDENTIFY: {
    type: 'identify',
    name: 'FactorsAIIdentifyConfig',
  },
};

const mappingConfig = getMappingConfig(ConfigCategories, __dirname);
module.exports = {
  mappingConfig,
  ConfigCategories,
  BASE_URL,
};
