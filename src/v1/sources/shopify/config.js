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
  customer_tags_added: 'Customer Tags Added',
  customer_tags_removed: 'Customer Tags Removed',
  customer_email_updated: 'Customer Email Updated',
  collections_create: 'Collection Created',
  collections_update: 'Collection Updated',
  collections_delete: 'Collection Deleted',
  collection_listings_add: 'Collection Listings Added',
  collection_listings_remove: 'Collection Listings Removed',
  collection_listings_update: 'Collection Listings Updated',
  collection_publications_create: 'Collection Publications Created',
  collection_publications_delete: 'Collection Publications Deleted',
  collection_publications_update: 'Collection Publications Updated',
  discounts_create: 'Discount Created',
  discounts_delete: 'Discount Deleted',
  discounts_update: 'Discount Updated',
  draft_orders_create: 'Draft Order Created',
  draft_orders_delete: 'Draft Order Deleted',
  draft_orders_update: 'Draft Order Updated',
  fulfillment_order_split: 'Fulfillment Order Split',
  inventory_items_create: 'Inventory Items Created',
  inventory_items_delete: 'Inventory Items Deleted',
  inventory_items_update: 'Inventory Items Updated',
  inventory_levels_connect: 'Inventory Levels Connected',
  inventory_levels_disconnect: 'Inventory Levels Disconnected',
  inventory_levels_update: 'Inventory Levels Updated',
};

const PIXEL_EVENT_TOPICS = {
  CART_VIEWED: 'cart_viewed',
  PRODUCT_ADDED_TO_CART: 'product_added_to_cart',
  PRODUCT_REMOVED_FROM_CART: 'product_removed_from_cart',
  PAGE_VIEWED: 'page_viewed',
  PRODUCT_VIEWED: 'product_viewed',
  COLLECTION_VIEWED: 'collection_viewed',
  CHECKOUT_STARTED: 'checkout_started',
  CHECKOUT_COMPLETED: 'checkout_completed',
  CHECKOUT_ADDRESS_INFO_SUBMITTED: 'checkout_address_info_submitted',
  CHECKOUT_CONTACT_INFO_SUBMITTED: 'checkout_contact_info_submitted',
  CHECKOUT_SHIPPING_INFO_SUBMITTED: 'checkout_shipping_info_submitted',
  PAYMENT_INFO_SUBMITTED: 'payment_info_submitted',
  SEARCH_SUBMITTED: 'search_submitted',
};

const PIXEL_EVENT_MAPPING = {
  cart_viewed: 'Cart Viewed',
  product_added_to_cart: 'Product Added',
  product_removed_from_cart: 'Product Removed',
  page_viewed: 'Page Viewed',
  product_viewed: 'Product Viewed',
  collection_viewed: 'Collection Viewed',
  checkout_started: 'Checkout Started',
  checkout_completed: 'Checkout Completed',
  checkout_address_info_submitted: 'Checkout Address Info Submitted',
  checkout_contact_info_submitted: 'Checkout Contact Info Submitted',
  checkout_shipping_info_submitted: 'Checkout Shipping Info Submitted',
  payment_info_submitted: 'Payment Info Submitted',
  search_submitted: 'Search Submitted',
};

const identifyMappingJSON = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'data', 'identifyMapping.json')),
);

const contextualFieldMappingJSON = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'data', 'contextualFieldMapping.json')),
);

const cartViewedEventMappingJSON = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'data', 'cartViewedEventMapping.json')),
);

const productListViewedEventMappingJSON = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'data', 'productListViewedEventMapping.json')),
);

const productViewedEventMappingJSON = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'data', 'productViewedEventMapping.json')),
);

const productToCartEventMappingJSON = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'data', 'productToCartEventMapping.json')),
);

const checkoutStartedCompletedEventMappingJSON = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'data', 'checkoutStartedCompletedEventMapping.json')),
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
  'customer_tags_added',
  'customer_tags_removed',
  'customer_email_updated',
  'checkouts_delete',
  'checkouts_update',
  'customers_disable',
  'customers_enable',
  'collections_create',
  'collections_update',
  'collections_delete',
  'collection_listings_add',
  'collection_listings_remove',
  'collection_listings_update',
  'collection_publications_create',
  'collection_publications_delete',
  'collection_publications_update',
  'discounts_create',
  'discounts_delete',
  'discounts_update',
  'draft_orders_create',
  'draft_orders_delete',
  'draft_orders_update',
  'carts_update',
  'fulfillments_create',
  'fulfillments_update',
  'fulfillment_order_split',
  'inventory_items_create',
  'inventory_items_delete',
  'inventory_items_update',
  'inventory_levels_connect',
  'inventory_levels_disconnect',
  'inventory_levels_update',
  'orders_create',
  'orders_delete',
  'orders_edited',
  'orders_cancelled',
  'orders_fulfilled',
  'orders_paid',
  'orders_partially_fullfilled',
];

const maxTimeToIdentifyRSGeneratedCall = 10000; // in ms
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
  PIXEL_EVENT_TOPICS,
  PIXEL_EVENT_MAPPING,
  useRedisDatabase,
  SHOPIFY_ADMIN_ONLY_EVENTS,
  maxTimeToIdentifyRSGeneratedCall,
  contextualFieldMappingJSON,
  cartViewedEventMappingJSON,
  productListViewedEventMappingJSON,
  productViewedEventMappingJSON,
  productToCartEventMappingJSON,
  checkoutStartedCompletedEventMappingJSON,
};
