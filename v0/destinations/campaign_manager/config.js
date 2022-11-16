const { getMappingConfig } = require("../../util");

const BASE_URL =
  "https://dfareporting.googleapis.com/dfareporting/v4/userprofiles";

const ConfigCategories = {
  TRACK: {
    type: "track",
    name: "CampaignManagerTrackConfig"
  }
};

const mappingConfig = getMappingConfig(ConfigCategories, __dirname);
module.exports = {
  mappingConfig,
  ConfigCategories,
  BASE_URL
};
