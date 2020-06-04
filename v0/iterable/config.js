const { getMappingConfig } = require("../util");

const ConfigCategory = {
  IDENTIFY: {
    name: "IterableIdentifyConfig",
    action: "identify",
    endpoint: "https://api.iterable.com/api/users/update",
  },
};
const mappingConfig = getMappingConfig(ConfigCategory, __dirname);
module.exports = { ConfigCategory, mappingConfig };
