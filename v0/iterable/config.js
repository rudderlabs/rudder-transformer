const { getMappingConfig } = require("../util");

const ConfigCategory = {
  IDENTIFY: {
    name: "IterableIdentifyConfig",
    action: "identify",
    endpoint: "https://api.iterable.com/api/users/update"
  },
  PAGE: {
    name: "IterablePageConfig",
    action: "page",
    endpoint: "https://api.iterable.com/api/events/track"
  },
  SCREEN: {
    name: "IterablePageConfig",
    action: "screen",
    endpoint: "https://api.iterable.com/api/events/track"
  }
};
const mappingConfig = getMappingConfig(ConfigCategory, __dirname);
module.exports = { ConfigCategory, mappingConfig };
