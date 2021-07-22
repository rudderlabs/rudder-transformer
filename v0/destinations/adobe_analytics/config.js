const { getMappingConfig, getHashFromArray } = require("../../util");

const CONFIG_CATEGORIES = { COMMON: { name: "AACommonConfig" } };

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

const formatDestinationConfig = config => {
  return {
    ...config,
    eventsToTypes: getHashFromArray(config.eventsToTypes, "from", "to", false),
    listMapping: getHashFromArray(config.listMapping, "from", "to", false),
    listDelimiter: getHashFromArray(config.listDelimiter, "from", "to", false),
    productMerchEvarsMap: getHashFromArray(
      config.productMerchEvarsMap,
      "from",
      "to",
      false
    ),
    productMerchEventToAdobeEvent: getHashFromArray(
      config.productMerchEventToAdobeEvent,
      "from",
      "to",
      false
    ),
    eventMerchEventToAdobeEvent: getHashFromArray(
      config.eventMerchEventToAdobeEvent,
      "from",
      "to",
      false
    ),
    rudderEventsToAdobeEvents: getHashFromArray(
      config.rudderEventsToAdobeEvents,
      "from",
      "to",
      false
    ),
    customPropsMapping: getHashFromArray(
      config.listMapping,
      "from",
      "to",
      false
    ),
    propsDelimiter: getHashFromArray(
      config.propsDelimiter,
      "from",
      "to",
      false
    ),
    eVarMapping: getHashFromArray(config.eVarMapping, "from", "to", false),
    hierMapping: getHashFromArray(config.hierMapping, "from", "to", false),
    contextDataMapping: getHashFromArray(
      config.contextDataMapping,
      "from",
      "to",
      false
    )
  };
};

module.exports = {
  commonConfig: MAPPING_CONFIG[CONFIG_CATEGORIES.COMMON.name],
  formatDestinationConfig
};
