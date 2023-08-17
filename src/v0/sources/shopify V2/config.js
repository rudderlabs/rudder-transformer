const path = require('path');
const fs = require('fs');
const { EventType } = require('../../../constants');

const INTEGERATION = 'SHOPIFY';

const NO_OPERATION_SUCCESS = {
  outputToSource: {
    body: Buffer.from('OK').toString('base64'),
    contentType: 'text/plain',
  },
  statusCode: 200,
};

const identifierEvents = ['rudderIdentifier', 'rudderSessionIdentifier'];

const IDENTIFY_TOPICS = {
  CUSTOMERS_CREATE: 'customers_create',
  CUSTOMERS_UPDATE: 'customers_update',
};

const RUDDER_ECOM_MAP = {   // TOBEUPDATED:
  checkouts_create: 'Checkout Started',
  checkouts_update: 'Checkout Updated',
  orders_updated: 'Order Updated',
  orders_create: 'Order Created',
  carts_update: 'Cart Updated' // This will split into Product Added and Product Removed
};

const SHOPIFY_TO_RUDDER_ECOM_EVENTS_MAP = ['Cart Update', 'Checkout Updated'];

const SHOPIFY_ADMIN_ONLY_EVENTS = ['Order Deleted', 'Fulfillments Create', 'Fulfillments Update'];

const SHOPIFY_TRACK_MAP = {
  checkouts_delete: 'Checkout Deleted',
  carts_update: 'Cart Update',
  customers_enable: 'Customer Enabled',
  customers_disable: 'Customer Disabled',
  fulfillments_create: 'Fulfillments Create',
  fulfillments_update: 'Fulfillments Update',
  orders_delete: 'Order Deleted',
  orders_edited: 'Order Edited',
  orders_cancelled: 'Order Cancelled',
  orders_fulfilled: 'Order Fulfilled',
  orders_paid: 'Order Paid',
  orders_partially_fullfilled: 'Order Partially Fulfilled',
};

const identifyMappingJSON = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'data', 'identifyMapping.json')),
);

const productMappingJSON = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'data', 'productMapping.json')),
);

const lineItemsMappingJSON = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'data', 'lineItemsMapping.json')),
);

const MAPPING_CATEGORIES = {
  [EventType.IDENTIFY]: identifyMappingJSON,
  [EventType.TRACK]: productMappingJSON,
  // update it for every ECOM ma[ong and genera mapping]
};

const LINE_ITEM_EXCLUSION_FIELDS = [
  'product_id',
  'sku',
  'name',
  'price',
  'vendor',
  'quantity',
  'variant_id',
  'variant_price',
  'variant_title',
];

const PRODUCT_MAPPING_EXCLUSION_FIELDS = [
  'id',
  'total_price',
  'total_tax',
  'currency',
  'line_items',
  'customer',
  'shipping_address',
  'billing_address',
];

/**
 * list of events name supported as generic track calls
 * track events not belonging to this list or ecom events will
 * be discarded.
 */
const NON_ECOM_SUPPORTED_EVENTS = [ // to be updated 
  'checkouts_delete',
  'checkouts_update',
  'customers_disable',
  'customers_enable',
  'carts_update',
  'fulfillments_create',
  'fulfillments_update',
  'orders_create',
  'orders_delete',
  'orders_edited',
  'orders_cancelled',
  'orders_fulfilled',
  'orders_paid',
  'orders_partially_fullfilled',
];

const maxTimeToIdentifyRSGeneratedCall = 10000; // in ms

module.exports = {
  NO_OPERATION_SUCCESS,
  identifierEvents,
  IDENTIFY_TOPICS,
  INTEGERATION,
  SHOPIFY_TO_RUDDER_ECOM_EVENTS_MAP,
  MAPPING_CATEGORIES,
  RUDDER_ECOM_MAP,
  lineItemsMappingJSON,
  productMappingJSON,
  LINE_ITEM_EXCLUSION_FIELDS,
  PRODUCT_MAPPING_EXCLUSION_FIELDS,
  NON_ECOM_SUPPORTED_EVENTS,
  SHOPIFY_TRACK_MAP,
  SHOPIFY_ADMIN_ONLY_EVENTS,
  maxTimeToIdentifyRSGeneratedCall
};
