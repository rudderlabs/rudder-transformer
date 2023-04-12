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
  eventsToTypes: getHashFromArray(config.eventsToTypes, 'from', 'to', false),
  listMapping: getHashFromArray(config.listMapping, 'from', 'to', false),
  listDelimiter: getHashFromArray(config.listDelimiter, 'from', 'to', false),
  productMerchEvarsMap: getHashFromArray(config.productMerchEvarsMap, 'from', 'to', false),
  productMerchEventToAdobeEvent: getHashFromArray(
    config.productMerchEventToAdobeEvent,
    'from',
    'to',
    false,
  ),
  eventMerchProperties: config.eventMerchProperties,
  eventMerchEventToAdobeEvent: getHashFromArray(
    config.eventMerchEventToAdobeEvent,
    'from',
    'to',
    false,
  ),
  rudderEventsToAdobeEvents: getHashFromArray(
    config.rudderEventsToAdobeEvents,
    'from',
    'to',
    false,
  ),
  customPropsMapping: getHashFromArray(config.customPropsMapping, 'from', 'to', false),
  propsDelimiter: getHashFromArray(config.propsDelimiter, 'from', 'to', false),
  eVarMapping: getHashFromArray(config.eVarMapping, 'from', 'to', false),
  hierMapping: getHashFromArray(config.hierMapping, 'from', 'to', false),
  contextDataMapping: getHashFromArray(config.contextDataMapping, 'from', 'to', false),
});

module.exports = {
  ECOM_PRODUCT_EVENTS,
  commonConfig: MAPPING_CONFIG[CONFIG_CATEGORIES.COMMON.name],
  formatDestinationConfig,
};
