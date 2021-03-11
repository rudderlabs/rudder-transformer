const { getMappingConfig, getHashFromArray } = require("../../util");

const CONFIG_CATEGORIES = {
  IDENTIFY: { name: "MARKETOIdentify" }
};
const MARKETO_STATS_CONFIGS = {
  LEAD_LOOKUP: {
    email_conf: "marketo_lead_lookup_using_email",
    userid_conf: "marketo_lead_lookup_using_userId"
  },
  ACTIVITY: {
    activity_conf: "marketo_activity"
  },
  API_CALL: {
    success: "marketo_api_call_success",
    throttled: "marketo_api_call_throttled",
    failure: "marketo_api_call_failed",
    retryable: "marketo_api_call_retryable"
  }
};
const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

const formatConfig = destination => {
  return {
    ID: destination.ID,
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
    ),
    responseRules: destination.DestinationDefinition
      ? destination.DestinationDefinition.ResponseRules
      : null
  };
};

module.exports = {
  MARKETO_STATS_CONFIGS,
  formatConfig,
  identifyConfig: MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name]
};
