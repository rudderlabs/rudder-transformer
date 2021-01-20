const { getMappingConfig } = require("../../util");

const ConfigCategory = {
  IDENTIFY: {
    name: "BrazeUserAttributesConfig"
  },
  DEFAULT: {
    name: "BrazeUserAttributesConfig"
  }
};

function getIdentifyEndpoint(endPoint) {
  return `${endPoint}/users/identify`;
}

function getTrackEndPoint(endPoint) {
  return `${endPoint}/users/track`;
}

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

const BRAZE_PARTNER_NAME = "RudderStack";

// max requests per batch
// Ref: https://www.braze.com/docs/api/endpoints/user_data/post_user_track/
const BRAZE_MAX_REQ_COUNT = 75;

module.exports = {
  ConfigCategory,
  mappingConfig,
  getIdentifyEndpoint,
  getTrackEndPoint,
  BRAZE_PARTNER_NAME,
  BRAZE_MAX_REQ_COUNT
};
