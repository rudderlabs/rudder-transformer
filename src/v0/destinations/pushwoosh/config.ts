export const EVENTS_ENDPOINT =
  'https://integration-segment.svc-nue.pushwoosh.com/integration-segment/v1/post-events';
export const SET_TAGS_ENDPOINT = 'https://api.pushwoosh.com/json/1.3/setTags';
export const EVENTS_ENDPOINT_PATH = '/post-events';
export const SET_TAGS_ENDPOINT_PATH = '/setTags';
// The Pushwoosh Segment destination posts the same endpoint in batches of 100.
export const MAX_BATCH_SIZE = 100;
// post-events accepts only these platforms; anything not Apple or Android is reported as web.
export const DEVICE_PLATFORMS = { ios: 'ios', android: 'android', web: 'web' } as const;
