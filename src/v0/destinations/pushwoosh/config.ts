export const EVENTS_ENDPOINT =
  'https://integration-rudderstack.svc-nue.pushwoosh.com/integration-segment/v1/post-events';
export const SET_TAGS_ENDPOINT = 'https://api.pushwoosh.com/json/1.3/setTags';
export const EVENTS_ENDPOINT_PATH = '/post-events';
export const SET_TAGS_ENDPOINT_PATH = '/setTags';
// The Pushwoosh Segment destination posts the same endpoint in batches of 100.
export const MAX_BATCH_SIZE = 100;
// Well under the 100m proxy-body-size of the integration-segment ingress; matches posthog.
export const MAX_PAYLOAD_SIZE = '10MB';
// post-events accepts only these platforms; anything not Apple or Android is reported as web.
export const DEVICE_PLATFORMS = { ios: 'ios', android: 'android', web: 'web' } as const;
