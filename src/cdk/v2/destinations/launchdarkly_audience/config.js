const SUPPORTED_EVENT_TYPE = 'audiencelist';
const ACTION_TYPES = ['add', 'remove'];
const IDENTIFIER_KEY = 'identifier';
// ref:- https://docs.launchdarkly.com/guides/integrations/build-synced-segments?q=othercapabilities#manifest-details
// ref:- https://docs.launchdarkly.com/home/segments#targeting-users-in-segments
const ENDPOINT = 'https://app.launchdarkly.com/api/v2/segment-targets/rudderstack';
const MAX_IDENTIFIERS = 1000;

module.exports = {
  SUPPORTED_EVENT_TYPE,
  ACTION_TYPES,
  IDENTIFIER_KEY,
  ENDPOINT,
  MAX_IDENTIFIERS,
};
