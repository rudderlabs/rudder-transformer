const CREATE_USERS_URL = 'https://advertising-api.amazon.com/dp/records/hashed/';
const ASSOCIATE_USERS_URL = 'https://advertising-api.amazon.com/v2/dp/audience';
const MAX_PAYLOAD_SIZE_IN_BYTES = 4000000;
const DESTINATION = 'amazon_audience';
const VALID_OPERATIONS = ['remove', 'add'];
const UNBATCHABLE_EVENT_ERROR =
  '[AMAZON AUDIENCE]: Event cannot be batched due to unsupported action';
const UNBATCHABLE_EVENT_STAT = 'amazon_audience_unbatchable_event_count';
const UNBATCHABLE_EVENT_REASON = 'unsupported_action';

module.exports = {
  CREATE_USERS_URL,
  MAX_PAYLOAD_SIZE_IN_BYTES,
  ASSOCIATE_USERS_URL,
  DESTINATION,
  VALID_OPERATIONS,
  UNBATCHABLE_EVENT_ERROR,
  UNBATCHABLE_EVENT_STAT,
  UNBATCHABLE_EVENT_REASON,
};
