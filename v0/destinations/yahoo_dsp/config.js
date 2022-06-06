const BASE_ENDPOINT = "https://dspapi.admanagerplus.yahoo.com";

const ACCESS_TOKEN_CACHE_TTL = process.env.ACESS_TOKEN_CACHE_TTL
  ? parseInt(process.env.ACCESS_TOKEN_CACHE_TTL, 10)
  : 40 * 60;

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
