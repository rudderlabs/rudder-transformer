const SUPPORTED_MESSAGE_TYPE = 'audiencelist';
const ACTION_TYPES = ['add', 'remove'];
// ref:- https://docs.launchdarkly.com/guides/integrations/build-synced-segments?q=othercapabilities#manifest-details
// ref:- https://docs.launchdarkly.com/home/segments#targeting-users-in-segments
const ENDPOINT = 'https://app.launchdarkly.com/api/v2/segment-target/rudderstack';

module.exports = {
  SUPPORTED_MESSAGE_TYPE,
  ACTION_TYPES,
  ENDPOINT,
};
