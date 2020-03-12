const { getMappingConfig } = require("../util");

const ConfigCategory = {
  PAGE: {
    name: "LPPageConfig",
    action: "advance"
  },
  IDENTIFY: {
    name: "LPIdentifyConfig",
    action: "setUserAttributes"
  },
  TRACK: {
    name: "LPTrackConfig",
    action: "track"
  },
  SCREEN: {
    name: "LPScreenConfig",
    action: "advance"
  }
};

const ENDPOINT = "https://api.leanplum.com/api";
const API_VERSION = "1.0.6";
const RETRY_COUNT = 5;

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

module.exports = {
  ConfigCategory,
  mappingConfig,
  ENDPOINT,
  API_VERSION,
  RETRY_COUNT
};


// "optional": {
//   "params.path": ["properties.path"],
//   "params.referrer": ["properties.referrer"],
//   "params.search": ["properties.search"],
//   "params.title": ["properties.title"],
//   "params.url": ["properties.url"],
//   "deviceId": ["context.device.id"]
// }
// }