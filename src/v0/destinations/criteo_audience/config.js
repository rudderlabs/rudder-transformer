const BASE_ENDPOINT = "https://api.criteo.com/2022-10/";

const CRITEO_AUDIENCE_AUTH_CACHE_TTL = process.env
  .CRITEO_AUDIENCE_AUTH_CACHE_TTL
  ? parseInt(process.env.CRITEO_AUDIENCE_AUTH_CACHE_TTL, 10)
  : 10 * 60;

const CRITEO_ADD_USER = "add";
const CRITEO_REMOVE_USER = "remove";

module.exports = {
  BASE_ENDPOINT,
  CRITEO_AUDIENCE_AUTH_CACHE_TTL,
  CRITEO_ADD_USER,
  CRITEO_REMOVE_USER
};
