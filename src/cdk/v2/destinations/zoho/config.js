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

const getBaseEndpoint = (dataServer) => DATA_CENTRE_BASE_ENDPOINTS_MAP[dataServer];
const COMMON_RECORD_ENDPOINT = (dataCenter = 'US') =>
  `${getBaseEndpoint(dataCenter)}/crm/v6/moduleType`;

// ref: https://www.zoho.com/crm/developer/docs/api/v6/insert-records.html#:~:text=%2DX%20POST-,System%2Ddefined%20mandatory%20fields%20for%20each%20module,-While%20inserting%20records
const MODULE_MANDATORY_FIELD_CONFIG = {
  Leads: ['Last_Name'],
  Contacts: ['Last_Name'],
  Accounts: ['Account_Name'],
  Deals: ['Deal_Name', 'Stage', 'Pipeline'],
  Tasks: ['Subject'],
  Calls: ['Subject', 'Call_Type', 'Call_Start_Time', 'Call_Duration'],
  Events: ['Event_Title', 'Start_DateTime', 'Remind_At', 'End_DateTime'],
  Products: ['Product_Name'],
  Quotes: ['Subject', 'Quoted_Items'],
  Invoices: ['Subject', 'Invoiced_Items'],
  Campaigns: ['Campaign_Name'],
  Vendors: ['Vendor_Name'],
  'Price Books': ['Price_Book_Name', 'Pricing_Details'],
  Cases: ['Case_Origin', 'Status', 'Subject'],
  Solutions: ['Solution_Title'],
  'Purchase Orders': ['Subject', 'Vendor_Name', 'Purchased_Items'],
  'Sales Orders': ['Subject', 'Ordered_Items'],
};

const MODULE_WISE_DUPLICATE_CHECK_FIELD = {
  Leads: ['Email'],
  Accounts: ['Account_Name'],
  Contacts: ['Email'],
  Deals: ['Deal_Name'],
  Campaigns: ['Campaign_Name'],
  Cases: ['Subject'],
  Solutions: ['Solution_Title'],
  Products: ['Product_Name'],
  Vendors: ['Vendor_Name'],
  PriceBooks: ['Price_Book_Name'],
  Quotes: ['Subject'],
  SalesOrders: ['Subject'],
  PurchaseOrders: ['Subject'],
  Invoices: ['Subject'],
  CustomModules: ['Name'],
};

module.exports = {
  MAX_BATCH_SIZE: 100,
  DATA_CENTRE_BASE_ENDPOINTS_MAP,
  COMMON_RECORD_ENDPOINT,
  MODULE_MANDATORY_FIELD_CONFIG,
  MODULE_WISE_DUPLICATE_CHECK_FIELD,
};
