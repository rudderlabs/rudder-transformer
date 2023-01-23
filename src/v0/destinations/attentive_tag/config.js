const { getMappingConfig } = require('../../util');

const BASE_URL = 'https://api.attentivemobile.com/v1';

const ConfigCategory = {
  ITEMS: { name: 'itemsConfig' },
  IDENTIFY: { name: 'identifyConfig' },
  TRACK: { name: 'customTrackConfig', endpoint: '/events/custom' },
  ORDER_COMPLETED: {
    name: 'orderCompletedConfig',
    endpoint: '/events/ecommerce/purchase',
  },
  PRODUCT_ADDED: {
    name: 'productAddedConfig',
    endpoint: '/events/ecommerce/add-to-cart',
  },
  PRODUCT_VIEWED: {
    name: 'productViewedConfig',
    endpoint: '/events/ecommerce/product-view',
  },
  PRODUCT_LIST_VIEWED: {
    name: 'productListViewedConfig',
    endpoint: '/events/ecommerce/product-view',
  },
};

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

module.exports = {
  BASE_URL,
  ConfigCategory,
  mappingConfig,
};
