const { ConfigurationError } = require('@rudderstack/integrations-lib');
const { getMappingConfig } = require('../../util');

const CONFIG_CATEGORIES = {
  TRACK_CONFIG: { type: 'track', name: 'trackConfig' },
};

const CONVERSION_ACTION_ID_CACHE_TTL = process.env.CONVERSION_ACTION_ID_CACHE_TTL
  ? parseInt(process.env.CONVERSION_ACTION_ID_CACHE_TTL, 10)
  : 24 * 60 * 60;
const hashAttributes = ['email', 'phone', 'firstName', 'lastName', 'streetAddress'];
const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

const getDeveloperToken = () => {
  const { GOOGLE_ADS_DEVELOPER_TOKEN } = process.env;
  if (GOOGLE_ADS_DEVELOPER_TOKEN) {
    return GOOGLE_ADS_DEVELOPER_TOKEN;
  }
  throw new ConfigurationError(
    'GOOGLE_ADS_DEVELOPER_TOKEN is not set, please reach out to support',
  );
};

module.exports = {
  trackMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK_CONFIG.name],
  hashAttributes,
  CONVERSION_ACTION_ID_CACHE_TTL,
  destType: 'google_adwords_enhanced_conversions',
  getDeveloperToken,
};
