const { getMappingConfig, getHashFromArray } = require("../../util");

const CONFIG_CATEGORIES = { COMMON: { name: "AACommonConfig" } };

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

const formatDestinationConfig = config => {
  return {
    ...config,
    eventsToTypes: getHashFromArray(config.eventsToTypes),
    listMapping: getHashFromArray(config.listMapping),
    listDelimiter: getHashFromArray(config.listDelimiter),
    productMerchEvarsMap: getHashFromArray(config.productMerchEvarsMap),
    productMerchEventToAdobeEvent: getHashFromArray(
      config.productMerchEventToAdobeEvent
    ),
    eventMerchProperties: config.eventMerchProperties,
    eventMerchEventToAdobeEvent: getHashFromArray(
      config.eventMerchEventToAdobeEvent
    ),
    rudderEventsToAdobeEvents: getHashFromArray(
      config.rudderEventsToAdobeEvents
    ),
    customPropsMapping: getHashFromArray(config.customPropsMapping),
    propsDelimiter: getHashFromArray(config.propsDelimiter),
    eVarMapping: getHashFromArray(config.eVarMapping),
    hierMapping: getHashFromArray(config.hierMapping),
    contextDataMapping: getHashFromArray(config.contextDataMapping)
  };
};

module.exports = {
  commonConfig: MAPPING_CONFIG[CONFIG_CATEGORIES.COMMON.name],
  formatDestinationConfig
};
