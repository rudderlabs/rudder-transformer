const ENDPOINT = 'https://ct.pinterest.com/events/v3';
// ref: https://developers.pinterest.com/docs/api/v5/#tag/conversion_events
const getV5EventsEndpoint = (adAccountId) =>
  `https://api.pinterest.com/v5/ad_accounts/${adAccountId}/events`;

const API_VERSION = {
  v3: 'legacyApi',
  v5: 'newApi',
};

// ref: https://s.pinimg.com/ct/docs/conversions_api/dist/v3.html
const MAX_BATCH_SIZE = 1000;

module.exports = {
  ENDPOINT,
  MAX_BATCH_SIZE,
  getV5EventsEndpoint,
  API_VERSION,
};
