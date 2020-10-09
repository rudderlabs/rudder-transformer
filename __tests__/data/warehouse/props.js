const whDefaultColumnMapping = require("../../../warehouse/config/WHDefaultConfig.js");
const whTrackColumnMapping = require("../../../warehouse/config/WHTrackConfig.js");
const whPageColumnMapping = require("../../../warehouse/config/WHPageConfig.js");
const whScreenColumnMapping = require("../../../warehouse/config/WHScreenConfig.js");
const whGroupColumnMapping = require("../../../warehouse/config/WHGroupConfig.js");
const whAliasColumnMapping = require("../../../warehouse/config/WHAliasConfig.js");

const rudderProperties = {
  default: Object.values(whDefaultColumnMapping.direct),
  track: Object.values(whTrackColumnMapping.direct),
  page: Object.values(whPageColumnMapping.direct),
  screen: Object.values(whScreenColumnMapping.direct),
  group: Object.values(whGroupColumnMapping.direct),
  alias: Object.values(whAliasColumnMapping.direct)
};

module.exports = { rudderProperties };
