const whDefaultColumnMapping = require("../../../warehouse/config/WHDefaultConfig.json");
const whTrackColumnMapping = require("../../../warehouse/config/WHTrackConfig.json");
const whPageColumnMapping = require("../../../warehouse/config/WHPageConfig.json");
const whScreenColumnMapping = require("../../../warehouse/config/WHScreenConfig.json");
const whGroupColumnMapping = require("../../../warehouse/config/WHGroupConfig.json");
const whAliasColumnMapping = require("../../../warehouse/config/WHAliasConfig.json");

const rudderProperties = {
  default: Object.values(whDefaultColumnMapping),
  track: Object.values(whTrackColumnMapping),
  page: Object.values(whPageColumnMapping),
  screen: Object.values(whScreenColumnMapping),
  group: Object.values(whGroupColumnMapping),
  alias: Object.values(whAliasColumnMapping)
};

module.exports = { rudderProperties };
