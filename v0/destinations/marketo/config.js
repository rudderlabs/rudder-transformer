const { getMappingConfig, getHashFromArray } = require("../../util");

const CONFIG_CATEGORIES = {
  IDENTIFY: { name: "MARKETOIdentify" }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

const formatConfig = destination => {
  return {
    ...destination.Config,
    customActivityEventMap: getHashFromArray(
      destination.Config.customActivityEventMap,
      "from",
      "to",
      false
    ),
    customActivityPropertyMap: getHashFromArray(
      destination.Config.customActivityPropertyMap,
      "from",
      "to",
      false
    ),
    customActivityPrimaryKeyMap: getHashFromArray(
      destination.Config.customActivityPrimaryKeyMap,
      "from",
      "to",
      false
    ),
    leadTraitMapping: getHashFromArray(
      destination.Config.leadTraitMapping,
      "from",
      "to",
      false
    )
  };
};

module.exports = {
  formatConfig,
  identifyConfig: MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name]
};
