const BASE_URL = 'https://api.dub.co';
const LEAD_ENDPOINT_PATH = '/track/lead';
const SALES_ENDPOINT_PATH = '/track/sale';
const LEAD_ENDPOINT = `${BASE_URL}${LEAD_ENDPOINT_PATH}`;
const SALES_ENDPOINT = `${BASE_URL}${SALES_ENDPOINT_PATH}`;

// Configuration for field mappings
const MAPPING_CATEGORY = {
  LEAD_CONVERSION: { name: 'trackLead' },
  SALES_CONVERSION: { name: 'trackSale' },
};

export {
  BASE_URL,
  LEAD_ENDPOINT_PATH,
  SALES_ENDPOINT_PATH,
  LEAD_ENDPOINT,
  SALES_ENDPOINT,
  MAPPING_CATEGORY,
};
