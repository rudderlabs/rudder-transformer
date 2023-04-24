const path = require('path');
const fs = require('fs');
const { EventType } = require('../../../constants');

const IDENTIFY_TOPICS = {
  CUSTOMERS_CREATE: 'customers_create',
  CUSTOMERS_UPDATE: 'customers_update',
};

// Mapping from shopify_topic name for ecom events
const ECOM_TOPICS = {
  CHECKOUTS_CREATE: 'checkouts_create',
  CHECKOUTS_UPDATE: 'checkouts_update',
  ORDERS_UPDATE: 'orders_updated',
  ORDERS_CREATE: 'orders_create',
};

const RUDDER_ECOM_MAP = {
  checkouts_create: 'Checkout Started',
  checkouts_update: 'Checkout Updated',
  orders_updated: 'Order Updated',
  orders_create: 'Order Created',
};

const SHOPIFY_TRACK_MAP = {
  checkouts_delete: 'Checkout Deleted',
  carts_create: 'Cart Create',
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

const INTEGERATION = 'SHOPIFY';

const MAPPING_CATEGORIES = {
  [EventType.IDENTIFY]: identifyMappingJSON,
  [EventType.TRACK]: productMappingJSON,
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
const SUPPORTED_TRACK_EVENTS = [
  'checkouts_delete',
  'checkouts_update',
  'customers_disable',
  'customers_enable',
  'carts_create',
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
const timeDifferenceForCartEvents = 10000; // in micro seconds as we will be compairing it in timestamp 
const useRedisDatabase = process.env.USE_REDIS_DB === 'true' || false;
module.exports = {
  ECOM_TOPICS,
  IDENTIFY_TOPICS,
  INTEGERATION,
  MAPPING_CATEGORIES,
  RUDDER_ECOM_MAP,
  lineItemsMappingJSON,
  productMappingJSON,
  LINE_ITEM_EXCLUSION_FIELDS,
  PRODUCT_MAPPING_EXCLUSION_FIELDS,
  SUPPORTED_TRACK_EVENTS,
  SHOPIFY_TRACK_MAP,
  timeDifferenceForCartEvents,
  useRedisDatabase,
};
