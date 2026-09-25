const { getMappingConfig } = require('../../util');

const ENDPOINT = 'https://api.topsort.com/v2/events';

const ConfigCategory = {
  TRACK: {
    type: 'track',
    name: 'TopsortTrackConfig',
  },
  PLACEMENT: { name: 'TopsortPlacementConfig' },
  ITEM: { name: 'TopsortItemConfig' },
  PURCHASE_ITEM: { name: 'TopSortPurchaseProductConfig' },
};

// The Events API binds `max=50` on each of the impressions/clicks/purchases arrays
// independently, and rejects the whole request past that.
const MAX_BATCH_SIZE = 50;

const ECOMM_EVENTS_WITH_PRODUCT_ARRAY = [
  'Cart Viewed',
  'Checkout Started',
  'Order Updated',
  'Order Completed',
  'Order Refunded',
  'Order Cancelled',
];

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

module.exports = {
  mappingConfig,
  ConfigCategory,
  ENDPOINT,
  MAX_BATCH_SIZE,
  ECOMM_EVENTS_WITH_PRODUCT_ARRAY,
};
