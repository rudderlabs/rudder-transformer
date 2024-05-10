const { getMappingConfig } = require('../../../../v0/util');

const ConfigCategories = {
  IMPRESSIONS: {
    type: 'track',
    name: 'impressionsMapping',
  },
  CLICKS: {
    type: 'track',
    name: 'clicksMapping',
  },
  CONVERSIONS: {
    type: 'track',
    name: 'conversionsMapping',
  },
};

const mappingConfig = getMappingConfig(ConfigCategories, __dirname);

module.exports = { ConfigCategories, mappingConfig };
