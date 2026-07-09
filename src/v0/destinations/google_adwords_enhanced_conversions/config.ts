const { getMappingConfig } = require('../../util');

const CONFIG_CATEGORIES = {
  TRACK_CONFIG: { type: 'track', name: 'trackConfig' },
};

const CONVERSION_ACTION_ID_CACHE_TTL = process.env.CONVERSION_ACTION_ID_CACHE_TTL
  ? parseInt(process.env.CONVERSION_ACTION_ID_CACHE_TTL, 10)
  : 24 * 60 * 60;
const hashAttributes = ['email', 'phone', 'firstName', 'lastName', 'streetAddress'];
const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

// Google Ads API caps UploadConversionAdjustments at 2000 conversion adjustments per
// request; exceeding it is rejected with TOO_MANY_ADJUSTMENTS_IN_REQUEST.
// Ref - https://developers.google.com/google-ads/api/docs/best-practices/quotas
const MAX_CONVERSION_ADJUSTMENTS_PER_BATCH = 2000;

module.exports = {
  trackMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK_CONFIG.name],
  hashAttributes,
  CONVERSION_ACTION_ID_CACHE_TTL,
  MAX_CONVERSION_ADJUSTMENTS_PER_BATCH,
  destType: 'google_adwords_enhanced_conversions',
};
