const path = require('path');
const fs = require('fs');

const commonCartTokenLocation = 'context.document.location.pathname';

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
  checkout_completed: 'Order Completed',
  checkout_address_info_submitted: 'Checkout Address Info Submitted',
  checkout_contact_info_submitted: 'Checkout Contact Info Submitted',
  checkout_shipping_info_submitted: 'Checkout Shipping Info Submitted',
  payment_info_submitted: 'Payment Info Entered',
  search_submitted: 'Search Submitted',
};

const ECOM_TOPICS = {
  CHECKOUTS_CREATE: 'checkouts_create',
  CHECKOUTS_UPDATE: 'checkouts_update',
  ORDERS_UPDATE: 'orders_updated',
  ORDERS_CREATE: 'orders_create',
  ORDERS_CANCELLED: 'orders_cancelled',
};

const RUDDER_ECOM_MAP = {
  checkouts_create: 'Checkout Started Webhook',
  checkouts_update: 'Checkout Updated',
  orders_updated: 'Order Updated',
  orders_create: 'Order Created',
  orders_cancelled: 'Order Cancelled',
};

const contextualFieldMappingJSON = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'pixelEventsMappings', 'contextualFieldMapping.json')),
);

const cartViewedEventMappingJSON = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'pixelEventsMappings', 'cartViewedEventMapping.json')),
);

const productListViewedEventMappingJSON = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, 'pixelEventsMappings', 'productListViewedEventMapping.json'),
  ),
);

const productViewedEventMappingJSON = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'pixelEventsMappings', 'productViewedEventMapping.json')),
);

const productToCartEventMappingJSON = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'pixelEventsMappings', 'productToCartEventMapping.json')),
);

const checkoutStartedCompletedEventMappingJSON = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, 'pixelEventsMappings', 'checkoutStartedCompletedEventMapping.json'),
  ),
);

const identifyMappingJSON = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'webhookEventsMapping', 'identifyMapping.json')),
);

const productMappingJSON = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'webhookEventsMapping', 'productMapping.json')),
);

const lineItemsMappingJSON = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'webhookEventsMapping', 'lineItemsMapping.json')),
);

const pixelEventToCartTokenLocationMapping = {
  cart_viewed: 'properties.cart_id',
  checkout_address_info_submitted: commonCartTokenLocation,
  checkout_contact_info_submitted: commonCartTokenLocation,
  checkout_shipping_info_submitted: commonCartTokenLocation,
  payment_info_submitted: commonCartTokenLocation,
  checkout_started: commonCartTokenLocation,
  checkout_completed: commonCartTokenLocation,
};

const INTEGERATION = 'SHOPIFY';

module.exports = {
  INTEGERATION,
  PIXEL_EVENT_TOPICS,
  PIXEL_EVENT_MAPPING,
  ECOM_TOPICS,
  RUDDER_ECOM_MAP,
  contextualFieldMappingJSON,
  cartViewedEventMappingJSON,
  productListViewedEventMappingJSON,
  productViewedEventMappingJSON,
  productToCartEventMappingJSON,
  checkoutStartedCompletedEventMappingJSON,
  pixelEventToCartTokenLocationMapping,
  productMappingJSON,
  lineItemsMappingJSON,
  identifyMappingJSON,
};
