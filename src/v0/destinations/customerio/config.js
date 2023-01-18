const IDENTITY_ENDPOINT = 'https://track.customer.io/api/v1/customers/:id';

const USER_EVENT_ENDPOINT = 'https://track.customer.io/api/v1/customers/:id/events';

const MERGE_USER_ENDPOINT = 'https://track.customer.io/api/v1/merge_customers';

const ANON_EVENT_ENDPOINT = 'https://track.customer.io/api/v1/events';

const DEVICE_REGISTER_ENDPOINT = 'https://track.customer.io/api/v1/customers/:id/devices';

const DEVICE_DELETE_ENDPOINT = 'https://track.customer.io/api/v1/customers/:id/devices/:device_id';

module.exports = {
  IDENTITY_ENDPOINT,
  USER_EVENT_ENDPOINT,
  ANON_EVENT_ENDPOINT,
  DEVICE_REGISTER_ENDPOINT,
  DEVICE_DELETE_ENDPOINT,
  MERGE_USER_ENDPOINT,
};
