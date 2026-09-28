const BASE_URL = 'https://api.topsort.com';
export const ENDPOINT_PATH = '/v2/events';
export const ENDPOINT = `${BASE_URL}${ENDPOINT_PATH}`;

// The Events API binds `maxItems: 50` on each of the impressions/clicks/purchases arrays
// independently, and rejects the whole request past that.
export const MAX_BATCH_SIZE = 50;

// Only these events fan out over `properties.products`; any other event maps its single
// product from the top-level properties.
export const ECOMM_EVENTS_WITH_PRODUCT_ARRAY = new Set([
  'Cart Viewed',
  'Checkout Started',
  'Order Updated',
  'Order Completed',
  'Order Refunded',
  'Order Cancelled',
]);
