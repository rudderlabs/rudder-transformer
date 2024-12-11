const { getMappingConfig } = require('../../util');

const BASE_URL = 'https://api.topsort.com/v2/events';

const ConfigCategory = {
  TRACK: {
    type: 'track',
    name: 'TopsortTrackConfig',
  },
  PLACEMENT: { name: 'TopsortPlacementConfig' },
  ITEM: { name: 'TopsortItemConfig' },
  PURCHASE_ITEM: { name: 'TopSortPurchaseProductConfig' },
};

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
  BASE_URL,
  ECOMM_EVENTS_WITH_PRODUCT_ARRAY,
};
