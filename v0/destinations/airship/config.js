const { getMappingConfig } = require("../../util");

const BASE_URL_US = "https://go.urbanairship.com";
const BASE_URL_EU = "https://go.airship.eu";

const ConfigCategory = {
  IDENTIFY: {
    name: "airshipIdentifyConfig",
    type: "identify"
  },
  TRACK: {
    name: "airshipTrackConfig",
    type: "track"
  }
};
const mappingConfig = getMappingConfig(ConfigCategory, __dirname);
module.exports = { ConfigCategory, mappingConfig, BASE_URL_EU, BASE_URL_US };
