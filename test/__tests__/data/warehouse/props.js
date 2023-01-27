const whDefaultColumnMapping = require("../../../../src/warehouse/config/WHDefaultConfig.js");
const whTrackColumnMapping = require("../../../../src/warehouse/config/WHTrackConfig.js");
const whUserColumnMapping = require("../../../../src/warehouse/config/WHUserConfig.js");
const whPageColumnMapping = require("../../../../src/warehouse/config/WHPageConfig.js");
const whScreenColumnMapping = require("../../../../src/warehouse/config/WHScreenConfig.js");
const whGroupColumnMapping = require("../../../../src/warehouse/config/WHGroupConfig.js");
const whAliasColumnMapping = require("../../../../src/warehouse/config/WHAliasConfig.js");

const rudderProperties = {
  default: Object.keys(whDefaultColumnMapping),
  track: Object.keys(whTrackColumnMapping),
  identify: Object.keys(whUserColumnMapping),
  page: Object.keys(whPageColumnMapping),
  screen: Object.keys(whScreenColumnMapping),
  group: Object.keys(whGroupColumnMapping),
  alias: Object.keys(whAliasColumnMapping)
};

module.exports = { rudderProperties };
