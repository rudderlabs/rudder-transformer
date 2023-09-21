const { getMappingConfig, getHashFromArray } = require('../../util');

const CONFIG_CATEGORIES = { COMMON: { name: 'AACommonConfig' } };

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

const ECOM_PRODUCT_EVENTS = [
  'product viewed',
  'viewed product',
  'product list viewed',
  'viewed product list',
  'product added',
  'added product',
  'product removed',
  'removed product',
  'order completed',
  'completed order',
  'cart viewed',
  'viewed cart',
  'checkout started',
  'started checkout',
  'cart opened',
  'opened cart',
];

const formatDestinationConfig = (config) => ({
  ...config,
  eventsToTypes: getHashFromArray(config.eventsToTypes),
  listMapping: getHashFromArray(config.listMapping),
  listDelimiter: getHashFromArray(config.listMapping, 'from', 'delimiter'),
  productMerchEvarsMap: getHashFromArray(config.productMerchEvarsMap),
  productMerchEventToAdobeEvent: getHashFromArray(config.productMerchEventToAdobeEvent),
  eventMerchProperties: config.eventMerchProperties,
  eventMerchEventToAdobeEvent: getHashFromArray(config.eventMerchEventToAdobeEvent),
  rudderEventsToAdobeEvents: getHashFromArray(config.rudderEventsToAdobeEvents),
  customPropsMapping: getHashFromArray(config.customPropsMapping),
  propsDelimiter: getHashFromArray(config.customPropsMapping, 'from', 'delimiter'),
  eVarMapping: getHashFromArray(config.eVarMapping),
  hierMapping: getHashFromArray(config.hierMapping),
  contextDataMapping: getHashFromArray(config.contextDataMapping),
});

module.exports = {
  ECOM_PRODUCT_EVENTS,
  commonConfig: MAPPING_CONFIG[CONFIG_CATEGORIES.COMMON.name],
  formatDestinationConfig,
};
