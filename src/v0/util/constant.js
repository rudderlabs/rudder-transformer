const USER_LEAD_CACHE_TTL = process.env.MARKETO_LEAD_CACHE_TTL
  ? parseInt(process.env.MARKETO_LEAD_CACHE_TTL, 10)
  : 24 * 60 * 60;

const AUTH_CACHE_TTL = process.env.MARKETO_AUTH_CACHE_TTL
  ? parseInt(process.env.MARKETO_AUTH_CACHE_TTL, 10)
  : 60 * 60;

const API_CALL = 'api_call_count';

const JSON_MIME_TYPE = 'application/json';

module.exports = {
  API_CALL,
  AUTH_CACHE_TTL,
  USER_LEAD_CACHE_TTL,
  JSON_MIME_TYPE,
};
