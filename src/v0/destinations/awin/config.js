const { getMappingConfig } = require("../../util");

const BASE_URL = "https://www.awin1.com/sread.php";

const DESTINATION = "awin";

const ConfigCategory = {
  TRACK: {
    name: "trackConfig"
  }
};

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

module.exports = {
  BASE_URL,
  DESTINATION,
  ConfigCategory,
  mappingConfig
};
