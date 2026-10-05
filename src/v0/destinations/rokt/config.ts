export const BULK_EVENTS_PATH = '/v2/bulkevents';
export const ROKT_INTEGRATION_ID = '1277' as const;
export const MAX_BATCHES_PER_REQUEST = 100;

// Single-value lookups resolved left to right; the first present value wins.
export const IP_SOURCE_KEYS = ['context.ip', 'context.request_ip', 'request_ip'];
export const CLICK_ID_SOURCE_KEYS = [
  'properties.roktClickId',
  'properties.rokt_click_id',
  'properties.rclid',
  'properties.rtid',
];
export const PAGE_SEARCH_SOURCE_KEY = 'context.page.search';
export const TIMESTAMP_SOURCE_KEYS = ['timestamp', 'originalTimestamp', 'sentAt'];
export const CONVERSION_TYPE_SOURCE_KEYS = [
  'properties.conversiontype',
  'properties.conversionType',
  'properties.conversion_type',
  'event',
];
export const DEVICE_TYPE_SOURCE_KEY = 'context.device.type';
export const ADVERTISING_ID_SOURCE_KEY = 'context.device.advertisingId';
