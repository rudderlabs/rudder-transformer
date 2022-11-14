const BASE_ENDPOINT = "https://api.criteo.com/2022-10/";

const ACCESS_TOKEN_CACHE_TTL = process.env.ACESS_TOKEN_CACHE_TTL
  ? parseInt(process.env.ACCESS_TOKEN_CACHE_TTL, 10)
  : 15 * 60;

const CRITEO_ADD_USER = "add";
const CRITEO_REMOVE_USER = "remove";

module.exports = {
  BASE_ENDPOINT,
  ACCESS_TOKEN_CACHE_TTL,
  CRITEO_ADD_USER,
  CRITEO_REMOVE_USER
};
