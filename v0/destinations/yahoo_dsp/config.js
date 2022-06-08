const BASE_ENDPOINT = "https://dspapi.admanagerplus.yahoo.com";

const ACCESS_TOKEN_CACHE_TTL = process.env.ACESS_TOKEN_CACHE_TTL
  ? parseInt(process.env.ACCESS_TOKEN_CACHE_TTL, 10)
  : 40 * 60;

const ENDPOINTS = {
  EMAIL: "email_address",
  DEVICE_ID: "device_id",
  IP_ADDRESS: "customsegments",
  MAIL_DOMAIN: "mrt",
  POINT_OF_INTEREST: "poi"
};

const AUDIENCE_TYPE = {
  EMAIL: "email",
  DEVICE_ID: "deviceId",
  IP_ADDRESS: "ipAddress",
  MAIL_DOMAIN: "mailDomain",
  POINT_OF_INTEREST: "pointOfInterest"
};

const DSP_SUPPORTED_OPERATION = "add";
const categoryId = "categoryIds";

module.exports = {
  BASE_ENDPOINT,
  ENDPOINTS,
  ACCESS_TOKEN_CACHE_TTL,
  DSP_SUPPORTED_OPERATION,
  AUDIENCE_TYPE,
  categoryId
};
