const { getMappingConfig } = require("../../util");

const CONFIG_CATEGORIES = {
  TRACK: { name: "TVSQUAREDGenericConfig", type: "Action" },
  IDENTIFY: { name: "TVSQUAREDGenericConfig", type: "Session" },
  _CVAR: { name: "TVSQUARED_cvarConfig" },
  CVAR: { name: "TVSQUAREDcvarConfig"}
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG
};
