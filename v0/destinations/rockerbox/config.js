const { getMappingConfig } = require("../../util");

const WEBHOOKBASEENDPOINT = "https://webhooks.getrockerbox.com/webhook/data";

const CONFIG_CATEGORIES = {
  TRACK: {
    name: "RockerboxTrackConfig",
    type: "track",
    endpoint: `${WEBHOOKBASEENDPOINT}`,
    method: "POST"
  }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  WEBHOOKBASEENDPOINT,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG
};
