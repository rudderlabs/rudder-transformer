const { getMappingConfig } = require("../../util");

const BASE_ENDPOINT = "https://dspapi.admanagerplus.yahoo.com";

// const CONFIG_CATEGORIES = {
//   MAIL_DOMAIN: { name: "YahooDspMailDomainConfig" },
//   POI: { name: "YahooDspPOIConfig" }
// };

// const mappingConfig = getMappingConfig(CONFIG_CATEGORIES, __dirname);

const ACCESS_TOKEN_CACHE_TTL = process.env.ACESS_TOKEN_CACHE_TTL
  ? parseInt(process.env.ACCESS_TOKEN_CACHE_TTL, 10)
  : 60 * 60;

const ENDPOINTS = {
  email: "email_address",
  deviceId: "device_id",
  ipAddress: "customsegments",
  mailDomain: "mrt",
  pointOfInterest: "poi"
};

module.exports = {
  BASE_ENDPOINT,
  ENDPOINTS,
  ACCESS_TOKEN_CACHE_TTL
};
