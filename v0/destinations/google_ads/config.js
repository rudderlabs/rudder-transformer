const { getMappingConfig } = require("../../util");

const baseEndpoint = "hhttps://www.googleadservices.com/pagead/conversion/app/";

const CONFIG_CATEGORIES = {
    TRACK: {  name: "GoogleAdsTrackConfig" }
  };
  
  const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);
  
  module.exports = {
    CONFIG_CATEGORIES,
    MAPPING_CONFIG,
    baseEndpoint
  };