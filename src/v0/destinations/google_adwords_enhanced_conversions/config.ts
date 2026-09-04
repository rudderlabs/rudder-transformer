import { getMappingConfig } from '../../util';

const CONFIG_CATEGORIES = {
  TRACK_CONFIG: { type: 'track', name: 'trackConfig' },
};

const CONVERSION_ACTION_ID_CACHE_TTL: number = process.env.CONVERSION_ACTION_ID_CACHE_TTL
  ? parseInt(process.env.CONVERSION_ACTION_ID_CACHE_TTL, 10)
  : 24 * 60 * 60;

const hashAttributes: string[] = ['email', 'phone', 'firstName', 'lastName', 'streetAddress'];

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

const API_VERSION = 'v23';

const BASE_ENDPOINT = `https://googleads.googleapis.com/${API_VERSION}/customers`;

const UPLOAD_CONVERSION_ADJUSTMENTS_ENDPOINT_PATH = 'uploadConversionAdjustments';

const getUploadConversionAdjustmentsEndpoint = (customerId: string): string =>
  `${BASE_ENDPOINT}/${customerId}:${UPLOAD_CONVERSION_ADJUSTMENTS_ENDPOINT_PATH}`;

const getUploadConversionAdjustmentsEndpointPath = (customerId: string): string =>
  `/${customerId}:${UPLOAD_CONVERSION_ADJUSTMENTS_ENDPOINT_PATH}`;

// Google Ads API caps UploadConversionAdjustments at 2000 conversion adjustments per
// request; exceeding it is rejected with TOO_MANY_ADJUSTMENTS_IN_REQUEST.
// Ref - https://developers.google.com/google-ads/api/docs/best-practices/quotas
const MAX_CONVERSION_ADJUSTMENTS_PER_BATCH = 2000;

const destType = 'google_adwords_enhanced_conversions';

const trackMapping: unknown[] = MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK_CONFIG.name];

export {
  trackMapping,
  hashAttributes,
  CONVERSION_ACTION_ID_CACHE_TTL,
  API_VERSION,
  getUploadConversionAdjustmentsEndpoint,
  getUploadConversionAdjustmentsEndpointPath,
  MAX_CONVERSION_ADJUSTMENTS_PER_BATCH,
  destType,
};
