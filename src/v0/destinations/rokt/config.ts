export const BULK_EVENTS_PATH = '/v2/bulkevents';
export const ROKT_INTEGRATION_ID = '1277';
export const MAX_BATCHES_PER_REQUEST = 100;
export const MAX_PER_USER_BATCH_BYTES = 128 * 1024;

export const ROKT_EVENTS_API_HOSTS = new Set([
  's2s.mparticle.com',
  's2s.us2.mparticle.com',
  's2s.eu1.mparticle.com',
  's2s.au1.mparticle.com',
]);

export const IOS_DEVICE_TYPES = new Set(['ios', 'iphone', 'ipad', 'ipados', 'apple']);
export const ANDROID_DEVICE_TYPES = new Set(['android']);
