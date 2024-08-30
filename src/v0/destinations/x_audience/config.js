const BASE_URL =
  'https://ads-api.twitter.com/12/accounts/:account_id/custom_audiences/:custom_audience_id/users';
const MAX_PAYLOAD_SIZE_IN_BYTES = 4000000;
const MAX_OPERATIONS = 2500;
module.export = { BASE_URL, MAX_PAYLOAD_SIZE_IN_BYTES, MAX_OPERATIONS };
