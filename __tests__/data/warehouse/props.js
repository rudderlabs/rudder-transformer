const util = require("util");
const whDefaultColumnMapping = require("../../../warehouse/config/WHDefaultConfig.js");
const whTrackColumnMapping = require("../../../warehouse/config/WHTrackConfig.js");
const whUserColumnMapping = require("../../../warehouse/config/WHUserConfig.js");
const whPageColumnMapping = require("../../../warehouse/config/WHPageConfig.js");
const whScreenColumnMapping = require("../../../warehouse/config/WHScreenConfig.js");
const whGroupColumnMapping = require("../../../warehouse/config/WHGroupConfig.js");
const whAliasColumnMapping = require("../../../warehouse/config/WHAliasConfig.js");

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
