const path = require('path');
const fs = require('fs');
const { EventType } = require('../../../constants');
const { getMappingConfig } = require('../../util');

const INTEGERATION = 'SHOPIFY';

const NO_OPERATION_SUCCESS = {
  outputToSource: {
    body: Buffer.from('OK').toString('base64'),
    contentType: 'text/plain',
  },
  statusCode: 200,
};

const identifierEvents = ['rudderIdentifier', 'rudderSessionIdentifier'];

const IDENTIFY_TOPICS = ['customers_create', 'customers_update'];

const RUDDER_ECOM_MAP = {
  checkouts_create: {
    event: 'Checkout Started',
    name: 'CheckoutStartedConfig',
    lineItems: true,
  },
  // Shopify checkout_update topic mapped with RudderStack Checkout Step Viewed, Checkout Step Completed and Payment Info Entered events
  checkout_step_viewed: { event: 'Checkout Step Viewed', name: 'CheckoutStepViewedConfig' },
  checkout_step_completed: {
    event: 'Checkout Step Completed',
    name: 'CheckoutStepCompletedConfig',
  },
  payment_info_entered: { event: 'Payment Info Entered', name: 'PaymentInfoEnteredConfig' },
  orders_updated: { event: 'Order Updated', name: 'OrderUpdatedConfig', lineItems: true },
  // carts_update: { event: 'Cart Updated', name: 'CartsUpdatedConfig' }, // This will split into Product Added and Product Removed,
  orders_paid: { event: 'Order Completed', name: 'OrderCompletedConfig', lineItems: true },
  orders_cancelled: {
    event: 'Order Cancelled',
    name: 'OrderCancelledConfig',
    lineItems: true,
  },
};

const SHOPIFY_TO_RUDDER_ECOM_EVENTS_MAP = ['Cart Update', 'Checkout Updated'];

const SHOPIFY_ADMIN_ONLY_EVENTS = ['Order Deleted', 'Fulfillments Create', 'Fulfillments Update'];

/**
 * Map of events name supported as generic track calls
 * track events not belonging to this map or ecom events will
 * be discarded.
 */
const SHOPIFY_NON_ECOM_TRACK_MAP = {
  checkouts_delete: 'Checkout Deleted',
  customers_enable: 'Customer Enabled',
  customers_disable: 'Customer Disabled',
  fulfillments_create: 'Fulfillments Create',
  fulfillments_update: 'Fulfillments Update',
  orders_delete: 'Order Deleted',
  orders_edited: 'Order Edited',
  orders_fulfilled: 'Order Fulfilled',
  orders_partially_fullfilled: 'Order Partially Fulfilled',
  orders_create: 'Order Created',
};

const identifyMappingJSON = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'data', 'identifyMapping.json')),
);

const propertiesMappingJSON = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'data', 'propertiesMapping.json')),
);

const lineItemsMappingJSON = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'data', 'lineItemsMapping.json')),
);

const ECOM_MAPPING_JSON = getMappingConfig(RUDDER_ECOM_MAP, __dirname);

const MAPPING_CATEGORIES = {
  [EventType.IDENTIFY]: identifyMappingJSON,
  [EventType.TRACK]: propertiesMappingJSON,
};

const LINE_ITEM_EXCLUSION_FIELDS = [
  'product_id',
  'sku',
  'name',
  'price',
  'vendor',
  'quantity',
  'variant_title',
  'variant_id',
];

const PROPERTIES_MAPPING_EXCLUSION_FIELDS = [
  'id',
  'total_price',
  'total_tax',
  'currency',
  'line_items',
  'customer',
  'shipping_address',
  'billing_address',
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
  propertiesMappingJSON,
  LINE_ITEM_EXCLUSION_FIELDS,
  PROPERTIES_MAPPING_EXCLUSION_FIELDS,
  SHOPIFY_NON_ECOM_TRACK_MAP,
  SHOPIFY_ADMIN_ONLY_EVENTS,
  maxTimeToIdentifyRSGeneratedCall,
  ECOM_MAPPING_JSON,
};
