const SUPPORTED_EVENT_TYPE = 'record';
const ACTION_TYPES = ['insert', 'delete'];
const DATA_PROVIDER_ID = 'rudderstack';

// ref:- https://partner.thetradedesk.com/v3/portal/data/doc/DataEnvironments
const DATA_SERVERS_BASE_ENDPOINTS_MAP = {
  apac: 'https://sin-data.adsrvr.org',
  tokyo: 'https://tok-data.adsrvr.org',
  usEastCoast: 'https://use-data.adsrvr.org',
  usWestCoast: 'https://usw-data.adsrvr.org',
  ukEu: 'https://euw-data.adsrvr.org',
  china: 'https://data-cn2.adsrvr.cn',
};

module.exports = {
  SUPPORTED_EVENT_TYPE,
  ACTION_TYPES,
  DATA_PROVIDER_ID,
  MAX_REQUEST_SIZE_IN_BYTES: 2500000,
  DATA_SERVERS_BASE_ENDPOINTS_MAP,
};
