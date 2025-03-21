// https://www.zoho.com/crm/developer/docs/api/v6/access-refresh.html
const DATA_CENTRE_BASE_ENDPOINTS_MAP = {
  US: 'https://www.zohoapis.com',
  AU: 'https://www.zohoapis.com.au',
  EU: 'https://www.zohoapis.eu',
  IN: 'https://www.zohoapis.in',
  CN: 'https://www.zohoapis.com.cn',
  JP: 'https://www.zohoapis.jp',
  CA: 'https://www.zohoapiscloud.ca',
};

module.exports = {
  MAX_BATCH_SIZE: 100,
  DATA_CENTRE_BASE_ENDPOINTS_MAP,
};
