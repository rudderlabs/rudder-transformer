const IDENTITY_ENDPOINT = {
  us: "https://track.customer.io/api/v1/customers/:id",
  eu: "https://track-eu.customer.io/api/v1/customers/:id"
};

const USER_EVENT_ENDPOINT = {
  us: "https://track.customer.io/api/v1/customers/:id/events",
  eu: "https://track-eu.customer.io/api/v1/customers/:id/events"
};

const ANON_EVENT_ENDPOINT = {
  us: "https://track.customer.io/api/v1/events",
  eu: "https://track-eu.customer.io/api/v1/events"
};

const DEVICE_REGISTER_ENDPOINT = {
  us: "https://track.customer.io/api/v1/customers/:id/devices",
  eu: "https://track-eu.customer.io/api/v1/customers/:id/devices"
};

const DEVICE_DELETE_ENDPOINT = {
  us: "https://track.customer.io/api/v1/customers/:id/devices/:device_id",
  eu: "https://track-eu.customer.io/api/v1/customers/:id/devices/:device_id"
};

module.exports = {
  IDENTITY_ENDPOINT,
  USER_EVENT_ENDPOINT,
  ANON_EVENT_ENDPOINT,
  DEVICE_REGISTER_ENDPOINT,
  DEVICE_DELETE_ENDPOINT
};
