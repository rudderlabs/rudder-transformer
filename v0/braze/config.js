const { getMappingConfig } = require("../util");

const ConfigCategory = {
  IDENTIFY: {
    name: "BrazeUserAttributesConfig"
  },
  DEFAULT: {
    name: "BrazeUserAttributesConfig"
  }
};

const getIdentifyEndpoint = endPoint => {
  return `${endPoint}/users/identify`;
};

const getTrackEndPoint = endPoint => {
  return `${endPoint}/users/track`;
};

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

module.exports = {
  ConfigCategory,
  mappingConfig,
  getIdentifyEndpoint,
  getTrackEndPoint
};
